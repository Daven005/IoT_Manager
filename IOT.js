"use strict";
global.config;
var util = require('util');
console.log("**********IoT Starting**********");
process.on('uncaughtException', (err) => { 
    console.log(err);
});
require('./config').read(configLoaded); // See below

var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var path = require('path');
global.app = express(); // Used by tlcMonitor
var app_mobile = express();
var app_guest = express();
var bodyParser = require('body-parser');
//var sound = require('aplay');

global.moment = require('moment');
global.sunCalc = require('suncalc');
global.isNumeric = require("isnumeric");
global.errorLog = require('./errorLog.js');
global.alarmLog = require('./alarmLog.js');
global.deviceState = require('./DeviceState.js').DeviceState;
global.utils = require('./utils');
global.sun = require('./sun');
// global.beep = new sound();
// beep.play('./alert.wav');

// Set modules up as global to this module
var processHeating = require('./processHeating');
var processDeletes = require('./processDeletes');
var weather = require('./weather');
var managePower = require('./managePower'); // NB this sets up getCloud for managePower from weather
var tides = require('./admiraltyTides');
var time = require('./time');
var monitor = require('./monitor');
var graph = require('./graph');
var dailyGraph = require('./dailyGraph');
var override = require('./override');
var logs = require('./logs');
var menu = require('./menu');
var lights = require('./lights');
var manage = require('./manage');
var heating = require('./heating');
var signal = require('./signal');
var dashboard = require('./dashboard');
var commands = require('./commands');
var pond = require('./pond');
var watering = require('./watering');
var camera = require('./camera');
var tlcEdit = require('./tlcEdit');
var tlcMonitor = require('./tlcMonitor');

function configLoaded(cfg) {
    global.config = cfg;

    // All these require config
    var dbs = require('./dbSetup');
    require('./modbus');
    global.tlc = require('./tlc');

    var mqtt = require('mqtt');
    global.client = mqtt.connect(config.mqtt.host, {
        protocolVersion: config.mqtt.protocolVersion,
        protocolId: config.mqtt.protocolId
    });

    var message = require('./message'); // Decode MQTT messages
    client.on('message', message.decode);
    client.on('connect', () => {
        console.log("MQTT connected");
        client.subscribe('/App/#');
        client.subscribe('/Raw/#');
        client.publish('/Raw/Hollies000000/info', '{"Name": "Weather", "Location": "Outside"}'); 
    })
    dbs.init(() => { // Only called if successful
        console.log(`dbs init done`);
        var sessionStoreOptions = {
            createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist. 
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'session_id',
                    expires: 'expires',
                    data: 'data'
                }
            }
        };
        var sessionStore = new MySQLStore(sessionStoreOptions, db);
        var sessionOptions = {
            name: 'session',
            secret: 'ciSBiOsteDisaLIWo|eXtBAnStRtiGmiSA', // should be a large unguessable string
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            maxAge: 4 * 60 * 60 * 1000, // (4 hours) how long the session will stay valid in ms
            cookie: {
                httpOnly: true, // when true, cookie is not accessible from javascript
                secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
            }
        };
        setupExpress(sessionOptions);
        setupLogin();
        setupIntervalFunctions();
        setupWeb();

        app.listen(config.browser.desktopPort);
        console.log(`App Server Running on ${config.browser.desktopPort}`);
        app_mobile.listen(config.browser.mobilePort);
        console.log(`App_Mobile Server Running on ${config.browser.mobilePort}`);
        app_guest.listen(config.browser.guestPort);
        console.log(`Guest Server Running on ${config.browser.guestPort}`);
    });
}

function setupExpress(sessionOptions) {
    app.locals.pretty = true;
    app.locals.setHue = utils.setHue;
    app_mobile.locals.setHue = utils.setHue;
    app_guest.locals.setHue = utils.setHue;

    app.set('views', './views');
    app.set('view engine', 'pug');
    app.use(express.static(__dirname));
    app.use('views', express.static(path.join(__dirname, '/views')));
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app.use(session(sessionOptions));

    app_mobile.set('views', './views');
    app_mobile.set('view engine', 'pug');
    app_mobile.use(express.static(__dirname));
    app_mobile.use('views', express.static(path.join(__dirname, '/views')));
    app_mobile.use(bodyParser.json()); // support json encoded bodies
    app_mobile.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app_mobile.use(session(sessionOptions));

    app_guest.set('views', './views');
    app_guest.set('view engine', 'pug');
    app_guest.use(express.static(__dirname));
    app_guest.use('views', express.static(path.join(__dirname, '/views')));
    app_guest.use(bodyParser.json()); // support json encoded bodies
    app_guest.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app_guest.use(session(sessionOptions));

    app.use(express.static(path.join(__dirname + 'public'))); //Serves resources from public folder
}

