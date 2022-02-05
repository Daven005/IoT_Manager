"use strict";
var schedule = require('node-schedule');
const axios = require("axios");
const moment = require('moment');
const util = require('util');

exports.init = function () {
    // schedule.scheduleJob(config.Solcast.schedule, processSolcast);
    client.publish('/Raw/HousePV/info', '{"Name": "Roof", "Location": "Outside"}');
    client.publish('/Raw/GaragePV/info', '{"Name": "Roof", "Location": "Garage"}');
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
        { device: 'HousePV', responseType: 'estimated_actuals', dbValue: 'estimatedPower' },
        { device: 'HousePV', responseType: 'forecasts', dbValue: 'ForecastPower' },
        { device: 'GaragePV', responseType: 'estimated_actuals', dbValue: 'estimatedPower' },
        { device: 'GaragePV', responseType: 'forecasts', dbValue: 'ForecastPower' }
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
