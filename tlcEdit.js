"use strict";
var tlc_if = require('./tlcInterface');
var login = require('./login');
var tlcConfig;

exports.onReady = function(cb) {
    var c;
    tlcConfig = JSON.parse(c = JSON.stringify(tlc_if.list()));
    console.log(`tlcConfig: ${c}`);
    if (cb) cb();
}

exports.show = function(request, response) {
    response.render('tlcEdit',  {err: "Timed Out", tlcConfig: tlcConfig});
}

exports.getMeta = function(request, response) {
    tlc_if.rqInfo(request.query.tlc,'getmeta', (info) => {
        response.json(info.data);
    })
}