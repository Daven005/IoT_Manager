"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    var tlc_if = require('./tlcinterface');

    tlc_if.init(() => {
        console.log('done');
        tlc_if.getAreaChannels('Hall', null, (result) => {
            console.log(`done ${JSON.stringify(result, null, 2)}`);
        });
    });
}


