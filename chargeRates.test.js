global.moment = require('moment');
"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var charge = require('./chargeRates'); 
        charge.test();
    } catch(e) {
        console.log(e.stack);
    }
}