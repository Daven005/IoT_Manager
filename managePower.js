var schedule = require('node-schedule');
var rp = require('request-promise');
weather.rqCloud(getCloud);
var todaysCloud = [];
for (let idx = 0; idx < 24; idx++) todaysCloud.push(-1);

exports.powerFlowJob = powerFlowJob;
exports.powerJob = powerJob;

exports.init = function(callback) {
    let datestr = moment().format('YYYY-MM-DD 00:00:00'); // Midnight today
    let sqlstr = sql.format("SELECT * FROM cloud WHERE time > ? ORDER BY time ASC",
        [new Date(datestr)]);
    db.query(sqlstr, (err, result) => {
        if (err) {
            console.error(`Can't read cloud ${err}`);
        }
        if (result.length > 0) {
            console.log(result);
        }
        if (callback) callback();
    });
}

function getCloud(cloud) {
    if (cloud.startTime != 0) {
        let start = cloud.startTime.getHours();
        for (let idx = 0; (idx + start) < 24; idx++)
            todaysCloud[idx + start] = cloud.c[idx];
        let dateStr = moment(cloud.startTime).format('YYYY-MM-DD HH:@00:00');
        let json = JSON.stringify(todaysCloud);
        let sqlstr = sql.format('INSERT INTO cloud (time, json) ' +
            'VALUES(?, ?) ON DUPLICATE KEY UPDATE json = ?',
            [new Date(dateStr), json, json]);
        db.query(sqlstr, (err) => {
            if (err) console.error(`Insert cloud error: ${err}, ${sqlstr}`);
            console.log(`Cloud update`);
        });
    }
}

schedule.scheduleJob(config.SolarEdge.powerFlow.schedule, powerFlowJob);

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
            startTime: moment().subtract(150, 'minutes').format('YYYY-MM-DD HH:00:00'),
            endTime: moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:00:00')
        },
        json: true
    };
    rp(options)
        .then((data) => {
            // console.log(JSON.stringify(data, null, 2));
            let values = data.power.values;
            let found = values.find((val) => new Date(val.date).getMinutes() == 0)
            let hour = new Date(found.date).getHours();
            let entries = 0;
            let totalPower = values.reduce((total, val) => {
                if (new Date(val.date).getHours() == hour) {
                    entries++;
                    return total + parseFloat(val.value);
                } else return total;
            }, 0);
            let avgPower = totalPower / entries;
            let sunPosition = sun.get();
            if (todaysCloud[hour] >= 0) {

            }
        })
        .catch((error) => {
            console.error(error);
        });

}
