"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var tlc_if = require('./tlcinterface');
        var tlcEdit = require('./tlcEdit');
    } catch(e) {
        console.log(e.stack)
    }
    tlc_if.init(() => {
        console.log('done');
        tlc_if.rqInfo('Hollies-F','getmeta', (info) => {
            console.log(info);
        })
    });
}


