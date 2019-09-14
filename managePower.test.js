global.moment = require('moment');
global.sunCalc = require('suncalc');
global.sun = require('./sun');

"use strict";
global.config;
require('./config').read((cfg) => {
    global.config = cfg;
    var dbs = require('./dbSetup');
    global.weather = require('./weather');
    try {
        dbs.init(() => {
            weather.load(() => {
                var mp = require('./managePower');
                mp.init(() => {
                    // mp.powerFlowJob();
                    mp.powerJob();
                    setInterval(() => { weather.load() }, 5 * 60 * 1000);
                })
            });
        });
    } catch (e) {
        console.log(e.stack);
    }
});