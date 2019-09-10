global.moment = require('moment');
global.sunCalc = require('suncalc');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var sun = require('./sun');
        sun.load();
        sun.publish();
        console.log(JSON.stringify(sun.get()));
    } catch(e) {
        console.log(e.stack);
    }
}