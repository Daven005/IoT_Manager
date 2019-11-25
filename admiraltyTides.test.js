"use strict";
global.config;
global.moment = require('moment');

var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var tides = require('./admiraltyTides');
        var weather = require('./weather');
    } catch(e) {
        console.log(e.stack)
    }
    weather.load(() => {
        tides.load(() => {
            console.log('done');
            console.log(`done ${JSON.stringify(tides.get(), null, 2)}`);
        });
    });
}


