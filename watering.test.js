global.moment = require('moment');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var watering = require('./watering');
    } catch(e) {
        console.log(e.stack);
    }
    watering.checkOutputs();
}