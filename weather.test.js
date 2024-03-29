global.moment = require('moment');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    global.config.publish = false;
    try {
        var weather = require('./weather');
        weather.load(() => weather.publish());
    } catch(e) {
        console.log(e.stack);
    }
}