function setupLogin() {
    var login = require('./login');
    app.get("/login", login.doLogin);
    app_mobile.get("/login", login.doMobileLogin);
    app.get("/loginResponse", login.checkResponse);
    app_mobile.get("/loginResponse", login.checkResponse);
    app.use(login.saveInfoDesktop);  // express.router functions
    app_mobile.use(login.saveInfoMobile); // ""
}

function setupIntervalFunctions() {
    processHeating.load("Heating started");
    setInterval(() => {
        processHeating.check("Background heating check")
    }, 1 * 60 * 990); // Just under 1 minute

    setInterval(processDeletes.check, 5 * 60 * 999); // Just under 5 minutes

    managePower.init(() => {
        weather.load(() => {
            managePower.powerJob();
            weather.publish(); // Done straight away for Boiler Control
            setInterval(weather.load, 10 * 60 * 1000);
            setInterval(weather.publish, 2 * 60 * 1000 - 4); // Just under 2 minutes
        });
    });
    sun.load();
    setInterval(sun.load, 15 * 60 * 1000 - 4); // Just under 1 minute
    setInterval(sun.publish, 1 * 60 * 1000 - 4); // Just under 1 minute

    tides.load(() => console.log("Tides loaded"));
    setInterval(tides.load, 60 * 60 * 1000 - 5); // Every hour

    time.publish();
    setInterval(time.publish, 2 * 60 * 1000); // 2 minutes

    monitor.checkNetwork();
    setInterval(monitor.checkNetwork, 5 * 60 * 1000);

    global.PV = require('./processPV');
    PV.init();

    global.WD = require('./workdays');
    WD.init(() => console.log("Workdays set up"));
}

