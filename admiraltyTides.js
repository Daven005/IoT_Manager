var https = require("https");
var weather = require ('./weather');
var tides = [];

exports.get = function () {
    return tides;
}

exports.load = function (callback) {
    var data = '';
    tides = [];
    var options = {
        hostname: 'admiraltyapi.azure-api.net',
        path: `/uktidalapi/api/V1/Stations/${config.tides.tideStation}/TidalEvents`,
        method: 'GET',
        headers: {
            "Ocp-Apim-Subscription-Key": config.tides.key,
            "content": "application/json"
        }
    };

    var req = https.request(options, (res) => {
        // console.log("statusCode: ", res.statusCode);
        // console.log("headers: ", res.headers);

        res.on('data', function (d) {
            data += d;
        });
        res.on('close', () => {
            try {
                var tideData = JSON.parse(data);
                var firstDay = moment(tideData[0].DateTime);
                tideData.forEach(tide => {
                    var dt = moment(tide.DateTime);
                    var day = dt.format("dddd Do");
                    var dayNo = dt.diff(firstDay, 'days', false);
                    // console.log(`Tide[${day}] ${dt.format('HH.mm')} ${tide.EventType}, ${parseFloat(tide.Height).toFixed(2)}`);
                    dayTides = tides.find((t) => t.day == day);
                    if (!dayTides) {
                        tides.push({
                            day: day,
                            tides: []
                        });
                        dayTides = tides.find((t) => t.day == day);
                    }

                    dayTides.tides.push({
                        time: dt.format('HH.mm'),
                        height: parseFloat(tide.Height).toFixed(2),
                        varHeight: ((weather.avgPressure() - weather.getPressure(dayNo)) * 0.01).toFixed(2), // cm/mBar
                        pressure: weather.getPressure(dayNo),
                        day: dayNo
                    })
                });
            } catch (ex) {
                console.error(ex); // Deal with JSON.parse error
            }
            // console.log(tides[0]);
            if (callback)
                callback();
        })
    });

    req.on('error', function (e) {
        console.error(e);
    });
    req.end();
}

exports.show = function (request, response) {
  let d;
  let w=[];
  for (d=0; d<7; d++) {
    w[d] = weather.getPressure(d);
  }
    response.render("tides", {
        map: tides, weather: w
    });
}