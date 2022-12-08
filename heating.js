"use strict";
var processHeating = require('./processHeating');
var login = require('./login');
var wd = require('./workdays');
const EXTERNAL_NAME = 'Alexa';

exports.temperatureDevice = function (request, response) {
  var sqlstr = "SELECT devices.Location, devices.DeviceID, devices.name FROM devices "
    + "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID "
    + "WHERE sensors.`Type`='Temp' GROUP BY deviceID ORDER BY devices.Location, devices.name"
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("temperatureDevice %j", err);
    }
    var j = JSON.stringify(result);
    response.end(j);
  });
}

exports.temperatureSensor = function (request, response) {
  var sqlstr = "SELECT sensors.name, sensors.sensorID FROM devices "
    + "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID "
    + "WHERE sensors.`Type`='Temp' AND devices.deviceID = ? ORDER BY sensors.name"
  sqlstr = sql.format(sqlstr, [request.query.device]);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console("temperatureSensor %j", err);
    }
    var j = JSON.stringify(result);
    response.end(j);
  });
}

exports.controlDevice = function (request, response) {
  var sqlstr = "SELECT devices.Location, devices.DeviceID, devices.name FROM devices "
    + "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID "
    + "WHERE sensors.`Type`='Output' GROUP BY deviceID ORDER BY devices.Location, devices.name"
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("controlDevice %j", err);
    }
    var j = JSON.stringify(result);
    response.end(j);
  });
}

exports.controlSensor = function (request, response) {
  var sqlstr = "SELECT sensors.name, sensors.sensorID FROM devices "
    + "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID "
    + "WHERE sensors.`Type`='Output' AND devices.deviceID = ? ORDER BY sensors.name"
  sqlstr = sql.format(sqlstr, [request.query.device]);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("controlSensor %j", err);
    }
    var j = JSON.stringify(result);
    response.end(j);
  });
}

exports.mobileOverrides = mobileOverrides;

function mobileOverrides(request, response) {
  _mobileOverrides(request, response);
}

function _mobileOverrides(request, response, zoneFilter) {
  var errorStr = "";
  function _reload(zone) {
    var sqlstr = "SELECT zoneID, heatingoverrides.ID AS oID, heatingzones.Name AS zoneName, "
      + "heatingoverrides.Name AS groupName, TemperatureMax, TemperatureMin, "
      + "heatingoverrides.day, daysofweek.Name AS dayName, "
      + "heatingoverrides.`start`, duration, temperature, dontClear, active "
      + "FROM heatingoverrides "
      + "INNER JOIN heatingzones ON heatingoverrides.zoneID = heatingzones.ID "
      + "INNER JOIN daysofweek ON heatingoverrides.day = daysofweek.ID "
      + "WHERE heatingoverrides.Name = 'Mobile' AND heatingzones.Enabled = 1";
    if (zoneFilter) { // Allow for guest override page
      sqlstr += ` AND heatingzones.Name LIKE "${zoneFilter}%"`; // Guest1/2/2m
    }
    sqlstr += " ORDER BY heatingzones.Name";
    // console.log(sqlstr);
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log(`mobile ${errorStr = err.message} ${sqlstr}`);
        result = [];
      }
      result.forEach(function (el) {
        el.target = processHeating.zoneTargetTemp(el.zoneID);
        if (!el.target) console.log(`No target for ${el.zoneID}`)
        el.currentTemperature = processHeating.zoneCurrentTemp(el.zoneID);
      });
      response.render('heatingMobile',
        { map: result, loggedIn: request.loggedIn, zone: { zoneID: zone }, err: errorStr });
    });
  }

  function _updateOverride(request) {
    var sqlstr = "UPDATE heatingoverrides SET "
      + "day = 10, "
      + "start = ?, "
      + "duration = ?, "
      + "temperature = ?, "
      + "dontClear = false, "
      + "active = ? "
      + "WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.start,
      request.query.duration + ':00',
      request.query.temperature,
      (request.query.duration > 0),
      request.query.ID
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log("updateOverride %j SQL = %s request= %j", err, sqlstr, request); errorStr = "Empty values?"; }
      processHeating.load(`_updateOverride`, () => { _reload(request.query.zoneID) });
    });
  }

  if (request.query.zoneID) {
    if (request.query.Action == "Set") {
      if (zoneFilter) {
        _updateOverride(request); // Allow guest update access
      } else if (login.check(request, response)) {
        _updateOverride(request);
      }
    } else {
      _reload(request.query.zoneID);
    }
  } else {
    _reload();
  }
}

