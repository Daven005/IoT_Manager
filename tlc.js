"use strict";
var tlc_if = require('./tlcInterface');
var login = require('./login');
var async = require('async');
var msg = require('./message');

var currentTLc;
var status = 'loading';
var callback = null;
var infoRequestTimerID = null;
var lightTimerIDs = []; // NB Check config!!

exports.showScenes = showScenes;
exports.setScene = setScene;
exports.setChannels = setChannels;
exports.showMobileScenes = showMobileScenes;
exports.checkLights = checkLights;
exports.areas = areas;
exports.setSceneDecode = setSceneDecode;
exports.setDesktopLightingChannels = setDesktopLightingChannels;
exports.setMobileLightingChannels = setMobileLightingChannels;
exports.getLightingChannel = getLightingChannel;
exports.info = info;
exports.test = test;
exports.getAllDeviceInfo = getAllDeviceInfo;
exports.onReady = onReady;
exports.status1 = function () { return status; };

tlc_if.init(tlc_ifReady);
status = 'loaded';

// Used by Alexa etc
const scene = {
  boiler: { id: "S0", TLc: "Hollies-F", on: "Boiler On", raise: "Boiler On", off: "Boiler Off", lower: "Boiler Off" },
  lounge: { id: "S1", TLc: "Hollies-L", on: "Living On", raise: "Living On", off: "Living Off", lower: "Watching TV" },
  family: { id: "S2", TLc: "Hollies-F", on: "Family On", raise: "Family On", off: "Family Off", lower: "Family Low" },
  hall: { id: "S3", TLc: "Hollies-L", on: "Hall On", raise: "Hall On", off: "Hall Off", lower: "Hall Dim PIR" },
  office: { id: "S4", TLc: "Hollies-L", on: "Office On", raise: "Office On", off: "Office Off", lower: "Office Dim" },
  toilet: { id: "S5", TLc: "Hollies-F", on: "Toilet On", raise: "Toilet On", off: "Toilet Off", lower: "Toilet Off" },
  utility: { id: "S6", TLc: "Hollies-F", on: "Utility On", raise: "Utility On", off: "Utility Off", lower: "Utility Off" },
  garage: { id: "S7", TLc: "Hollies-G", on: "Bench On", raise: "Shelves On", off: "All Off", lower: "Bench Off" }
};

function onReady(cb) {
  callback = cb;
  if (cb && status == 'ready') cb();
}

function tlc_ifReady() {
  console.log("### tlc_ifReady");
  tlc_if.list().forEach((_tlc) => {
    if (_tlc.IPaddress) {
      msg.setDevice(_tlc.Name, _tlc);
    }
  });

  setInterval(temperatureCheck, 3 * 60 * 1000);
  temperatureCheck();
  status = 'ready';
  console.log("Done setting tlc devices");
  if (callback) callback();
}

function temperatureCheck() {
  tlc_if.list().forEach(function (_tlc) {
    if (_tlc.IPaddress) {
      tlc_if.rqInfo(_tlc.Name, 'temperatures', (info) => {
        if (info.error) return;
        info.data.forEach(function (t) {
          if (t.ID) {
            if (t.Temp != '0.0') {
              msg.setSensor(_tlc.Name, t.ID, { Type: 'Temp', Value: t.Temp });
            } else {
              msg.setDevice(_tlc.Name, _tlc);
            }
          }
        });
      });
    }
  });
}

function test(request, response) {
  tlc_if.test(request, response);
}

function reloadScenes(response, params) {
  response.render("scenes", params);
}

function setChannels(request, response) {
  var _area, _channel, _tlc;
  function respond(code, r) {
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = code;
    response.write(JSON.stringify(r));
    response.end();
  }

  if (login.check(request, response)) {
    if (request.body.Area && request.body.Channel && request.body.TLc) {
      try {
        tlc_if.setChannel(_tlc = getRqTLc(request.body), _area = getRqArea(request.body), _channel = getRqChannel(request.body));
        respond(200, { info: 'Channel ' + _channel + ' set' });
      } catch (ex) {
        console.error("setChannels err: %j", request.body);
        respond(400, { info: "Can't set Channel " + _channel });
      }
      return;
    } else {
      console.error("setChannels Req err: %j", request.body);
      respond(400, { info: "Channel parameters missing" });
    }
  }
}

