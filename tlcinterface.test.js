"use strict";
global.config;
var setConfig = require('./config').read(configLoaded);
global.moment = require('moment');
global.sunCalc = require('suncalc');

function configLoaded(cfg) {
    global.config = cfg;
    try {
        console.log(JSON.stringify(config.weather))
        var tlc_if = require('./tlcInterface');
    } catch(e) {
        console.log(e.stack)
        process.exit(1);
    }
    tlc_if.init(() => {
        console.log('done');
        tlc_if.getAreaChannels('Lounge', (result) => {
            console.log(`done ${JSON.stringify(result, null, 2)}`);
        });
        // let c; let t; let s;
        // for (c=0.0; c<=1.0; c+=0.5) {
        //     s = `Cloud = ${c} `;
        //     let tm = moment(new Date()).startOf('day');
        //     tm.add(6, 'hour');
        //     for (t=6.0; t<18.0; t+=0.5) {
        //         s += `${tm.format('HH:mm')} ${tlc_if.isLight(tm, c)} `;
        //         tm.add(0.5, 'hour');
        //     }
        //     console.log(s);
        // }
    });
}