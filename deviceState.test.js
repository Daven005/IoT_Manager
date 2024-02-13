global.config;
var assert = require('assert');
var x;

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function setTemp(val) {
  deviceState.setLatestTemperature('a', 'x1', val);
  return await sleep(1000);
}

async function setTemps() {
  for (temp = 10; temp < 11; temp += 0.1) {
    await setTemp(temp);
  }
  console.log(deviceState.getAverageTemperature('a', 'x1'));
  console.log(deviceState.getTemperatureChange('a', 'x1'));
  console.dir(deviceState.list(), { depth: null });
}

require('./config').read((cfg) => {
  global.config = cfg;
  config.database.host = "192.168.1.100"; // Need to be able to read Devices
  var dbs = require('./dbSetup');
  try {
    dbs.init(() => {
      global.deviceState = require('./DeviceState.js').DeviceState;
      var dsm = require('./DeviceState.js'); // Module
      try {
        dsm.init(() => {
          var temp = 10;

          deviceState.setLatestLight('b', 1, 100);
          deviceState.setLightName('b', 1, 'Light Level');
          assert(deviceState.getLatestLight('b', 1), 100);

          deviceState.setLatestTemperature('a', 'x1', temp);
          assert((x = deviceState.getLatestTemperature('a', 'x1')) == temp, `${x} is wrong latest`);
          let s = deviceState.list();
          console.log(`deviceState ${JSON.stringify(s,['name', 'location'])}`);
          setTemps();
          // setTemp(temp += 0.1)
          // .then(setTemp(temp += 0.1))
          // .then(setTemp(temp += 0.1))
          // .then(setTemp(temp += 0.1))
          // .then(setTemp(temp += 0.1))
          // deviceState.setLatestTemperature('a', 'x1', 10.3);
          // deviceState.setLatestTemperature('a', 'x1', 10.4);
          // deviceState.setLatestTemperature('a', 'x1', 10.5);
          // deviceState.setLatestTemperature('a', 'x1', 10.6);
        });
      } catch (e) {
        console.log(e.stack);
      }
    });
  } catch (e) {
    console.log(e.stack);
  }
});