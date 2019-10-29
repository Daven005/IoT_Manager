"use strict";

var alarmLog = require("./alarmLog");
var dbs = require('./dbSetup');
global.config;
require('./config').read((cfg) => {
    global.config = cfg;
    dbs.init(() => {
        alarmLog.init(() => {
            alarmLog.set(59, 2, "Solar Control");
            console.log(`${JSON.stringify(alarmLog.mapFmt())}`);
            console.log(`${JSON.stringify(alarmLog.getLast())}`);
            alarmLog.set(59, 4, "Solar Control");
            alarmLog.set(1000, 4, "Solar Control");
            alarmLog.set(2000, 4, "Solar Control");
            console.log(`${JSON.stringify(alarmLog.getLast())}`);
            alarmLog.save(() => {
                alarmLog.removeAll();
                alarmLog.read(() => {
                    console.log(`${JSON.stringify(alarmLog.mapFmt())}`);
                    alarmLog.remove(0);
                    console.log(`${JSON.stringify(alarmLog.mapFmt())}`);
                });
            });
            alarmLog.remove(0);
        });
    });
});