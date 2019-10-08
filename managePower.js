var schedule = require('node-schedule');
var rp = require('request-promise');
weather.rqCloud(getCloud);
var todaysCloud = [];
for (let idx = 0; idx < 24; idx++) todaysCloud.push(-1);

exports.powerFlowJob = powerFlowJob;
exports.powerJob = powerJob;
exports.powerJob2 = powerJob2;

exports.init = function (callback) {
    let datestr = moment().format('YYYY-MM-DD 00:00:00Z'); // Midnight today
    let sqlstr = sql.format("SELECT * FROM cloud WHERE time > ? ORDER BY time ASC LIMIT 24",
        [new Date(datestr)]);
    db.query(sqlstr, (err, result) => {
        if (err) {
            console.error(`Can't read cloud ${err}`);
        }
        if (result.length > 0) {
            result.forEach(record => {
                let start = record.time.getHours();
                _cloud = JSON.parse(record.json);
                for (idx = start; idx < 24 && idx < _cloud.length; idx++) {
                    if (_cloud[idx] >= 0) todaysCloud[idx] = _cloud[idx];
                }
            });
            // console.log(JSON.stringify(todaysCloud));
        }
        if (callback) callback();
    });
}

function getCloud(cloud) {
    if (cloud.startTime != 0) {
        let start = cloud.startTime.getHours();
        for (let idx = 0;
            (idx + start) < 24; idx++)
            todaysCloud[idx + start] = cloud.c[idx];
        let dateStr = moment(cloud.startTime).format('YYYY-MM-DD HH:00:00Z');
        let json = JSON.stringify(todaysCloud);
        let sqlstr = sql.format('INSERT INTO cloud (time, json) ' +
            'VALUES(?, ?) ON DUPLICATE KEY UPDATE json = ?',
            [new Date(dateStr), json, json]);
        db.query(sqlstr, (err) => {
            if (err) console.error(`Insert cloud error: ${err}, ${sqlstr}`);
        });
    }
}

// schedule.scheduleJob(config.SolarEdge.powerFlow.schedule, powerFlowJob);

schedule.scheduleJob(config.SolarEdge.power.schedule, powerJob);

function powerFlowJob() {
    var options = {
        uri: `https://monitoringapi.solaredge.com/site/${config.SolarEdge.site}/${config.SolarEdge.powerFlow.command}.json`,
        qs: {
            api_key: config.SolarEdge.apiKey
        },
        json: true
    };
    rp(options)
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
        })
        .catch((error) => {
            console.error(error);
        });
}

function powerJob() {
    var options = {
        uri: `https://monitoringapi.solaredge.com/site/${config.SolarEdge.site}/${config.SolarEdge.power.command}.json`,
        qs: {
            api_key: config.SolarEdge.apiKey,
            startTime: moment().subtract(61, 'minutes').format('YYYY-MM-DD HH:00:00'),
            endTime: moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:00:00')
        },
        json: true
    };
    rp(options)
        .then((data) => {
            // console.log(JSON.stringify(data, null, 2));
            let values = data.power.values;
            var found = values.find((val) => new Date(val.date).getMinutes() == 0)
            let hour = new Date(found.date).getHours();
            let entries = 0;
            let totalPower = values.reduce((total, val) => {
                if (new Date(val.date).getHours() == hour) {
                    entries++;
                    return total + parseFloat(val.value);
                } else return total;
            }, 0);
            let avgPower = totalPower / entries;
            console.log(` ${avgPower} = ${totalPower} / ${entries}`);
            let sunPosition = sun.get(moment(found.date).add(30, 'minutes')); // Use 30' position
            if (todaysCloud[hour] >= 0 && sunPosition.alt > 0) {
                let sqlstr = sql.format("select min(time) as Period, format(avg(value),1) as Power from temperaturelog " +
                    "where deviceID = ? and sensorID = ? " +
                    "AND time >= curTime() - interval 2 hour " +
                    "group by  FLOOR(UNIX_TIMESTAMP(time)/(3600))",
                    [config.solarPower.house.deviceID, config.solarPower.house.sensorID]);
                db.query(sqlstr, (err, result) => {
                    var housePower;
                    if (err) {
                        console.error(`House power error ${err}`);
                        housePower = 0;
                    } else {
                        housePower = -parseInt(result[1].Power.replace(/\,/g,'')); // Export is -ve. Remove comma
                    }
                    let recordDate = moment(found.date).format("YYYY-MM-DD HH:00:00Z");
                    let sqlstr = sql.format("INSERT INTO sunPower (time, az, alt, cloud, HousePower, GaragePower) " +
                        "VALUES(?, ?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE HousePower=?, GaragePower=?",
                        [recordDate, sunPosition.az, sunPosition.alt, todaysCloud[hour],
                        housePower, avgPower, housePower, avgPower
                        ]);
                        db.query(sqlstr, (err,result) => {
                            if (err) console.error(`sunPower error ${err}`);
                            console.log(`${recordDate} sun @ ${sunPosition.alt}, ${sunPosition.az}, GaragePower: ${avgPower}, HousePower: ${housePower} cloud: ${todaysCloud[hour]}`)
                        });
                });
            }
        })
        .catch((error) => {
            console.error(error);
        });

}