exports.guestOverrides = function (request, response) {
  _mobileOverrides(request, response, `Guest`); // Allows for Guest1/2
}

exports.workdays = function (request, response) {
  let wRec = wd.obj();
  let errStr = "";
  var wProg = [];
  var oProg = [];
  function reload(response) {
    let sqlstr = "select ID, name from HeatingZones";
    db.query(sqlstr, function (err, result) {
      let zones = JSON.parse(JSON.stringify(result));
      let sqlstr = "select start, temperature from heatingProgrammes where zoneID = ?"
      sqlstr = sql.format(sqlstr, [wRec.workZoneID]);
      console.log(sqlstr);
      db.query(sqlstr, (err, result) => {
        console.log(result);
        wProg = JSON.parse(JSON.stringify(result));
        let sqlstr = "select start, temperature from heatingProgrammes where zoneID = ?"
        sqlstr = sql.format(sqlstr, [wRec.offZoneID]);
        console.log(sqlstr);
        db.query(sqlstr, (err, result) => {
          console.log(result);
          oProg = JSON.parse(JSON.stringify(result));
          response.render("heatingWorkdays",
            { workdays: wRec, zones: zones, wProg: wProg, oProg: oProg, err: errStr });
        });
      });
    });
  }

  console.log(request.query)
  if (request.query.action == "Save") {
    wRec.Su = request.query.Su == "on";
    wRec.Mo = request.query.Mo == "on";
    wRec.Tu = request.query.Tu == "on";
    wRec.We = request.query.We == "on";
    wRec.Th = request.query.Th == "on";
    wRec.Fr = request.query.Fr == "on";
    wRec.Sa = request.query.Sa == "on";

    console.log(wRec.workZoneID, Number(request.query.workZoneID), typeof (wRec.workZoneID), typeof (request.query.workZoneID));

    if (wRec.workZoneID != Number(request.query.workZoneID)) {
      if (request.session.loggedin) {
        wRec.workZoneID = request.query.workZoneID;
      } else {
        errStr = `Can't change Work zone, Not logged in. `;
      }
    }
    if (wRec.offZoneID != Number(request.query.offZoneID)) {
      if (request.session.loggedin) {
        wRec.offZoneID = request.query.offZoneID;
      } else {
        errStr += "Can't change Off zone, Not logged in. "
      }
    }
    wd.save();
  }

  reload(response);
}

exports.mobileGroups = function (request, response) {
  var errorStr = "";

  function _reload() {
    var sqlstr = "SELECT heatingoverrides.Name AS name, max(temperature) AS temperature, day, daysofweek.Name AS dayName, "
      + "min(heatingoverrides.start) as start, min(heatingoverrides.duration) as duration "
      + "from heatingoverrides inner join daysofweek on daysofweek.ID = heatingoverrides.day "
      + "GROUP BY name";
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log("mobileGroups %j", err);
        console.log(sqlstr);
        errorStr = err.message;
        result = [];
      }
      response.render('heatingMobileGroups', { group: result, err: errorStr, loggedIn: request.loggedIn });
    });
  }

  function _updateGroup(request) {
    var sqlstr = "UPDATE heatingoverrides SET "
      + "day = ?, "
      + "start = ?, "
      + "duration = ?, "
      + "temperature = ?, "
      + "dontClear = ?, "
      + "active = ? "
      + "WHERE Name = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.day,
      request.query.start,
      request.query.duration,
      request.query.temperature,
      (request.query.dontClear == 'yes'),
      (request.query.active == 'yes'),
      request.query.Name
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log("updateGroup %j", err); }
      _reload();
    });
  }

  switch (request.query.Action) {
    case "Set Group":
      if (login.check(request, response)) {
        if (request.query.Name) {
          _updateGroup(request);
        } else {
          _reload();
        }
        processHeating.load(`updateGroup`);
      }
      break;
    default:
      _reload();
  }
}

