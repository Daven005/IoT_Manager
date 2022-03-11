global.config;
var assert = require('assert');
var x;
require('./config').read((cfg) => {
    global.config = cfg;
    config.database.host = "IOT1"; // Need to be able to read Devices
    var dbs = require('./dbSetup');
    try {
        dbs.init(() => {
            global.deviceState = require('./DeviceState.js').DeviceState;
            var dsm = require('./DeviceState.js'); // Module
            try {
                dsm.init(() => {

                    deviceState.setLatestTemperature('a', 'x1', 10.2);
                    assert((x = deviceState.getLatestTemperature('a', 'x1')) == 10.2, `${x} is wrong latest`);

                    deviceState.setLatestTemperature('a', 'x1', 10.3);
                    deviceState.setLatestTemperature('a', 'x1', 10.4);
                    deviceState.setLatestTemperature('a', 'x1', 10.5);
                    deviceState.setLatestTemperature('a', 'x1', 10.6);
                    console.log(deviceState.getAverageTemperature('a', 'x1'));
                    console.log(deviceState.getTemperatureChange('a', 'x1'));
                    console.dir(deviceState.list(), {depth: null});

                    deviceState.show();
                });
            } catch (e) {
                console.log(e.stack);
            }
        });
    } catch (e) {
        console.log(e.stack);
    }
});