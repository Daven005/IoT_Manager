"use strict"
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var webPage = '<html><body>' +
    '<form action="/upload" enctype="multipart/form-data" method="post" accept=".csv">' +
    '<input type="file" name="filename">&nbsp;' +
    '<input type="submit" name="Action" value="PassiveL">' +
    '</form></body></html>'

global.config;
require('./config').read((cfg) => {
    global.config = cfg;
    global.client = mqtt.connect(config.mqtt.host, {
        protocolVersion: config.mqtt.protocolVersion,
        protocolId: config.mqtt.protocolId
    });
});

app.get("/Commands", function (request, response) {
    response.write(webPage);
    response.end();
});

app.post("/upload", upload.single('filename'), async (req, res) => {
    try {
        const { Readable } = require('stream')
        const rls = require('readline-stream');
        const readable = new Readable()
        var date;
        readable._read = () => { } // _read is required but you can noop it
        readable.push(req.file.buffer)
        readable.push(null)
        var streamr = readable.pipe(rls({}));
        streamr.on('data', (line) => {
            let dm = line.match(/Period:,(\d+)\/(\d+)\/(\d+)/)
            if (dm && dm.length == 4) {
                date = `${dm[3]}/${dm[2]}/${dm[1]}`
                console.log(date)
            } else {
                let vm = line.match(/^(\d+):(\d+),(\d+).?(\d+)?/)
                if (vm && vm.length >= 4) {
                    if (vm[4]) {
                        res.write(`/Raw/House/Reading "time": "${date} ${vm[1]}:${vm[2]}, "value": ${vm[3]}.${vm[4]}`)
                    } else {
                        res.write(`/Raw/House/Reading "time": "${date} ${vm[1]}:${vm[2]}, "value": ${vm[3]}`)
                    }
                } else {
                    console.log(line)
                }
            }
        });
        streamr.on('end', () => { res.end(); })
    } catch (e) {
        console.error(`Upload error ${e} ${e.stack}`);
    }
});

const listener = app.listen(8999, () => {
    console.log("Your app is listening on port " + listener.address().port);
});