exports.setEmergencyOverride = function (duration, temperature) {
  var sqlstr = "UPDATE heatingoverrides SET "
    + "day = 10, "
    + "start = NOW(), "
    + "duration = ?, "
    + "temperature = ?, "
    + "dontClear = 0, "
    + "active = 1 "
    + "WHERE Name = 'Emergency'";
  sqlstr = sql.format(sqlstr, [
    duration, temperature
  ]);
  db.query(sqlstr, function (err) {
    if (err) { console.log("set Emergency Group %j", err); }
    processHeating.load(`setEmergencyOverride`);
  });
}

exports.clearEmergencyOverride = function () {
  var sqlstr = "UPDATE heatingoverrides SET "
    + "active = 0 "
    + "WHERE Name = 'Emergency'";
  db.query(sqlstr, function (err) {
    if (err) { console.log("clear Emgergency Group %j", err); }
    processHeating.load('clearEmergencyOverride');
  });
}

exports.days = function (request, response) {
  var sqlstr = "SELECT * FROM daysofweek"
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("days %j", err);
    }
    var j = JSON.stringify(result);
    response.end(j);
  });
}

exports.zones = function (request, response) {
  var sqlstr = "SELECT ID, Name FROM heatingZones ORDER BY Name"
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("zones %j", err);
    }
    var j = JSON.stringify(result);
    response.setHeader('Content-Type', 'application/json');
    response.end(j);
  });
}

