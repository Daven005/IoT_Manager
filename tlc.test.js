"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);
global.moment = require('moment');
global.sunCalc = require('sunCalc');

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var tlc_if = require('./tlcinterface');
        var tlc = require('./tlc.js');
    } catch(e) {
        console.log(e.stack)
    }
    var dbs = require('./dbSetup');
    try {
        dbs.init(() => {
            global.deviceState = require('./DeviceState.js').DeviceState;
            var dsm = require('./DeviceState.js'); // Module
            try {
                dsm.init(() => {
                    if (tlc) {
                        tlc.onReady(() => {
                            console.log(`tlc status: ${tlc.status}`);
                            console.log("All ready");
                        });
                    }
                });
            } catch (e) {
                console.log(e.stack);
            }
        });
    } catch (e) {
        console.log(e.stack);
    }
}
