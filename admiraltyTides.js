var https = require("https");
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
                JSON.parse(data).forEach(tide => {
                    var dt = moment(tide.DateTime);
                    var day = dt.format("dddd Do");
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
                        height: parseFloat(tide.Height).toFixed(2)
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
    response.render("tides", {
        map: tides
    });
}