exports.override = function (request, response) {
  var errorStr = "";

  function _reload() {
    var sqlstr = "SELECT zoneID, heatingoverrides.ID AS oID, heatingzones.Name AS zoneName, "
      + "heatingoverrides.Name AS oName,  heatingoverrides.priority AS priority,  TemperatureMax, TemperatureMin, "
      + "heatingoverrides.day, daysofweek.Name AS dayName, "
      + "heatingoverrides.`start`, duration, temperature, dontClear, active, TRUE AS ex "
      + "FROM heatingoverrides "
      + "INNER JOIN heatingzones ON heatingoverrides.zoneID = heatingzones.ID "
      + "INNER JOIN daysofweek ON heatingoverrides.day = daysofweek.ID "
      + "WHERE heatingZones.Enabled = 1 ORDER BY oName";
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log("override %j", err);
        console.log(sqlstr);
        errorStr = err.message;
        result = [];
      }
      result.push({
        oName: 'New', priority: 2, zoneID: 0, zoneName: 'None', day: 10, dayName: 'Anyday',
        start: '12:00:00', duration: '1:00:00', temperature: 21, repeat: 0, active: 0, ex: false
      });
      sqlstr = "SELECT heatingoverrides.Name AS name, "
        + "max(temperature) AS temperature, max(priority) AS priority, "
        + "day, daysofweek.Name AS dayName, "
        + "min(heatingoverrides.start) as start, min(heatingoverrides.duration) as duration "
        + "from heatingoverrides inner join daysofweek on daysofweek.ID = heatingoverrides.day "
        + "GROUP BY name";
      db.query(sqlstr, function (err, result1) {
        if (err) {
          console.log(err);
          console.log(sqlstr);
          errorStr = err.message;
          result1 = [];
        }
        response.render('heatingOverride', { map: result, group: result1, err: errorStr });
      });
    });
  }

  function _updateOverride(request) {
    var sqlstr = "UPDATE heatingoverrides SET "
      + "Name = ?, "
      + "priority = ?, "
      + "zoneID = ?, "
      + "day = ?, "
      + "start = ?, "
      + "duration = ?, "
      + "temperature = ?, "
      + "dontClear = ?, "
      + "active = ? "
      + "WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.Name,
      request.query.priority,
      request.query.zoneID,
      request.query.day,
      request.query.start,
      request.query.duration,
      request.query.temperature,
      (request.query.dontClear == 'yes'),
      (request.query.active == 'yes'),
      request.query.ID
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); errorStr = "Empty values?"; }
      _reload();
    });
  }

  function _insertOverride(request) {
    var sqlstr = "INSERT heatingoverrides  "
      + "(Name, priority, zoneID, day, Temperature, start, duration, active, dontClear) "
      + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    sqlstr = sql.format(sqlstr, [
      request.query.Name,
      request.query.priority,
      request.query.zoneID,
      request.query.day,
      request.query.temperature,
      request.query.start,
      request.query.duration,
      (request.query.dontClear == 'yes'),
      (request.query.active == 'yes'),
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload();
    });
  }

  function _deleteOverride(z) {
    var sqlstr = "DELETE FROM heatingoverrides WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [z]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload();
    });
  }

  function _updateGroup(request) {
    var sqlstr = "UPDATE heatingoverrides SET "
      + "day = ?, "
      + "priority = ?, "
      + "start = ?, "
      + "duration = ?, "
      + "temperature = ?, "
      + "dontClear = ?, "
      + "active = ? "
      + "WHERE Name = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.day,
      request.query.priority,
      request.query.start,
      request.query.duration,
      request.query.temperature,
      (request.query.dontClear == 'yes'),
      (request.query.active == 'yes'),
      request.query.Name
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload();
    });
  }

  switch (request.query.Action) {
    case "Update":
      if (request.query.ID != 0) {
        _updateOverride(request);
      } else {
        _reload();
      }
      processHeating.load();
      break;
    case "Delete":
      console.log("Delete override %d", request.query.ID);
      if (request.query.ID != 0) {
        _deleteOverride(request.query.ID);
      } else {
        _reload();
      }
      processHeating.load();
      break;
    case "Add":
      if (request.query.ID != 0) {
        _insertOverride(request);
      } else {
        _reload();
      }
      processHeating.load();
      break;
    case "Set Group":
      if (request.query.Name) {
        _updateGroup(request);
      } else {
        _reload();
      }
      processHeating.load();
      break;
    default:
      _reload();
  }
}

exports.setOverride = function (device, override) { // Override message from Rad Controller
  try {
    var info = JSON.parse(override);

    if ((info.Hour > 0 || info.Minute > 0) && info.Temp > 0) {
      // NB The override must have the GroupName 'mobile' and the day as 'AnyDay' (10)
      var sqlstr = "UPDATE heatingOverrides AS O " +
        "INNER JOIN heatingzones AS Z ON Z.ID = O.zoneID " +
        "SET O.start = NOW(), duration = '?:?', temperature = ?, active = 1 " +
        "WHERE Z.ControlDeviceID = ? AND O.Name = 'Mobile' AND O.day = 10";
      sqlstr = sql.format(sqlstr, [info.Hour, info.Minute, info.Temp, device]);
      db.query(sqlstr, function (err) {
        if (err) {
          if (alarmLog.set(2000, err.code, device)) { // New
            utils.notify("Remote override fail", 'Alarm', device, err.message + ". " + override);
          }
        } else {
          processHeating.load(`setOverride`); // Update all flags and current heating
        }
      });
    }
  } catch (ex) {
    console.log("setOverride error %j, info %j", ex, info);
  }
}

