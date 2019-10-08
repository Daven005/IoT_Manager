global.moment = require('moment');
global.sunCalc = require('suncalc');
global.sun = require('./sun');

"use strict";
global.config;
require('./config').read((cfg) => {
    global.config = cfg;
    config.database.host = "IOT1"; // Need to be able to write to 'cloud' table
    var dbs = require('./dbSetup');
    global.weather = require('./weather');
    try {
        dbs.init(() => {
            var mp = require('./managePower'); // NB this sets up getCloud for managePower
            mp.init(() => {
                weather.load(() => {
                    mp.powerJob2();
                    setInterval(() => {
                        weather.load()
                    }, 5 * 60 * 1000);
                })
            });
        });
    } catch (e) {
        console.log(e.stack);
    }
});