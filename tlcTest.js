global.sunCalc = require('suncalc');
var moment = require('moment');
var net = require('net');
global.http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var tlc = require('./tlc');

var mqtt = require('mqtt');
mqttClient = mqtt.connect('mqtt://localhost');
mqttClient.subscribe('/App/Utility/MHRV/Toilet PIR On/#');
mqttClient.subscribe('/App/Utility/MHRV/Utility PIR On/#');
mqttClient.on('message', tlc.decode);

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(__dirname));
app.use('views', express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.locals.pretty = true;
app.listen(8092);

app.get('/tlc/testPIR', tlc.testPIR);
app.get('/tlc/scenes', tlc.showScenes);