function reloadZones(zone, response, render, showAll) {

  function _respond(data) {
    switch (render) {
      case 'json':
        var info = data.map.map(function (z) {
          var y = {};
          y.ID = z.ID;
          y.Name = z.Name;
          y.currentTemperature = z.currentTemperature;
          y.demand = z.demand;
          y.targetTemp = z.targetTemp;
          y.overrideOn = z.overrideOn;
          y.TemperatureMax = z.TemperatureMax;
          y.TemperatureMin = z.TemperatureMin;
          return y;
        });
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(info));
        response.end();
        break;
      default:
        response.render(render, data);
        break;
    }
  }

  var errorStr = "";
  var zoneName = "";
  var zoneRow = 0;
  var sqlstr = "SELECT H.*, DT.name TDname, DT.location TDlocation, ST.name TSname, "
    + "DC.name CDname, DC.location CDlocation, SC.name CSname FROM heatingzones H "
    + "LEFT JOIN DEVICES DT ON H.TemperatureDeviceID = DT.DeviceID "
    + "LEFT JOIN DEVICES DC ON H.ControlDeviceID = DC.DeviceID "
    + "LEFT JOIN SENSORS ST ON H.TemperatureDeviceID = ST.DeviceID AND H.TemperatureSensorID = ST.SensorID "
    + "LEFT JOIN SENSORS SC ON H.ControlDeviceID = SC.DeviceID AND H.ControlSensorID = SC.SensorID ";

  if (!showAll)
    sqlstr += " WHERE H.Enabled = 1";
  sqlstr += " ORDER BY H.Name";

  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log(err);
      console.log(sqlstr);
      errorStr = err.message;
      result = [];
    }
    result.forEach(function (z) {
      var t = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      if (t)
        z.currentTemperature = t;
      else
        z.currentTemperature = 0;
      // ?????? processHeating.set
      z.demand = processHeating.zoneDemand(z.ID);
      z.targetTemp = processHeating.zoneTargetTemp(z.ID);
      //  console.log(`++target ${z.ID} = ${z.targetTemp}`)
      z.overrideOn = processHeating.zoneOverrideOn(z.ID);
      z.overrideName = processHeating.zoneOverrideName(z.ID);
    });
    if (zone) {
      result.forEach(function (r, row) {
        if (r.ID == zone) {
          zoneName = r.Name;
          zoneRow = row;
        }
      });
      sqlstr = 'SELECT days, Name, Start, Temperature, preset, "Update Programme" as Action FROM heatingprogrammes '
        + "INNER join daysofweek on heatingprogrammes.days = daysofweek.ID "
        + "WHERE heatingprogrammes.zoneID = ? order by days, start";
      sqlstr = sql.format(sqlstr, zone);
      db.query(sqlstr, function (err, resultp) {
        if (err) {
          console.log(`reload Zones error: ${err.message} ${sqlstr}`);
          errorStr += err.message;
          resultp = [];
        }
        resultp.push({ days: 10, Name: 'Anyday', Start: '12:00:00', Temperature: 21, preset: false, Action: 'Add Programme' });
        _respond({ map: result, programme: resultp, zone: { ID: zone, name: zoneName, row: zoneRow }, err: errorStr });
      });
    } else {
      _respond({ map: result, err: errorStr });
    }
  });
}

exports.zonesInfo = function (request, response) {
  reloadZones(request.query.zoneID, response, 'json', false);
}

exports.zoneInfoByName = function (request, response) {
  processHeating.zoneInfoByName(request.body.room, (info) => {
    response.setHeader('Content-Type', 'application/json');
    console.log(`CK - Zone info: ${info}`);
    if (info.err != "OK") response.status(400);
    response.end(JSON.stringify(info));
  });
}

exports.whyFiring = function (request, response) {
  processHeating.firingReason(request.body.onoff, request.body.temp, (info) => {
    response.setHeader('Content-Type', 'application/json');
    console.log("CK demand: %j", info);
    response.end(JSON.stringify(info));
  });
}

