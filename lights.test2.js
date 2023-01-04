var lights = {};
var fs = require('fs');
var http = require('http');

function emptyLights() {
  return {
    colours: { map: ['0', 'ffff'] },
    patterns: [{ frame: 0, start: 0, LED: [] }],
    playlist: { repeat: 0, time: 0, frames: [0] },
    ledType: { ic: 'ws2811', stringLength: 50 }
  };
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

function postData(options, obj) {
  return new Promise((resolve, reject) => {
    let rqData = JSON.stringify(obj);
    let result = '';
    let timeout;

    options.headers = {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(rqData),
    };
    const req = http.request(options);
    req.on("data", (chunk) => { result += chunk; });
    req.on("error", (err) => { reject(err); })
    req.on("end", (res) => { clearTimeout(timeout); resolve(res); });
    req.on("finish", (res) => { clearTimeout(timeout); resolve(res); });
    req.write(rqData);
    req.end();
    timeout = setTimeout(postTimeout, 1000);
    console.log("Body written: %s", rqData);

    function postTimeout() { reject(`Timeout on post ${options.path})`) }
  });
}

const transmit = function (type, obj) {
  return new Promise(function (resolve, reject) {
    console.log(`transmit: ${type}, obj: ${obj}`)
    if (lights.transmit == "MQTT") {
      client.publish('/App/' + type, JSON.stringify(obj));
      resolve("Sent");
    } else {
      if (!lights.target) {
        lights.err = "No target entered";
        reject("No Target");
      }
      var options = {
        method: 'POST',
        hostname: lights.target,
        path: `/${type}`,
      };

      postData(options, obj)
        .then(() => {
          resolve("Sent");
        })
        .catch((err) => {
          reject(`postData: ${err}`);
        });
    }
  });
}

exports.getFileName = getFileName;

function getFileName(f) {
  var fn = f.match(/led\/([A-Za-z0-9_\-]+)\.json/);
  if (fn) return 'led/' + fn[1] + '.json';
  fn = f.match(/^[A-Za-z0-9_\-]+$/);
  if (fn) return 'led/' + fn + '.json';
  return null;
}

exports.post = async (request, response) => {
  delete lights.err;
  console.log("Post: ", request.body.Action)
  try {
    switch (request.body.Action) {
      case "Save As":
        saveFile();
        break;
      case "Transmit All":
        await transmit('pattern', coloursMap())
          .then((r) => console.log(r))
          .catch(err => { lights.err = err; console.error(err, '(Tansmit All, pattern, colours)') });
        for (idx = 0; idx < lights.patterns.length; idx++) {
          await transmit('pattern', lights.patterns[idx])
            .then((r) => console.log(r))
            .catch(err => { lights.err = err; console.error(err, '(Tansmit All, patterns)') });
        }
        await transmit('play', lights.playlist)
          .then((r) => console.log(r))
          .catch(err => { lights.err = err; console.error(err, '(Tansmit All, play)') });
        await transmit('setled', lights.ledType)
          .then((r) => console.log(r))
          .catch(err => { lights.err = err; console.error(err, '(Tansmit All, setled)') });
        break;
      case "Set Target":
        lights.target = request.body.target;
        lights.transmit = request.body.transmit;
        break;
      case "Set LED type":
        lights.ledType.ic = request.body.IC;
        lights.ledType.stringLength = request.body.Length;
        break;
    }
  } catch (err) {
    lights.err = `Transmit problem: ${err}`;
  }
  response.render('lights', lights);

  function saveFile() {
    var fileName = getFileName(request.body.file);
    if (!fileName) {
      lights.err = `Invalid file name "${request.body.file}"`;
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
  }
}

function coloursMap() {
  var newMap = {};
  newMap.map = lights.colours.map.map(function (el) { return '0x' + el; });
  return newMap;
}

exports.postColours = async function (request, response) {
  delete lights.err;
  if (typeof (lights.colours) == 'undefined') {
    lights.colours = {};
    lights.colours.map = ["0", "ffffff"];
  } else {
    lights.colours.map = request.body.map;
  }
  if (request.body.Action == 'Save') {
    fs.writeFile(lights.fileName, JSON.stringify(lights), function (err) {
      if (err) {
        console.error(err);
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
    await transmit('pattern', coloursMap())
      .then((r) => console.log(JSON.stringify(r)))
      .catch(err => { lights.err = err; console.error(err); });
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

exports.postPattern = async function (request, response) {
  var led;
  delete lights.err;
  console.log("/pattern: ", request.body)
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
    await transmit('pattern', request.body)
      .then((r) => console.log(r))
      .catch(err => { lights.err = err; console.error(err, '(Transmit, pattern)') });
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

exports.playlist = async function (request, response) {
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
    await transmit('play', request.body).catch(err => console.error(err, '(Transmit, play)'));
  }
  console.log("Frames: ", lights.playlist.frames)
  response.render('lights', lights);
}

exports.setLed = async function (request, response) {
  delete lights.err;
  if (typeof (lights.ledType) == 'undefined') {
    lights.ledType = { ic: 'WS2811', stringLength: 50 }
  }
  if (request.body.ic)
    lights.ledType.ic = request.body.ic;
  if (request.body.stringLength)
    lights.ledType.stringLength = request.body.stringLength;
  console.log("setLed: ", lights.ledType, request.body)
  if (request.body.Action == 'Save') {
    fs.writeFile(lights.fileName, JSON.stringify(lights), (err) => {
      if (err) {
        console.log(err);
        lights.err = err;
      }
    });
  } else if (request.body.Action == 'Transmit') {
    await transmit('setLed', lights.ledType).catch(err => console.error(err, '(Transmit, setLed)'));
  }
  console.log("setLed: ", lights.ledType)
  response.render('lights', lights);
}