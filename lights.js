var lights = {};
var fs = require('fs');

function emptyLights() {
  return {colours: {map: []}, patterns: [{frame: 0, start: 0, LED: []}], playlist: {repeat: 0, time: 0, frames: [0]}};
}

exports.get = function(request, response) {
  var fileName;

  if (request.query.new) {
    lights = emptyLights();
    lights.fileName = "led/1.js";
    response.render('lights', lights);
  } else {
    if (request.query.read) {
      fileName = request.query.read;
    } else {
      fileName = "led/1.js";
    }
    fs.exists(fileName, function(exists) {
      if (exists) {
        fs.readFile(fileName, 'utf8', function(err, data) {
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
        lights.fileName = "led/1.js";
        response.render('lights', lights);
      }
    });
  }
}

function transmit(type, str) {
    if (lights.transmit == "MQTT") {
      client.publish('/App/'+type, str);
    } else {
      httpRequest.post('http://'+lights.target+'/'+type, { form:  str },
        function (error, response, body) {
          if (error || response.statusCode != 200) {
            lights.err = error;
            console.log("Transmit error: %j", error);
          }
      });
    }
}

exports.post = function(request, response) {
  var patternIdx=0;
  var sendingState="-";

  function sendingLights() {
    if (sendingState == "sentColours") {
      sendingState = "sendingPatterns";
      patternIdx = 0;
    }
    if (sendingState == "sendingPatterns") {
      if (patternIdx < lights.patterns.length) {
        var p = JSON.stringify(lights.patterns[patternIdx]);
        patternIdx++;
        transmit('pattern', p);
        setTimeout(sendingLights, 1000);
      } else {
        transmit('play', JSON.stringify(lights.playlist));
      }
    }
    return false;
  }

  delete lights.err;
  if (request.body.Action == "Save As") {
    var fn = request.body.file;
    var fileName = 'led/'+fn+'.js';
    if (!fn.match('[A-Za-z0-9_\-]')) {
      lights.err = "Invalid file name";
    } else {
      fs.writeFile(fileName, JSON.stringify(lights), function(err) {
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
  newMap.map = lights.colours.map.map(function(el) {return '0x'+el;});
  return JSON.stringify(newMap);
}

exports.postColours = function(request, response) {
  delete lights.err;
  if (typeof(lights.colours) == 'undefined') {
    lights.colours = {};
    lights.colours.map = ["0","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff","ffffff"];
  }
  lights.colours.map = request.body.map;
  if (request.body.Action == 'Save') {
    fs.writeFile(lights.fileName, JSON.stringify(lights), function(err) {
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

exports.postPatterns = function(request, response) {
  delete lights.err;
  if (typeof(lights.patterns) == 'undefined') {
    console.log("lights.patterns) == 'undefined'");
    lights.patterns = [{frame: 0, start: 0, LED: []}];
  }
  if (request.body.Action == "Add Pattern") {
    lights.patterns.push({frame: 0, start: 0, LED: []});
  } else if (request.body.Action == "Remove Pattern") {
    lights.patterns.pop();
  }
  response.render('lights', lights);
}

exports.postPattern = function(request, response) {
  var led;
  delete lights.err;
  if (typeof(lights.patterns) == 'undefined') {
    console.log("lights.patterns is 'undefined'");
    lights.patterns = [{frame: 0, start: 0, LED: []}];
  }
  var frm = parseInt(request.body.frame);
  lights.patterns[frm].frame = request.body.frame;
  lights.patterns[frm].start = request.body.start;
  if (typeof(request.body.reverse) == 'undefined') {
    lights.patterns[frm].reverse = "off";
  } else {
    lights.patterns[frm].reverse = request.body.reverse;
  }
  lights.patterns[frm].LED = request.body.LED;
  if (request.body.Action == 'Save') {
    fs.writeFile(lights.fileName, JSON.stringify(lights), function(err) {
      if (err) {console.log(err);}
    });
  } else if (request.body.Action == 'Transmit') {
    transmit('pattern', JSON.stringify(request.body));
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

exports.playlist = function(request, response) {
  delete lights.err;
  if (typeof(lights.playlist) == 'undefined') {
    lights.playlist = {};
    lights.playlist.repeat = -1;
    lights.playlist.time = 5000;
    lights.playlist.frames = [0, 0];
  }
  lights.playlist = request.body;
  if (request.body.Action == 'Save') {
    fs.writeFile(lights.fileName, JSON.stringify(lights), function(err) {
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
    transmit('play', JSON.stringify(request.body));
  }
  response.render('lights', lights);
}