exports.voiceOverrides = function (request, response) {
  function _overrideSetResponse(info) {
    response.setHeader('Content-Type', 'application/json');
    if (info.err != "OK") response.status(400);
    //console.log("OR info: %j", info);
    response.send(JSON.stringify(info));
    response.end();
  }

  function _makeAmountText(txt, amount) {
    var str = amount + ' ' + txt;
    if (amount != 1) str += 's';
    return str;
  }

  function _chooseFastestZone(info) {
    let id = 0;
    if (info.err == 'OK' && info.zones) {
      if (info.zones.length >= 2) {
        info.zones.reduce((hgr, z, idx) => {
          if (z.heatGainRate > hgr) {
            id = idx;
            return z.heatGainRate;
          } else return hgr;
        }, 0.0);
      };
    }
    return id;
  }

  function _decodeRequestParams(info) {
    function _decodeDuration(info) {
      if (request.body.duration) {
        let v = parseInt(request.body.duration, 10); // duration may be in the form '<v> hours'
        if (isNaN(v)) { // Assume may be in form {amount:<v>, unit:h||min }
          try {
            var duration = JSON.parse(request.body.duration);
            switch (duration.unit) {
              case 'h':
                info.hour = duration.amount;
                info.minute = 0;
                info.durationText = _makeAmountText('hour', duration.amount);
                break;
              case 'min':
                info.hour = 0;
                info.minute = duration.amount;
                info.durationText = _makeAmountText('minute', duration.amount);
                break;
              default: info.hour = 1; info.minute = 0; info.durationText = '1 hour'; break;
            }
          } catch (e) {
            console.log("decodeDuration: ", e);
            info.hour = 1; info.minute = 0; info.durationText = '1 hour';
          }
        } else {
          info.hour = v; info.minute = 0; info.durationText = makeAmountText('hour', v);
        }
      } else {
        info.hour = 1; info.minute = 0; info.durationText = '1 hour';
      }
    }

    if (request.body.onOff && request.body.onOoff != '%onoff') {
      info.onOffAction = request.body.onOff;
    } else {
      info.onOffAction = 'on';
    }
    if (info.onOffAction == 'on') {
      if (request.body.temperature && request.body.temperature != '%temperature') {
        info.targetRequest = request.body.temperature.match(/\d+/)[0];
      } else if (request.body.temperatureNumber && request.body.temperaturenumber != '%temperaturenumber') {
        info.targetRequest = request.body.temperatureNumber;
      }
    }
    _decodeDuration(info);
    return _chooseFastestZone(info);
  }

  function gotZone(info) {
    if (info.err != "OK") {
      overrideSetResponse(info);
    } else {
      let id = _decodeRequestParams(info); // index to info.zones[]
      let z = info.zones[id];
      switch (info.onOffAction) {
        case 'on': z.targetTemp = info.targetRequest; z.override = true; break;
        case 'raise': info.targetRequest = ++z.targetTemp; z.override = true; break;
        case 'lower': info.targetRequest = --z.targetTemp; z.override = true; break;
        case 'off': info.targetRequest = z.targetTemp; z.override = false; break;
        default: z.override = false; info.err = "Bad onOff flag: " + info.onOffAction; break;
      }
      // NB The override must have the GroupName 'mobile' and the day as 'AnyDay' (10)
      var sqlstr;
      if (info.onOffAction != 'off') {
        sqlstr = "UPDATE heatingOverrides " +
          "SET start = NOW(), duration = '?:?', temperature = ?, active = ? " +
          "WHERE zoneID = ? AND Name = 'Mobile' AND day = 10";
        sqlstr = sql.format(sqlstr, [info.hour, info.minute, z.targetTemp, z.override, z.zoneID]);
      } else {
        sqlstr = "UPDATE heatingOverrides " +
          "SET active = ? " +
          "WHERE zoneID = ? AND Name = 'Mobile' AND day = 10";
        sqlstr = sql.format(sqlstr, [z.override, z.zoneID]);
      }
      // console.log(sqlstr);
      db.query(sqlstr, function (err) {
        if (err) {
          console.log("OR error: %j %j", sqlstr, err);
          info.err = "Can't set override";
        } else {
          processHeating.load(`gotZone`); // Update all flags and current heating
        }
        _overrideSetResponse(info);
      });
    }
  }

  // console.log("overrideHeating rq: %j", request.body);
  processHeating.zoneInfoByName(request.body.room, gotZone);
}

