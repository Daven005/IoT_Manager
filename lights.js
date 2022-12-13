var lights = {};
var fs = require('fs');
var rp = require('request-promise');

function emptyLights() {
    return { colours: { map: ['0', 'ffff'] }, patterns: [{ frame: 0, start: 0, LED: [] }], playlist: { repeat: 0, time: 0, frames: [0] } };
}

exports.get = function (request, response) {
    var fileName;

    if (request.query.new) {
        lights = emptyLights();
        lights.fileName = "led/1.json";
        response.render('lights', lights);
    } else {
        if (request.query.read) {
            fileName = `led/${request.query.read}`;
        } else {
            fileName = "led/1.json";
        }
        fs.exists(fileName, (exists) => {
            if (exists) {
                fs.readFile(fileName, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                        lights = emptyLights();
                        lights.err = err;
                    } else {
                        lights = JSON.parse(data);
                    }
                    lights.fileName = fileName;
                    response.render('lights', lights);
                });
            } else {
                console.log("No such file: %s", fileName);
                lights = emptyLights();
                lights.fileName = "led/1.json";
                response.render('lights', lights);
            }
        });
    }
}

function transmit(type, str) {
    if (lights.transmit == "MQTT") {
        console.log(type, str, typeof type, typeof str);
        client.publish('/App/' + type, JSON.stringify(str));
    } else {
        if (!lights.target) {
            lights.err = "No target entered";
            return;
        }
        var options = {
            method: 'POST',
            uri: `http://${lights.target}/${type}`,
            body: {
                lights: str
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}

exports.getFileName = getFileName;

function getFileName(f) {
    var fn = f.match(/led\/([A-Za-z0-9_\-]+)\.json/);
    if (fn) return 'led/' + fn[1] + '.json';
    fn = f.match(/^[A-Za-z0-9_\-]+$/);
    if (fn) return 'led/' + fn + '.json';
    return null;
}

exports.post = function (request, response) {
    var patternIdx = 0;
    var sendingState = "-";

    function sendingLights() {
        if (sendingState == "sentColours") {
            sendingState = "sendingPatterns";
            patternIdx = 0;
        }
        if (sendingState == "sendingPatterns") {
            if (patternIdx < lights.patterns.length) {
                transmit('pattern', lights.patterns[patternIdx]);
                patternIdx++;
                setTimeout(sendingLights, 1000);
            } else {
                transmit('play', lights.playlist);
            }
        }
        return false;
    }

    delete lights.err;
    if (request.body.Action == "Save As") {
        var fileName = getFileName(request.body.file);
        if (!fileName) {
            lights.err = `Invalid file name "${request.body.file}"`
        } else {
            fs.writeFile(fileName, JSON.stringify(lights), function (err) {
                if (err) {
                    console.log(err);
                    lights.err = err;
                } else {
                    lights.fileName = fileName;
                }
            });
        }
    } else if (request.body.Action == "Transmit All") {
        patternIdx = 0;
        sendingState = "sentColours";
        transmit('pattern', transmitColours());
        setTimeout(sendingLights, 1000);
    } else if (request.body.Action == "Set Target") {
        lights.target = request.body.target;
        lights.transmit = request.body.transmit;
    }
    response.render('lights', lights);
}

function transmitColours() {
    var newMap = {};
    newMap.map = lights.colours.map.map(function (el) { return '0x' + el; });
    return newMap;
}

exports.postColours = function (request, response) {
    delete lights.err;
    console.log(typeof (request.body), request.body)
    if (typeof (lights.colours) == 'undefined') {
        lights.colours = {};
        lights.colours.map = ["0", "ffffff"];
    } else {
        lights.colours.map = request.body.map;
    }
    if (request.body.Action == 'Save') {
        fs.writeFile(lights.fileName, JSON.stringify(lights), function (err) {
            if (err) {
                console.log(err);
                lights.err = err;
            }
        });
    } else if (request.body.Action == '+') {
        lights.colours.map.push("ffffff");
    } else if (request.body.Action == '-') {
        if (lights.colours.map.length > 2) {
            lights.colours.map.pop();
        }
    } else if (request.body.Action == 'Transmit') {
        transmit('pattern', transmitColours());
    }
    response.render('lights', lights);
}

exports.postPatterns = function (request, response) {
    delete lights.err;
    if (typeof (lights.patterns) == 'undefined') {
        console.log("lights.patterns) == 'undefined'");
        lights.patterns = [{ frame: 0, start: 0, LED: [] }];
    }
    if (request.body.Action == "Add Pattern") {
        lights.patterns.push({ frame: 0, start: 0, LED: [] });
    } else if (request.body.Action == "Remove Pattern") {
        lights.patterns.pop();
    }
    response.render('lights', lights);
}

exports.postPattern = function (request, response) {
    var led;
    delete lights.err;
    if (typeof (lights.patterns) == 'undefined') {
        console.log("lights.patterns is 'undefined'");
        lights.patterns = [{ frame: 0, start: 0, LED: [] }];
    }
    var frm = parseInt(request.body.frame);
    lights.patterns[frm].frame = request.body.frame;
    lights.patterns[frm].start = request.body.start;
    if (typeof (request.body.reverse) == 'undefined') {
        lights.patterns[frm].reverse = "off";
    } else {
        lights.patterns[frm].reverse = request.body.reverse;
    }
    lights.patterns[frm].LED = request.body.LED;
    if (request.body.Action == 'Save') {
        fs.writeFile(lights.fileName, JSON.stringify(lights), function (err) {
            if (err) { console.log(err); }
        });
    } else if (request.body.Action == 'Transmit') {
        transmit('pattern', request.body);
    } else if (request.body.Action == 'Copy') {
        lights.copy = lights.patterns[frm].LED;
    } else if (request.body.Action == 'Paste') {
        lights.patterns[frm].LED = lights.copy;
        delete lights.copy;
    } else if (request.body.Action == 'Insert') {
        if (request.body.selectedLED != '-1') {
            led = request.body.selectedLED.split('-');
            lights.patterns[frm].LED.splice(led[2], 0, 0);
        } else {
            lights.err = "No LED selected";
        }
    } else if (request.body.Action == 'Delete') {
        if (request.body.selectedLED != '-1') {
            led = request.body.selectedLED.split('-');
            lights.patterns[frm].LED.splice(led[2], 1);
        } else {
            lights.err = "No LED selected";
        }
    }
    response.render('lights', lights);
}

exports.playlist = function (request, response) {
    delete lights.err;
    if (typeof (lights.playlist) == 'undefined') {
        lights.playlist = {};
        lights.playlist.repeat = -1;
        lights.playlist.time = 5000;
        lights.playlist.frames = [0];
    }
    console.log(request.body)
    lights.playlist = request.body;
    if (request.body.Action == 'Save') {
        fs.writeFile(lights.fileName, JSON.stringify(lights), function (err) {
            if (err) {
                console.log(err);
                lights.err = err;
            }
        });
    } else if (request.body.Action == '+') {
        lights.playlist.frames.push("0");
    } else if (request.body.Action == '-') {
        if (lights.playlist.frames.length > 2) {
            lights.playlist.frames.pop();
        }
    } else if (request.body.Action == 'Transmit') {
        transmit('play', request.body);
    }
    console.log("Frames: ", lights.playlist.frames)
    response.render('lights', lights);
}
