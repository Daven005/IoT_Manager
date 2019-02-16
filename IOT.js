"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

console.log("**********IoT Started**********");
function configLoaded(cfg) {
	global.config = cfg;
}

var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var path = require('path');
var app = express();
var app_mobile = express();
var httpRequest = require('request');
var bodyParser = require('body-parser');
global.moment = require('moment');
global.sunCalc = require('suncalc');
global.isNumeric = require("isnumeric");
global.errorLog = require('./errorLog.js');
global.alarmLog = require('./alarmLog.js');
global.deviceState = require('./DeviceState.js').DeviceState;
var sound = require('aplay');
global.beep = new sound();
beep.play('./alert.wav');

global.utils = require('./utils');
app.locals.pretty = true;
app.locals.setHue = utils.setHue;
app_mobile.locals.setHue = utils.setHue;
// app.locals.moment = require('moment');

var stdin = process.openStdin();
stdin.addListener("data", consoleIn);

if (!config.loaded) {
	console.log("No config file");
	process.exit(1);
} else {
	console.log(config);
}
var modbus = require('./modbus');
global.tlc = require('./tlc');

var mqtt = require('mqtt');
global.client = mqtt.connect(config.mqtt.host, 
	{protocolVersion: config.mqtt.protocolVersion, protocolId: config.mqtt.protocolId});

global.sql = require('mysql');
var db_info = {
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.database
};
global.db = sql.createConnection(db_info);
db.connect(err => {
  if (err) {
    console.error('An error occurred while connecting to the DB')
    throw err
  }
});
db.on('error', function(err) {
  console.log('Db error:: '+err.code+': '+err.message); // 'ER_BAD_DB_ERROR'
});
console.log("DB connected using %j", db_info);

