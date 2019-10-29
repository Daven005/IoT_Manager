"use strict";

var errorLog = require("./errorLog");
var dbs = require('./dbSetup');
global.config;
require('./config').read((cfg) => {
    global.config = cfg;
    dbs.init(() => {
        errorLog.init(() => {
            errorLog.set(56, 2, "Solar Control");
            console.log(`${JSON.stringify(errorLog.mapFmt())}`);
            console.log(`${JSON.stringify(errorLog.getLast())}`);
            errorLog.set(57, 4, "Solar Control");
            errorLog.set(51, 4, "Solar Control");
            errorLog.set(51, 9, "Solar Control");
            errorLog.set(1000, 4, "Solar Control");
            console.log(`${JSON.stringify(errorLog.getLast())}`);
            errorLog.save(() => {
                errorLog.removeAll();
                errorLog.read(() => {
                    console.log(`${JSON.stringify(errorLog.mapFmt())}`);
                    errorLog.remove(0);
                    console.log(`${JSON.stringify(errorLog.mapFmt())}`);
                });
            });
            errorLog.remove(0);
        });
    });
});