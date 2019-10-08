"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var tlc_if = require('./tlcinterface');
    } catch(e) {
        console.log(e.stack)
    }
    tlc_if.init(() => {
        console.log('done');
        tlc_if.getAreaChannels('Lounge', (result) => {
            console.log(`done ${JSON.stringify(result, null, 2)}`);
        });
    });
}


