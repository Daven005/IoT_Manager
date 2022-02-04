"use strict";
const axios = require("axios");
const moment = require('moment');
const util = require('util');

var query = (s) => {
    return new Promise((resolve, reject) => {
        db.query(s, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

global.config;
var dbs = require('./dbSetup');
require('./config').read((cfg) => {
    global.config = cfg;
    try {
        dbs.init(async () => {
            // await processSolcast().catch(err => console.log('processSolcast: ' + err));
            // await processActuals().catch(err => console.log('processActuals: ' + err));
            await processSolarEdge().catch(err => console.log('processActuals: ' + err));
            console.log('done')
            process.exit(1);
        });
    } catch (e) {
        console.log(e);
    }
});

async function processSolcast() {
    // {"pv_estimate":0.0817,"period_end":"2022-01-28T08:30:00.0000000Z","period":"PT30M"},
    // {"pv_estimate":0,"period_end":"2022-01-28T08:00:00.0000000Z","period":"PT30M"},

    // {"pv_estimate":0,"pv_estimate10":0,"pv_estimate90":0,"period_end":"2022-01-29T08:00:00.0000000Z","period":"PT30M"},
    // {"pv_estimate":0.0164,"pv_estimate10":0.0033,"pv_estimate90":0.0555,"period_end":"2022-01-29T08:30:00.0000000Z","period":"PT30M"},

    const api_key = 'QUD3VChvckoe4t60DmNbqyQYzaQMBlnZ';
    const format = 'format=json';
    const hours = 'hours = 3';
    const host = 'https://api.solcast.com.au/rooftop_sites/';
    const hollies_estimated_url = '5e2b-3325-b847-50c1/estimated_actuals';
    const hollies_forecast_url = '5e2b-3325-b847-50c1/forecasts';
    const garage_estimated_url = 'dd03-a05e-dbd3-8ba7/estimated_actuals';
    const garage_forecast_url = '5e2b-3325-b847-50c1/forecasts';

    const queryParams = `${format}&${hours}&api_key=${api_key}`

    const requests = [
        axios.get(`${host}${hollies_estimated_url}?${queryParams}`),
        axios.get(`${host}${hollies_forecast_url}?${queryParams}`),
        axios.get(`${host}${garage_estimated_url}?${queryParams}`),
        axios.get(`${host}${garage_forecast_url}?${queryParams}`),
    ];

    const dbParams = [
        { responseType: 'estimated_actuals', dbValue: 'estimatedPower', id: 'Hollies House' },
        { responseType: 'forecasts', dbValue: 'ForecastPower', id: 'Hollies House' },
        { responseType: 'estimated_actuals', dbValue: 'estimatedPower', id: 'Hollies Garage' },
        { responseType: 'forecasts', dbValue: 'ForecastPower', id: 'Hollies Garage' }
    ];

    Promise.all(requests)
        .then(async (responses) => {
            let idx = 0;
            for (const response of responses) {
                for (const data of response.data[dbParams[idx].responseType]) {
                    var sqlstr = `INSERT INTO solarPower (ID, time, ${dbParams[idx].dbValue}) `
                        + "VALUES (?, ?, ?) "
                        + `ON DUPLICATE KEY UPDATE ${dbParams[idx].dbValue}=?`;
                    sqlstr = sql.format(sqlstr, [
                        dbParams[idx].id,
                        data.period_end,
                        data.pv_estimate,
                        data.pv_estimate
                    ]);
                    await query(sqlstr).catch(err => console.log(`Insert q: ${err}`));
                    // else if (dataIdx<3) console.log(`Inserted ${dataIdx}`)
                };
                console.log(`Done: ${dbParams[idx].id}, ${dbParams[idx].responseType}, ${dbParams[idx].dbValue}`);
                idx++;
            };
        })
        .catch(error => {
            console.log(`Promise: ${error}`);
        });
}

async function processActuals() {
    var sqlstr = `SELECT sensors.name, DATE_FORMAT(ADDTIME(time, '0:30:0'), '%Y/%m/%d %H:%i') AS Date, ` +
        `round(AVG(value/1000), 3) as kW ` +
        `FROM temperaturelog ` +
        `INNER JOIN sensors ON sensors.SensorID = temperaturelog.sensorID AND temperaturelog.deviceID = sensors.deviceID ` +
        `WHERE ( sensors.name = '1 House Solar' OR sensors.name = '1 Solar') AND time >= ? AND time < ? ` +
        `GROUP BY UNIX_TIMESTAMP(time) DIV 1800 ` +
        `ORDER BY sensors.name, time`;
    sqlstr = sql.format(sqlstr,
        [moment(Date.now()).add(-3, 'days').format('YYYY-MM-DD'),
        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')]);

    var result = await query(sqlstr).catch(e => console.log('query: ' + e.stack));
    for (const r of result) {
        await insertRecords(r).catch(e => console.log(`Insert: ${e.stack}, ${r}`));
    };
    console.log('Copied Actuals');

    async function insertRecords(r) {
        let sqlstr = `INSERT INTO solarpower (ID, time, MeasuredPower) VALUES (?, ?, ?)`
            + ` ON DUPLICATE KEY UPDATE MeasuredPower=?`;
        let id;
        if (r.name == '1 House Solar')
            id = 'Hollies House';
        else
            id = 'Hollies Garage';
        sqlstr = sql.format(sqlstr, [id, r.Date, -r.kW, -r.kW]);
        result = await query(sqlstr);
        // console.log(`Inserted: ${JSON.stringify(result)}`);
    }
}

async function processSolarEdge() {
    let api_key = '';
    let domain = 'https://monitoring.solaredge.com';
    let url = '/solaredge-apigw/api/site/715727/powerDashboardChart';
    let params = '?chartField=DAY&foldUp=true&activeTab=0&fieldId=715727&' +
        'endDate=&perserveTabsData=true';

    console.log(`${domain}${url}${params}`)
    await axios.get(`${domain}${url}${params}`,{}, config.SolarEdge.auth)
        .then(async response => {
            let j = JSON.parse(response);
            console.log(j)
            let solarProduction = j.solarProduction;
            let halfHourProduction = [];
            for (var i = 0; i < solarProduction.length - 1; i += 2) {
                halfHourProduction.push(
                    {
                        "date": `${solarProduction[i + 1].date}`,
                        "kWh": `${solarProduction[i].value + solarProduction[i + 1].value}`
                    });
            }
            console.log(halfHourProduction);
            for (data of halfHourProduction) {
                let sqlstr = `INSERT INTO solarpower (ID, time, MeasuredPower) VALUES (?, ?, ?)`
                    + ` ON DUPLICATE KEY UPDATE MeasuredPower=?`;
                sqlstr = sql.format(sqlstr, ['Hollies Garage', data.date, data.value, data.value]);
                await query(sqlstr).catch(err => console.log(`Insert q: ${err}`));
            }
        })
        .catch(err => console.log(`GET solarEdge: ${err}`));
}