function setScene(request, response) {
  var _scene, _tlc;
  function respond(code, r) {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('MIME-Type', 'text/html');
    response.statusCode = code;
    response.write(JSON.stringify(r));
    response.end();
  }
  console.log("setScene %j", request.body);
  if (request.body.Scene && request.body.TLc) {
    try {
      tlc_if.showScene(_tlc = getRqTLc(request.body), _scene = getRqScene(request.body));
      respond(200, { info: 'Scene ' + _scene + ' set' });
    } catch (ex) {
      console.error("setScene err: %j", request.body);
      respond(400, { info: "Can't set Scene " + _scene });
    }
    return;
  } else if (request.query.Scene && request.query.TLc) {
    try {
      tlc_if.showScene(_tlc = getRqTLc(request.query), _scene = getRqScene(request.query));
      respond(200, { info: 'Scene ' + _scene + ' set' });
    } catch (ex) {
      console.error("setScene err: %j", request.body);
      respond(400, { info: "Can't set Scene " + _scene });
    }
    return;
  } else {
    console.error("Scene Req err: [body]%j", request.body);
    console.error("Scene Req err: [query]%j", request.query);
    respond(400, { info: "Scene parameters missing: " + request.body + request.query });
  }
}

function setSceneDecode(request, response) {
  var _scene, _tlc;

  function respond(code, r) {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('MIME-Type', 'text/html');
    response.statusCode = code;
    response.write(JSON.stringify(r));
    response.end();
  }
  if (request.body.room && request.body.onoff) {
    var info = scene[request.body.room][request.body.onoff];
    if (info) {
      _scene = info.Scene;
      _tlc = info.TLc
    }
    if (_scene && _tlc) {
      try {
        tlc_if.showScene(_tlc, _scene);
        respond(200, { info: 'Scene ' + _scene + ' set' });
      } catch (ex) {
        console.error("setScene err: %j", request.body);
        respond(400, { info: "Can't set Scene " + _scene });
      }
    } else {
      console.error("Scene param err: %j", request.body);
      respond(400, { info: "Scene parameters bad: " + request.body });
    }
  } else {
    console.error("Scene Req err: %j", request.body);
    respond(400, { info: "Scene parameters missing: " + request.body });
  }
}

function showScenes(request, response) {
  if (login.check(request, response)) {
    if (request.query.Scene) {
      tlc_if.showScene(currentTLc, request.query.Scene);
      tlc_if.rqInfo(currentTLc, 'scenes', function (scenes) {
        reloadScenes(response, { tlcs: tlc_if.list(), scenes: scenes.data });
      });
    } else if (request.query.Show) {
      tlc_if.rqInfo(currentTLc = request.query.Show, 'scenes', function (scenes) {
        reloadScenes(response, { tlcs: tlc_if.list(), scenes: scenes.data });
      });
    } else {
      if (currentTLc) {
        tlc_if.rqInfo(currentTLc, 'scenes', function (scenes) {
          reloadScenes(response, { tlcs: tlc_if.list(), scenes: scenes.data });
        });
      } else {
        console.error("*** %j", tlc_if.list());
        reloadScenes(response, { tlcs: tlc_if.list() });
      }
    }
  }
}

function reloadMobileScenes(response, area) {
  reloadAreas(response, "mobileScenes", area);
}

function getRqTLc(rq) {
  if (typeof rq.TLc == "object")
    return rq.TLc[0];
  return rq.TLc;
}

function getRqArea(rq) {
  if (typeof rq.Area == "object")
    return rq.Area[0];
  return rq.Area;
}

function getRqChannel(rq) {
  if (typeof rq.Channel == "object")
    return rq.Channel[0];
  return rq.Channel;
}

function getRqScene(rq) {
  if (typeof rq.Scene == "object")
    return rq.Scene[0];
  return rq.Scene;
}

function showMobileScenes(request, response) {
  if (login.check(request, response)) {
    // console.log(request.query);
    if (request.query.Scene && request.query.TLc) {
      try {
        tlc_if.showScene(getRqTLc(request.query), getRqScene(request.query));
      } catch (ex) {
        console.error("Scene Request err: %j", request.query);
      }
      reloadMobileScenes(response, getRqArea(request.query));
      return;
    } else {
      console.error("Scene Req err: %j", request.query);
    }
    reloadMobileScenes(response);
  }
}

