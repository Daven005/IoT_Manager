"use strict";
var schedule = require('node-schedule');
const axios = require("axios");
const moment = require('moment');
const commands = require('./commands');

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


exports.init = function () {
    // schedule.scheduleJob(config.Solcast.schedule, processSolcast);
    client.publish('/Raw/House/info', '{"Name": "Roof", "Location": "Outside", "online": "Always"}');
    client.publish('/Raw/Garage/info', '{"Name": "Roof", "Location": "Garage", "online": "Always"}');
}

var publish = (s, v) => {
    return new Promise((resolve) => {
        client.publish(s, v);
        setTimeout(resolve, 10); // Rate limit
    });
}

exports.processSolcast = processSolcast;
async function processSolcast(info, done) {
    const format = 'format=json';
    const hours = 'hours = 3';
    const queryParams = `${format}&${hours}&api_key=${config.Solcast.api_key}`

    const requests = [
        axios.get(`${config.Solcast.host}${config.Solcast.houseID}/estimated_actuals?${queryParams}`),
        axios.get(`${config.Solcast.host}${config.Solcast.houseID}/forecasts?${queryParams}`),
        axios.get(`${config.Solcast.host}${config.Solcast.garageID}/estimated_actuals?${queryParams}`),
        axios.get(`${config.Solcast.host}${config.Solcast.garageID}/forecasts?${queryParams}`),
    ];

    const dbParams = [
        { device: 'House', responseType: 'estimated_actuals', dbValue: 'estimatedPower' },
        { device: 'House', responseType: 'forecasts', dbValue: 'ForecastPower' },
        { device: 'Garage', responseType: 'estimated_actuals', dbValue: 'estimatedPower' },
        { device: 'Garage', responseType: 'forecasts', dbValue: 'ForecastPower' }
    ];

    Promise.all(requests)
        .then(async (responses) => {
            let idx = 0;
            let s;
            console.log(1)
            for (const response of responses) {
                for (const data of response.data[dbParams[idx].responseType]) {
                    await publish(`/Raw/${dbParams[idx].device}/${dbParams[idx].dbValue}/info`,
                        `{"Type": "Power", 
                            "Value":${data.pv_estimate * 1000}, 
                            "time":${moment(data.period_end).unix()}}`); // NB lc 'time' for consistancty with bulkdata
                };
                console.log(s = `Done: ${dbParams[idx].device}, ${dbParams[idx].responseType}, ${dbParams[idx].dbValue}`);
                if (info) info(s);
                console.log(idx++);
            };
            if (done) done('All done');
        })
        .catch(error => {
            console.log(`Promise: ${error}`);
        });
}

app.post("/Commands/PassiveL", upload.single('filename'), processPassiveL);

function processPassiveL(req, res) {
    try {
        commands.writeHeader('PassiveL', res);
        const { Readable } = require('stream');
        const rls = require('readline-stream');
        const readable = new Readable();
        var date;
        readable._read = () => { } // _read is required but you can noop it
        readable.push(req.file.buffer);
        readable.push(null);
        var streamr = readable.pipe(rls({}));
        streamr.on('data', async (line) => {
            try {
                let dm = line.match(/Period:,(\d+)\/(\d+)\/(\d+)/);
                if (dm && dm.length == 4) {
                    date = `${dm[1]}-${dm[2]}-${dm[3]}`;
                    commands.info(date, res);
                } else {
                    let vm = line.match(/^(\d+):(\d+),(\d+).?(\d+)?/)
                    if (vm && vm.length >= 4) {
                        let time = `${date} ${vm[1]}:${vm[2]}:00`;
                        let value;
                        if (vm[4]) {
                            value = `${vm[3]}.${vm[4]}`;
                        } else {
                            value = `${vm[3]}`;
                        }
                        let msg = `{"Type": "Power", "Value": ${value * 1000}, "time":"${moment(time, 'YYYY-M-D HH:mm').unix()}"}`;
                        let topic = '/Raw/House/Reading/info';
                        await publish(topic, msg);
                        commands.info(`${msg}`);
                    }
                }
            } catch (e) {
                let s = `Upload error ${e} ${e.stack}`;
                console.error(s);
                done(s);
            }
        });
        streamr.on('end', () => commands.done('PassiveL', res))
    } catch (e) {
        let s = `Upload error ${e} ${e.stack}`;
        console.error(s);
        done(s);
    }
}

app.post("/Commands/SolarEdge", upload.single('filename'), processSolarEdge);

function processSolarEdge(req, res) {
    try {
        commands.writeHeader('SolarEdge', res);
        const { Readable } = require('stream');
        const rls = require('readline-stream');
        const readable = new Readable();
        var date;
        readable._read = () => { } // _read is required but you can noop it
        readable.push(req.file.buffer);
        readable.push(null);
        var streamr = readable.pipe(rls({}));
        streamr.on('data', async (line) => {
            try {
                let dm = line.match(/^Time,/);
                if (dm) {
                    // Throw away header line
                } else {
                    let vm = line.match(/^(\d+\/\d+\/\d+ \d+:\d+)/)
                    if (vm) {
                        var time = `${vm[1]}`;
                    }
                    vm = line.match(/(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g);
                    if (vm && vm.length >= 6) {
                        if (vm[4]) {
                            var value = `${vm[4].replace(/"/g,'').replace(/,/g, '')}`;
                            // console.log(vm[4], value)
                        }
                        let msg = `{"Type": "Power", "Value": ${value}, "time":"${moment(time, 'D-M-YYYY HH:mm').unix()}"}`;
                        let topic = '/Raw/Garage/Reading/info';
                        await publish(topic, msg);
                        commands.info(`${topic}, ${msg}`, res);
                    } else {
                        console.log(line)
                    }
                }
            } catch (e) {
                let s = `Upload error ${e} ${e.stack}`;
                console.error(s);
                done(s);
            }
        });
        streamr.on('end', () => commands.done('PassiveL', res))
    } catch (e) {
        let s = `Solar Edge Upload error ${e} ${e.stack}`;
        console.error(s);
        done(s);
    }
}