exports.manage = function (request, response) {

  function _reload(zone) {
    reloadZones(zone, response, 'heating', true);
  }

  function _updateZone(request) {
    var isMaster = false;
    if (request.query.IsMaster) isMaster = true;
    var Enabled = false;
    if (request.query.Enabled) Enabled = true;
    var sqlstr = "UPDATE heatingzones SET "
      + "Name = ?, "
      + "Enabled = ?, "
      + "MasterZone = ?, "
      + "IsMaster = ?, "
      + "TemperatureDeviceID = ?, "
      + "TemperatureSensorID = ?, "
      + "ControlDeviceID = ?, "
      + "ControlSensorID = ?, "
      + "TemperatureMax = ?, "
      + "TemperatureMin = ? "
      + "WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.Name,
      Enabled,
      request.query.MasterZone,
      isMaster,
      request.query.TemperatureDeviceID,
      request.query.TemperatureSensorID,
      request.query.ControlDeviceID,
      request.query.ControlSensorID,
      request.query.TemperatureMax,
      request.query.TemperatureMin,
      request.query.ID
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload();
    });
  }

  function _deleteZone(z) {
    // First delete any programmes
    var sqlstr = "DELETE FROM heatingprogrammes WHERE zoneID = ?";
    sqlstr = sql.format(sqlstr, [z]);
    db.query(sqlstr, function (err) {
      if (err) {
        console.log(err);
        _reload();
      } else {
        sqlstr = "DELETE FROM heatingzones WHERE ID = ?";
        sqlstr = sql.format(sqlstr, [z]);
        db.query(sqlstr, function (err) {
          if (err) { console.log(err); }
          _reload();
        });
      }
    });
  }

  function _duplicateZone(request) {
    var sqlstr = "INSERT heatingzones  "
      + "(Name, Enabled, MasterZone, TemperatureDeviceID, TemperatureSensorID, ControlDeviceID, ControlSensorID, TemperatureMax, TemperatureMin) "
      + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    sqlstr = sql.format(sqlstr, [
      request.query.Name,
      false, // Make duplicated zone disabled 
      request.query.MasterZone,
      request.query.TemperatureDeviceID,
      request.query.TemperatureSensorID,
      request.query.ControlDeviceID,
      request.query.ControlSensorID,
      request.query.TemperatureMax,
      request.query.TemperatureMin
    ]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload();
    });
  }

  function _updateProgramme(request) {
    var sqlstr = "UPDATE heatingprogrammes SET "
      + "zoneID = ?, "
      + "Temperature = ?, "
      + "start = ?, "
      + "days = ?, "
      + "preset = ? "
      + "WHERE zoneID = ? AND days = ? AND start = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.zoneID,
      request.query.Temperature,
      request.query.Start,
      request.query.days,
      request.query.preset == 'yes',
      request.query.zoneID,
      request.query.oldDays,
      request.query.oldStart
    ]);
    db.query(sqlstr, function (err) {
      if (err) {
        if (err.rrno == 1062) { // Duplicate key so just update Temperature && preset
          sqlstr = "UPDATE heatingprogrammes SET "
            + "Temperature = ?, "
            + "preset = ? "
            + "WHERE zoneID = ? AND days = ?";
          sqlstr = sql.format(sqlstr, [
            request.query.Temperature,
            request.query.preset == 'yes',
            request.query.zoneID,
            request.query.days
          ]);
          db.query(sqlstr, function (err) {
            if (err) { console.log(err); }
            _reload(request.query.zoneID);
          });
        } else { console.log(err); }
      }
      _reload(request.query.zoneID);
    });
  }

  function _addProgramme(request) {
    var sqlstr = "INSERT heatingprogrammes  "
      + "(zoneID, days, start, temperature, preset) "
      + "VALUES (?, ?, ?, ?, ?)";
    sqlstr = sql.format(sqlstr, [
      request.query.zoneID,
      request.query.days,
      request.query.Start,
      request.query.Temperature,
      request.query.preset == 'yes'
    ]);
    sqlstr += ' ON DUPLICATE KEY UPDATE Temperature=VALUES(Temperature)';
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload(request.query.zoneID);
    });
  }

  function _deleteProgramme(request) {
    var sqlstr = "DELETE FROM heatingprogrammes WHERE zoneID = ? AND days = ? AND start = ?";
    sqlstr = sql.format(sqlstr, [request.query.zoneID, request.query.days, request.query.Start]);
    db.query(sqlstr, function (err) {
      if (err) { console.log(err); }
      _reload(request.query.zoneID);
    });
  }

  switch (request.query.Action) {
    case "Update":
      if (login.check(request, response)) {
        if (request.query.ID) {
          _updateZone(request);
        } else {
          _reload();
        }
        processHeating.load();
      }
      break;
    case "Delete":
      if (login.check(request, response)) {
        if (request.query.ID) {
          _deleteZone(request.query.row);
        } else {
          _reload();
        }
        processHeating.load();
      }
      break;
    case "Duplicate":
      if (login.check(request, response)) {
        if (request.query) {
          _duplicateZone(request);
        } else {
          _reload();
        }
        processHeating.load();
      }
      break;
    case "Show Programme":
      _reload(request.query.ID);
      break;
    case "Update Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          _updateProgramme(request)
        } else {
          _reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    case "Add Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          _addProgramme(request)
        } else {
          _reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    case "Delete Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          _deleteProgramme(request)
        } else {
          _reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    default:
      _reload();
  }
}