var sessionStoreOptions = {
  createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist. 
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

global.desktop_port = config.browser.desktopPort;
global.mobile_port = config.browser.mobilePort;

function consoleIn(d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that  
  // with toString() and then trim() 
  var cmd = d.toString().trim().toLowerCase();
  if (cmd == "clear") {
    console.log('\x1B[0;0H\x1B[2J');
  } else if (cmd == "close") {
    console.log('Closing');
    process.exit();
  } else if (cmd == "time") {
    console.log(moment().format('X'));
    var t = Math.floor(Date.now() / 1000);
    var d = new Date();
    console.log(d.getTimezoneOffset());
  } else if (cmd == "tlc") {
    tlc.checkTLcs();
  } else if (cmd == "getweather") {
    weather.get();
  } else if (cmd == "newheat") {
    processHeating.test2(Date.now());
  } else if (cmd == "checkheat") {
    processHeating.check(Date.now());
  } else {
    console.log("?? >%s", cmd);
  }
}
  
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(__dirname));
app.use('views', express.static(path.join(__dirname, '/views')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  name: 'session',
  secret: 'ciSBiOsteDisaLIWo|eXtBAnStRtiGmiSA', // should be a large unguessable string
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  maxAge: 1 * 60 * 60 * 1000, // how long the session will stay valid in ms
  cookie: {
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));
  
app_mobile.set('views', './views');
app_mobile.set('view engine', 'jade');
app_mobile.use(express.static(__dirname));
app_mobile.use('views', express.static(path.join(__dirname, '/views')));
app_mobile.use(bodyParser.json()); // support json encoded bodies
app_mobile.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app_mobile.use(session({
  name: 'session',
  secret: 'ciSBiOsteDisaLIWo|eXtBAnStRtiGmiSA', // should be a large unguessable string
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  maxAge: 1 * 60 * 60 * 1000, // how long the session will stay valid in ms
  cookie: {
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));

var login = require('./login');
app.get("/login", login.doLogin);
app_mobile.get("/login", login.doMobileLogin);
app.get("/loginResponse", login.checkResponse);
app_mobile.get("/loginResponse", login.checkResponse);
app.use(login.saveInfoDesktop);
app_mobile.use(login.saveInfoMobile);

client.subscribe('/App/#');
client.subscribe('/Raw/#');
client.publish('/Raw/Hollies000000/info', '{"Name": "Weather", "Location": "Outside"}');

var processHeating = require('./processHeating');
processHeating.load(true);
console.log("Heating started");
setInterval(processHeating.check, 1*60*990); // Just under 1 minute

var processDeletes = require('./processDeletes');
setInterval(processDeletes.check, 2*60*999); // Just under 2 minutes

var weather = require('./weather');
weather.get();
weather.publish();
setInterval(weather.get, 10*60*995); // Just under 10 minutes

var time = require('./time');
time.publish();
setInterval(time.publish, 2*60*1000); // 2 minutes

var monitor = require('./monitor');
monitor.checkNetwork();
setInterval(monitor.checkNetwork, 5*60*1000);

var message = require('./message'); // Decode MQTT messages
client.on('message', message.decode);

app.use(express.static(path.join(__dirname + 'public'))); //Serves resources from public folder
var graph = require('./graph');
var dailyGraph = require('./dailyGraph');
app.get("/graph", graph.show);
app.get("/dailyGraph", dailyGraph.show);
app_mobile.get("/graph", graph.show);

var override = require('./override');
app.get("/Override/Output", override.output);
app.get("/Override/Input", override.input);
app.get("/Override/Flow", override.flow);
app.get("/Override/Pressure", override.pressure);
app.get("/Override/Temperature", override.temperature);

var logs = require('./logs');
app.get("/errors", logs.showErrors);
app_mobile.get("/errors", logs.showMobileErrors);
app.get("/alarms", logs.showAlarms);
app_mobile.get("/alarms", logs.showMobileAlarms);

var menu = require('./menu');
app.get("/menu", menu.get);
app_mobile.get("/menu", menu.get);

var ledMessage = require('./ledMessage');
app.get("/message", ledMessage.get);

var lights = require('./lights');
app.get("/lights", lights.get);
app.post("/lights", lights.post);
app.post("/lights/colours", lights.postColours);
app.post("/lights/patterns", lights.postPatterns);
app.post("/lights/pattern", lights.postPattern);
app.post("/lights/playlist", lights.playlist);

var manage = require('./manage');
app.get('/Manage/Settings', manage.settings);
//app.get("/Manage/Devices", manage.devices);
app.get("/Manage/Sensors", manage.sensors);
app.get("/Manage/Mapping", manage.updateMapping);

var heating = require('./heating');
var processHeating = require('./processHeating');
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

var signal = require('./signal');
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

app.get('/tlc/testPIR', tlc.testPIR);
app.get('/tlc/scenes', tlc.showScenes);
app.post('/tlc/setScene', tlc.setScene);
app.get('/tlc/setScene', tlc.setScene);
app.post('/tlc/setChannels', tlc.setChannels);
app_mobile.get('/tlc/scenes', tlc.showMobileScenes);
app.get('/tlc/areas', tlc.areas);
app.get('/tlc/info', tlc.info);

app.post('/hollies/setScene', tlc.setSceneDecode);
app.post('/hollies/getZoneInfo', heating.zoneInfoByName);
app.post('/hollies/overrideHeating', heating.voiceOverrides);
app.get('/hollies/whyFiring', heating.whyFiring);
app.post('/hollies/whyFiring', heating.whyFiring);
app.get('/hollies/lightingChannels', tlc.setDesktopLightingChannels);
app_mobile.get('/hollies/lightingChannels', tlc.setMobileLightingChannels);
app.get('/hollies/lightingChannel', tlc.getLightingChannel);
app_mobile.get('/hollies/lightingChannel', tlc.getLightingChannel);
app.get('/hollies/lighting/getAllDeviceInfo', tlc.getAllDeviceInfo);
app.get('/hollies/heating/getAllDeviceInfo', heating.getAllDeviceInfo);
app.get('/hollies/heating/override', heating.externalSetOverride);

var dashboard = require('./dashboard');
app.get("/Dashboard", dashboard.get);
app_mobile.get("/Dashboard", dashboard.get);

var pond = require('./pond');
app.get("/Pond", pond.show);
app.get("/Pond/schedule", pond.schedule);
app_mobile.get("/Pond", pond.show);
app_mobile.get("/Pond/set", pond.set);

var watering = require('./watering');
app.get("/Watering/schedule", watering.schedule);
app.get("/Watering/restore", watering.restore);
app.get("/Watering/update", watering.getUpdate);
app.post("/Watering/settings", watering.settings);

app.get("/", defaultPage);
app.get("/index*", defaultPage);;
app.get("/default*", defaultPage);
app_mobile.get("/", defaultMobilePage);

function defaultPage(request, response) {
  response.render("intro", {loggedIn: request.loggedIn});
}

function defaultMobilePage(request, response) {
  response.render("introMobile", {loggedIn: request.loggedIn});
}

app.listen(desktop_port);
console.log("App Server Running on %d", desktop_port);
app_mobile.listen(mobile_port);
console.log("App_Mobile Server Running on %d", mobile_port);
