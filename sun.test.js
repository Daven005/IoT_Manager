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
        console.log(new moment().format());
        console.log(JSON.stringify(sun.get()));
        let d = moment("2019-06-21 13:00:00").format("YYYY-MM-DD HH:mm:00Z");
        console.log(d, "=>", JSON.stringify(sun.get(d)));
    } catch(e) {
        console.log(e.stack);
    }
}