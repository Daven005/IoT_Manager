global.moment = require('moment');
var assert = require('assert');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);
const sleep = ms => new Promise(res => setTimeout(res, ms));

async function doSleep(ms) {
  await sleep(ms)
  console.log(`ready ${Date.now()}`)
  assert(deviceState.getLatestLight('Hollies9c46c5', 1), 1112);
  assert(deviceState.getLatestTemperature('Hollies71e00', 0), 20.1);
  var s = deviceState.getRecord('Hollies9c46c5');
}

function configLoaded(cfg) {
  global.config = cfg;
  config.database.host = "192.168.1.100"; // Need to be able to write to 'cloud' table
  try {
    var mqtt = require('mqtt');
    global.client = mqtt.connect(config.mqtt.host, {
      protocolVersion: config.mqtt.protocolVersion,
      protocolId: config.mqtt.protocolId
    });
    var dbs = require('./dbSetup');
    dbs.init(() => {
      global.deviceState = require('./DeviceState.js').DeviceState;
      var dsm = require('./DeviceState.js'); // Module
      dsm.init(() => {
        var message = require('./message');

        message.decode('/Raw/Hollies9c46c5/1/info', '{"Type":"Light", "Value":"912"}');
        message.decode('/Raw/Hollies9c46c5/1/info', '{"Type":"Light", "Value":"1012"}');
        message.decode('/Raw/Hollies9c46c5/1/info', '{"Type":"Light", "Value":"1112"}');
        message.decode("/Raw/Hollies71e00/2/info", '{"Type":"PIR", "Value":0}');
        message.decode("/Raw/Hollies71e00/0/info", '{"Type":"Temp", "Value":20.1}');
        message.decode("/Raw/Hollies71e00/1/info", '{"Type":"Hum", "Value":100}');
        console.log(`ready ${Date.now()}`)
        doSleep(10000);
      });

    });
  } catch (e) {
    console.log(e.stack);
  }
}