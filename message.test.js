global.moment = require('moment');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    config.database.host = "IOT1"; // Need to be able to write to 'cloud' table
    try {
        var mqtt = require('mqtt');
        global.client = mqtt.connect(config.mqtt.host, {
            protocolVersion: config.mqtt.protocolVersion,
            protocolId: config.mqtt.protocolId
        });
        var dbs = require('./dbSetup');
        dbs.init(() => {
            global.deviceState = require('./DeviceState.js').DeviceState;
            var message = require('./message');
            message.decode("/Raw/Hollies71e00/2/info", '{"Type":"PIR", "Value":0}');
            message.decode("/Raw/Hollies71e00/0/info", '{"Type":"Temp", "Value":20.1}');
            message.decode("/Raw/Hollies71e00/1/info", '{"Type":"Hum", "Value":100}');
        });
    } catch (e) {
        console.log(e.stack);
    }
}