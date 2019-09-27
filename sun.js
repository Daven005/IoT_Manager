var sunNow = {
    az: 0,
    alt: 0
};
var sunHouse = [];
var sunGarage = [];

var idx;
for (idx = 0; idx < 24; idx++) {
    sunHouse.push({
        az: 0,
        alt: 0
    });
    sunGarage.push({
        az: 0,
        alt: 0
    });
}

exports.load = load;
exports.get = get;
exports.publish = publish;

function publish() {
    function checkPublish(topic, payload) {
        if (config.sun.publish)
            client.publish(topic, payload);
        else
            console.log(`${topic} ==> ${payload}`);
    }
    checkPublish('/App/Sun/current', JSON.stringify(sunNow));
    checkPublish('/App/Sun/house/hourly', JSON.stringify(sunHouse.slice(0, 3)));
    checkPublish('/App/Sun/garage/hourly', JSON.stringify(sunGarage.slice(0, 3)));
}

function get(date) {
    if (!date) date = new Date();
    var sp = sunCalc.getPosition(moment.utc(date), config.latitude, config.longitude);
    return {
        az: Math.round(sp.azimuth * (180 / Math.PI)),
        alt: Math.round(sp.altitude * (180 / Math.PI))
    };
}

function load(date) {
    var idx;
    var sp;

    if (!date) date = new Date();
    sunNow = get(date);
    sunHouse = [];
    sunGarage = [];
    for (idx = 0; idx < 12; idx++) {
        let tm;
        sp = sunCalc.getPosition(tm = moment(date).add(idx, "hours"), config.latitude, config.longitude);
        let h = tm.add(30, 'minutes').format('H')
        sunHouse.push({
            tm: h,
            az: Math.round(sp.azimuth * (180 / Math.PI) - 250 + 180), // Angle of plates = 250
            alt: Math.round(sp.altitude * (180 / Math.PI) - 40)
        }); // Angle of plates = 40
        sunGarage.push({
            tm: h,
            az: Math.round(sp.azimuth * (180 / Math.PI) - 160 + 180), // Angle of plates = 160
            alt: Math.round(sp.altitude * (180 / Math.PI) - 30)
        }); // Angle of plates = 30
    }
}