function powerJob2() {
    var options = {
        uri: `https://monitoring.solaredge.com/solaredge-apigw/api/site/` +
        `${config.SolarEdge.site}/${config.SolarEdge.powerDashboard.command}`,
        qs: {
            chartField: config.SolarEdge.powerDashboard.duration,
            foldUp: true,
            activeTab: 0,
            fieldId: config.SolarEdge.site,
            perserveTabsData: true
        },
        'auth': {
            'user': 'david@norburys.me.uk',
            'pass': 'josh16solar',
            'sendImmediately': false
          },
        resolveWithFullResponse: true,
        json: true
    };
    let d = new Date();
    d.setHours(23, 59, 0, 0);
    options.qs.endDate= d.getTime();
    console.log(d.getTime());
    rp(options)
        .then((data) => {
            // console.log(JSON.stringify(data, null, 2));
            let values = data.solarProduction.dateSeries;
            var found = values.find((val) => new Date(val.date).getMinutes() == 0)
            let hour = new Date(found.date).getHours();
            let entries = 0;
            let totalPower = values.reduce((total, val) => {
                if (new Date(val.date).getHours() == hour) {
                    entries++;
                    return total + parseFloat(val.value);
                } else return total;
            }, 0);
            let avgPower = totalPower / entries;
            console.log(` ${avgPower} = ${totalPower} / ${entries}`);
            let sunPosition = sun.get(moment(found.date).add(30, 'minutes')); // Use 30' position
            if (todaysCloud[hour] >= 0 && sunPosition.alt > 0) {
                let sqlstr = sql.format("select min(time) as Period, format(avg(value),1) as Power from temperaturelog " +
                    "where deviceID = ? and sensorID = ? " +
                    "AND time >= curTime() - interval 2 hour " +
                    "group by  FLOOR(UNIX_TIMESTAMP(time)/(3600))",
                    [config.solarPower.house.deviceID, config.solarPower.house.sensorID]);
                db.query(sqlstr, (err, result) => {
                    var housePower;
                    if (err) {
                        console.error(`House power error ${err}`);
                        housePower = 0;
                    } else {
                        housePower = -parseInt(result[1].Power.replace(/\,/g,'')); // Export is -ve. Remove comma
                    }
                    let recordDate = moment(found.date).format("YYYY-MM-DD HH:00:00Z");
                    let sqlstr = sql.format("INSERT INTO sunPower (time, az, alt, cloud, HousePower, GaragePower) " +
                        "VALUES(?, ?, ?, ?, ?, ?) " +
                        "ON DUPLICATE KEY UPDATE HousePower=?, GaragePower=?",
                        [recordDate, sunPosition.az, sunPosition.alt, todaysCloud[hour],
                        housePower, avgPower, housePower, avgPower
                        ]);
                        db.query(sqlstr, (err,result) => {
                            if (err) console.error(`sunPower error ${err}`);
                            console.log(`${recordDate} sun @ ${sunPosition.alt}, ${sunPosition.az}, GaragePower: ${avgPower}, HousePower: ${housePower} cloud: ${todaysCloud[hour]}`)
                        });
                });
            }
        })
        .catch((error) => {
            console.log(error.response.request.href);
            console.error(error);
        });

}