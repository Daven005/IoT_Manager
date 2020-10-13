"use strict";
global.config;
var express = require('express');
global.app = express();
var bodyParser = require('body-parser');
var path = require('path');
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(__dirname));
app.use('views', express.static(path.join(__dirname, '/views')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
require('./config').read(configLoaded);

function configLoaded(cfg) {
    global.config = cfg;
    try {
        var tlcMonitor = require('./tlcMonitor.old');
        app.get('/tlc/Monitor', tlcMonitor.show);
        app.get('/tlc/Monitor/open', tlcMonitor.open);
        app.listen(8099, '0.0.0.0', () =>{console.log('Listening')});
    } catch (e) {
        console.log(e.stack)
    }
}