// Following /App msg update Tlc lights
function checkLights(location, device, sensor, payload) {
  config.TLc.lights.forEach((rec) => {
    if (rec.location == location && rec.device == device && rec.sensor == sensor && rec.sensorValue == payload) {
      console.log(`----> CheckLights ${rec.ID}, ${location}, ${device}, ${sensor}, ${payload} ${JSON.stringify(lightTimerIDs, ['_idleTimeout'])}`);
      let delay = 0;
      if (rec.timer) delay = rec.timer * 1000;
      if (rec.scene) {
        try {
          if (rec.cancelID) { // This record used to cancel timeout of cancelID's setting
            if (lightTimerIDs[rec.cancelID]) {
              clearTimeout(lightTimerIDs[rec.cancelID]);
              console.log(`----> Cleared TO ${rec.cancelID} = ${JSON.stringify(lightTimerIDs[rec.cancelID], ['_idleTimeout'])}`);
              lightTimerIDs[rec.cancelID] = null;
            } // else already cancelled
          }
          // Carry on and udate scenes
          if (checkLightLevel(rec)) {
            if (!lightTimerIDs[rec.ID]) {
              if (delay > 0) { // A delay has been configured
                let t = lightTimerIDs[rec.ID] = setTimeout(() => { // NB Node.js setTimeout returns an object
                  console.log(`----> showScene ${location}/${device}/${sensor}=>${rec.tlcName}, ${rec.scene}`);
                  tlc_if.showScene(rec.tlcName, rec.scene);
                  lightTimerIDs[rec.ID] = null; // Finished with timer
                }, delay);
                console.log(`----> Set TO t=${JSON.stringify(t, ['_idleTimeout'])}, ${rec.ID}, ${delay}`);
              } else { // No timeout required
                console.log(`----> showScene (No timeout) ${location}/${device}/${sensor}=>${rec.tlcName}, ${rec.scene}`);
                tlc_if.showScene(rec.tlcName, rec.scene);
              }
            }
          }
        } catch (e) {
          console.error(`----> ERROR ${e}`);
        }
      } else if (rec.area) {
        setTimeout(() => {
          console.log(`${location}/${device}/${sensor}=>${rec.tlcName}, ${rec.area}, ${rec.channel} = ${payload}`);
          tlc_if.trigger(rec.tlcName, rec.area, rec.channel, (payload == '1') ? 'on' : 'off', rec.filter);
        }, timer);
      } else {
        console.error(`Bad (config.TLc.lights) record ${rec}`);
      }
      return;
    }
  });

  function checkLightLevel(rec) {
    let noLightSensor = false;
    let deviceID = deviceState.findDeviceID(device, location);
    if (!rec.lightLevel) noLightSensor = true;
    let currentLightLevel = deviceState.getLatestLight(deviceID, rec.lightSensorID);
    if (!currentLightLevel) noLightSensor = true;
    console.log(`----> Light = ${currentLightLevel}`);
    return (noLightSensor || currentLightLevel < rec.lightLevel)
  }
}

function reloadAreas(response, window, currentArea) {
  var errorStr;
  var sqlstr = "SELECT * FROM lightingareas";
  db.query(sqlstr, function (err, areas) {
    if (err) {
      console.error(err);
      errorStr = err.message;
    }
    var sqlstr = "SELECT * FROM arealights WHERE InUse=1";
    db.query(sqlstr, function (err, scenes) {
      if (err) {
        console.error(err);
        errorStr += err.message;
      }
      var params = { areas: areas, scenes: scenes, currentArea: currentArea, err: errorStr };
      response.render(window, params);
    });
  });
}

function makeSceneList(tlc, scenes) {
  var sl = "";
  scenes.forEach(function (s) {
    if (sl != "") sl += ', ';
    sl += '("' + tlc + '", "' + s.Name + '")';
  });
  return sl;
}

function areasUpdate(response) {
  function getScenes(_tlc, callback) {

    function processScenes(scenes) {
      var sqlStr;
      var errorStr;

      // console.log("******** processScenes %s - %j", _tlc.Name, scenes);
      if (scenes.error) return callback(scenes.error);
      var sceneList = makeSceneList(_tlc.Name, scenes.data);
      var sqlStr = "INSERT IGNORE INTO arealights (_tlc, Scene) VALUES " + sceneList
      // console.log("Scenes %j", sqlStr);
      db.query(sqlStr, function (err, result) {
        if (err) return callback(err);
        callback();
      });
    }

    if (_tlc.IPaddress) {
      tlc_if.rqInfo(_tlc.Name, 'scenes', processScenes);
    } else {
      return callback();
    }
  }

  function gotAllScenes(err) {
    console.log("gotAllScenes %j", err);
    reloadAreas(response, 'areas');
  }
  tlc_if.checkTLcs(() => {
    async.forEach(tlc_if.list(), getScenes, gotAllScenes);
  });
}