exports.temperatureDials = function (request, response) {
  reloadZones(request.query.zoneID, response, 'temperatureDials', false);
}

exports.getAllDeviceInfo = getAllDeviceInfo;

function getAllDeviceInfo(request, response) {
  var info;
  if (request.query.zoneID) {
    info = mapZone(processHeating.allZones().find((z) => (z) ? z.ID == request.query.zoneID : false));
  } else {
    info = processHeating.allZones().map((z) => mapZone(z)).filter((z) => (z) ? true : false);
  }
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(info));
  console.log(`getAllDeviceInfo ${JSON.stringify(info.targetTemp)}`);
  function mapZone(z) {
    if (!z) return null;
    var y = Object.assign({}, z);
    delete y.programme; // Not needed
    y.isChangeable = processHeating.allOverrides().some((o) => o.zoneID == z.ID && o.Name == EXTERNAL_NAME);
    var t = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
    y.currentTemperature = (t) ? t : 0;
    return y;
  }
}

exports.externalSetOverride = function (request, response) {
  // console.log(`externalSetOverride ${JSON.stringify(request.query)}`);
  if ((0 <= request.query.hour && request.query.hour < 24)
    && (5 <= request.query.temperature && request.query.temperature <= 30)) {
    // NB The override must have the GroupName <EXTERNAL_NAME> and the day as 'AnyDay' (10)
    // This assumes only 1 override with that GroupName for the specified zone
    // If hour == 0 clear active flag
    var sqlstr = "UPDATE heatingOverrides " +
      "SET start = NOW(), duration = '?:0', temperature = ?, active = ? " +
      `WHERE zoneID = ? AND Name = '${EXTERNAL_NAME}' AND day = 10`;
    sqlstr = sql.format(sqlstr, [parseInt(request.query.hour), parseInt(request.query.temperature),
    (request.query.hour > 0) ? 1 : 0, parseInt(request.query.zoneID)]);
    db.query(sqlstr, function (err) {
      if (err) {
        if (alarmLog.set(2001, err.code, request.query.overrideID)) { // New
          utils.notify("Remote override fail", 'Alarm', request.query.overrideID, err.message);
        }
      } else {
        processHeating.load(`externalSetOverride`); // Update all flags and current heating
        setTimeout(() => getAllDeviceInfo(request, response), 2000);
      }
    });
  }
}