function setupWeb() {
    app.get("/graph", graph.show);
    app.get("/dailyGraph", dailyGraph.show);
    app_mobile.get("/graph", graph.show);
    app.get("/Override/Output", override.output);
    app.get("/Override/Device", override.device);
    app.get("/Override/Input", override.input);
    app.get("/Override/Flow", override.flow);
    app.get("/Override/Pressure", override.pressure);
    app.get("/Override/Temperature", override.temperature);

    app.get("/errors", logs.showErrors);
    app_mobile.get("/errors", logs.showMobileErrors);
    app.get("/alarms", logs.showAlarms);
    app_mobile.get("/alarms", logs.showMobileAlarms);

    app.get("/menu", menu.get);
    app_mobile.get("/menu", menu.get);

    var ledMessage = require('./ledMessage');
    app.get("/message", ledMessage.get);

    app.get("/lights", lights.get);
    app.post("/lights", lights.post);
    app.post("/lights/colours", lights.postColours);
    app.post("/lights/patterns", lights.postPatterns);
    app.post("/lights/pattern", lights.postPattern);
    app.post("/lights/playlist", lights.playlist);

    app.get('/Manage/Settings', manage.settings);
    app.get("/Manage/Devices", manage.deviceList);
    app.get("/Manage/DeviceState", manage.showDeviceState);
    app.get("/Manage/Sensors", manage.sensors);
    app.get("/Manage/Sensors/getDeviceInfo", manage.getDeviceInfo);
    app.get("/Manage/Mapping", manage.updateMapping);

    app.get("/Heating/temperatureDevice", heating.temperatureDevice);
    app.get("/Heating/temperatureSensor", heating.temperatureSensor);
    app.get("/Heating/controlDevice", heating.controlDevice);
    app.get("/Heating/controlSensor", heating.controlSensor);
    app.get("/Heating/days", heating.days);
    app.get("/Heating/zone", heating.zones);
    app.get("/Heating/Override", heating.override);
    //app.get("/Heating/boost", heating.boost);
    app.get("/Heating", heating.manage);
    app.get("/testHeating", processHeating.test);

    app.get("/Heating/mobileOverrides", heating.mobileOverrides);
    app.get("/Heating/mobileGroups", heating.mobileGroups);

    app_mobile.get("/Heating/mobileOverrides", heating.mobileOverrides);
    app_mobile.get("/Heating/mobileGroups", heating.mobileGroups);
    app_mobile.get("/Heating/rooms", heating.temperatureDials);
    app_mobile.get("/Heating/zones", heating.zonesInfo);
    app.get("/Heating/zones", heating.zonesInfo);

    app.get("/Heating/workdays", heating.workdays);
    app_mobile.get("/Heating/workdays", heating.workdays);
    app_guest.get("/Heating/workdays", heating.workdays);

    app_guest.get("/", heating.guestOverrides);

    app.get("/Signal/Gate", signal.gate);
    app_mobile.get("/Signal/Gate", signal.gate);
    app.get("/Signal/Socket", signal.socket);
    app_mobile.get("/Signal/Socket", signal.socket);
    app.get("/Signal/Manual", signal.manual);
    app_mobile.get("/Signal/Manual", signal.manual);

    global.wifiGate = require('./wifiGate');
    app.get("/WiFiGate/operate", wifiGate.operate);
    app_mobile.get("/WiFiGate/operate", wifiGate.operate);
    app.get("/WiFiGate/monitor", wifiGate.monitor);
    app_mobile.get("/WiFiGate/monitor", wifiGate.monitorMobile);
    app.get("/WiFiGate/sse", wifiGate.sse);
    app_mobile.get("/WiFiGate/sse", wifiGate.sse);

    app.post('/hollies/getZoneInfo', heating.zoneInfoByName);
    app.post('/hollies/overrideHeating', heating.voiceOverrides);
    app.get('/hollies/whyFiring', heating.whyFiring);
    app.post('/hollies/whyFiring', heating.whyFiring);
    app.get('/hollies/heating/getAllDeviceInfo', heating.getAllDeviceInfo);
    app.get('/hollies/heating/override', heating.externalSetOverride);

    if (tlc) {
        // console.log(`+++++++++ tlC object ready: ${util.inspect(tlc)}`);
        // tlc.onReady(() => {
            console.log(`tlc status (1): ${tlc.status1()}`);
            // setTimeout(() => {
                // console.log(`tlc status (2): ${tlc.status1()}`);
                app.get('/tlc/scenes', tlc.showScenes);
                app.post('/tlc/setScene', tlc.setScene);
                app.get('/tlc/setScene', tlc.setScene);
                app.post('/tlc/setChannels', tlc.setChannels);
                app_mobile.get('/tlc/scenes', tlc.showMobileScenes);
                app.get('/tlc/areas', tlc.areas);
                app.get('/tlc/sceneAreaChannels', tlc.sceneAreaChannels);
                app.get('/tlc/areaChannels', tlc.areaChannels);
                app.get('/tlc/info', tlc.info);
                app.get('/tlc/test', tlc.test);
                app.get('/hollies/lightingChannels', tlc.setDesktopLightingChannels);
                app.post('/hollies/setScene', tlc.setSceneDecode);
                app_mobile.get('/hollies/lightingChannels', tlc.setMobileLightingChannels);
                app.get('/hollies/lightingChannel', tlc.getLightingChannel);
                app_mobile.get('/hollies/lightingChannel', tlc.getLightingChannel);
                app.get('/hollies/lighting/getAllDeviceInfo', tlc.getAllDeviceInfo);
                tlcEdit.onReady(() => {
                    // console.log(`+++++++++ TLcEdit object ready: ${util.inspect(tlcEdit)}`);
                    app.get("/tlc/Edit", tlcEdit.show);
                    app.get("/tlc/Edit/getMeta", tlcEdit.getMeta);
                    app.get('/tlc/Monitor', tlcMonitor.show);
                    // app.get('/tlc/Monitor/open', tlcMonitor.open);
                });
            // }, 500);
        // });
} else {
    console.error(`No tlc object`);
}
    app.get("/Dashboard", dashboard.get);
    app_mobile.get("/Dashboard", dashboard.get);

    // See app.post("/Commands/PassiveL"... in commands.js
    app.get("/Commands", commands.get);

    app.get("/Pond", pond.show);
    app.get("/Pond/schedule", pond.schedule);
    app_mobile.get("/Pond", pond.show);
    app_mobile.get("/Pond/set", pond.set);

    app.get("/Watering/schedule", watering.schedule);
    app.get("/Watering/update", watering.getUpdate);
    app.post("/Watering/settings", watering.settings);
    app_mobile.get("/Watering/schedule", watering.mobileSchedule);
    app_mobile.get("/Watering/update", watering.getUpdate);
    app_mobile.post("/Watering/settings", watering.settings);
    app.get("/tides", tides.show);

    app_mobile.get("/Camera", camera.load);
    app_mobile.get("/Camera/action", camera.action);

    // app.get("/charge/rates", charge.rates);
    // app.get("/charge/status", charge.status);
    // app.get("/charge/control", charge.control);

    app.get("/", defaultPage);
    app.get("/index*", defaultPage);;
    app.get("/default*", defaultPage);
    app_mobile.get("/", defaultMobilePage);

    app.get("/SystemCheck", (request, response) => {
        response.end("OK");
    });

    function defaultPage(request, response) {
        response.render("intro", {
            loggedIn: request.loggedIn
        });
    }

    function defaultMobilePage(request, response) {
        response.render("introMobile", {
            loggedIn: request.loggedIn
        });
    }
}