function areasSet(request, response) {
  var sqlStr = "UPDATE arealights SET Area = ?, InUse = ? WHERE TLc = ? AND Scene = ?"
  sqlStr = sql.format(sqlStr, [
    request.query.areaID,
    request.query.InUse ? 1 : 0,
    request.query.TLc,
    request.query.Scene
  ]);
  db.query(sqlStr, function (err, result) {
    if (err) {
      console.error(err);
      errorStr = err.message;
    }
    reloadAreas(response, 'areas');
  });
}

function areas(request, response) {
  if (login.check(request, response)) {
    if (request.query.update) { // Update Scenes from all TLcs
      areasUpdate(response);
    } else if (request.query.set) {
      areasSet(request, response);
    } else {
      reloadAreas(response, 'areas');
    }
  }
}

exports.sceneAreaChannels = function (request, response) {
  tlc_if.getSceneAreaChannels(request.query.area, request.query.scene, (result) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(result));
  });
}

exports.areaChannels = function (request, response) {
  tlc_if.getAreaChannels(request.query.area, (result) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(result));
  });
}

function getLightingChannel(request, response) {
  tlc_if.setChannel(request.query.tlc, request.query.area, request.query.name, request.query.value);
  response.end("OK");
}

function setMobileLightingChannels(request, response) {
  setLightingChannels(request, response, 'lightingChannelsMobile');
}

function setDesktopLightingChannels(request, response) {
  setLightingChannels(request, response, 'lightingChannels');
}

function setLightingChannels(request, response, renderer) {
  var actionList = new Map();

  function showChannels() {
    var channelList = []; var id; var setting; var area;

    for (let entry of actionList) {
      var key = entry[0];
      var action = entry[1];
      if (action.areaNames.retrieved && action.channelNames.retrieved && action.channelSettings.retrieved) {
        action.channelNames.result.forEach(function (info) {
          id = info.ID;
          area = action.areaNames.result[info.AreaID];
          // console.log(area);
          if (area) {
            setting = action.channelSettings.result[id];
            channelList.push({ tlc: key, area: area.Name, name: info.Name, value: setting });
          } else {
            console.error("Can't find area ID %j from action %j", info.AreaID, info);
          }
        });
      } else {
        console.error("Can't get: %j", action.channelSetting);
      }
    }
    response.render(renderer, { map: channelList });
    // console.log(channelList);
    response.end("OK");
  }

  function nextAction(result) {
    var idx; var action; var key
    if (result) {
      if (!result.error) {
        switch (result.reqInfo) {
          case 'areas':
            action = actionList.get(result.tlc)
            action.areaNames.result = result.data;
            action.areaNames.retrieved = true;
            break;
          case 'channels':
            action = actionList.get(result.tlc)
            action.channelNames.result = result.data;
            action.channelNames.retrieved = true;
            break;
          case 'channelvalues':
            action = actionList.get(result.tlc)
            action.channelSettings.result = result.data;
            action.channelSettings.retrieved = true;
            break;
          default:
            console.error("?? result %j", result);
            return;
        }
      } else {
        console.error(result.info);
        return;
      }
    }

    for (let entry of actionList) {
      key = entry[0];
      action = entry[1];
      if (!action.areaNames.retrieved) {
        tlc_if.rqInfo(key, 'areas', nextAction);
        return;
      } else if (!action.channelNames.retrieved) {
        tlc_if.rqInfo(key, 'channels', nextAction);
        return;
      } else if (!action.channelSettings.retrieved) {
        tlc_if.rqInfo(key, 'channelvalues', nextAction);
        return;
      }
    }
    /* All done
    for (let entry of actionList) {
      key = entry[0];
      action = entry[1];
      console.log("summary for: %j, %j", result, action);
    } */
    showChannels();
  }

  tlc_if.list().forEach(function (_tlc, key, map) {
    if (_tlc.IPaddress) {
      actionList.set(_tlc.Name, { areaNames: { retrieved: false }, channelNames: { retrieved: false }, channelSettings: { retrieved: false } });
    }
  });
  nextAction();
}

function info(request, response) {
  function tlcsResponded() {
    response.render('TLcInfo', { map: tlc_if.list() });
  }

  if (!infoRequestTimerID) { // Stop tring to send request if already waiting for the response
    infoRequestTimerID = setTimeout(() => {
      infoRequestTimerID = null;
      response.render('TLcInfo', { err: "Timed Out", map: tlc_if.list() })
    }
      , 5000);
  }

  if (request.query.action == 'Clear') {
    tlc_if.rqInfo(request.query.tlc, 'errors', () => tlc_if.checkTLcs(tlcsResponded), 'Clear=1');
  } else {
    tlc_if.checkTLcs(tlcsResponded);
  }
}

function getAllDeviceInfo(request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(scene));
  response.end();
}

status = "loaded";