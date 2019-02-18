"use strict";
var processHeating = require('./processHeating');
var login = require('./login');

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

exports.mobileOverrides = function (request, response) {
  var errorStr = "";
  function reload(zone) {
    var zoneName = "";
    var zoneRow = 0;
    var sqlstr = "SELECT zoneID, heatingoverrides.ID AS oID, heatingzones.Name AS zoneName, "
      + "heatingoverrides.Name AS groupName, TemperatureMax, TemperatureMin, "
      + "heatingoverrides.day, daysofweek.Name AS dayName, "
      + "heatingoverrides.`start`, duration, temperature, dontClear, active "
      + "FROM heatingoverrides "
      + "INNER JOIN heatingzones ON heatingoverrides.zoneID = heatingzones.ID "
      + "INNER JOIN daysofweek ON heatingoverrides.day = daysofweek.ID "
      + "WHERE heatingoverrides.Name = 'Mobile' ORDER BY zoneName";
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log("mobile %j", err);
        console.log(sqlstr);
        errorStr = err.message;
        result = [];
      }
      sqlstr = "SELECT heatingoverrides.Name AS name, max(temperature) AS temperature, day, daysofweek.Name AS dayName, "
        + "min(heatingoverrides.start) as start, min(heatingoverrides.duration) as duration "
        + "from heatingoverrides inner join daysofweek on daysofweek.ID = heatingoverrides.day "
        + "GROUP BY name";
      db.query(sqlstr, function (err, result1) {
        if (err) {
          console.log("mobile1 %j", err);
          console.log(sqlstr);
          errorStr = err.message;
          result1 = [];
        }
        sqlstr = "SELECT * FROM daysofweek"
        db.query(sqlstr, function (err, result2) {
          if (err) {
            console.log("mobile2 %j", err);
          }
          result.forEach(function (el) {
            el.target = processHeating.zoneTargetTemp(el.zoneID);
            el.currentTemperature = processHeating.zoneCurrentTemp(el.zoneID);
          });
          response.render('heatingMobile',
            { map: result, loggedIn: request.loggedIn, zone: { zoneID: zone }, err: errorStr });
        });
      });
    });
  }

  function updateOverride(request) {
    var sqlstr = "UPDATE heatingoverrides SET "
      + "day = ?, "
      + "start = ?, "
      + "duration = ?, "
      + "temperature = ?, "
      + "dontClear = ?, "
      + "active = ? "
      + "WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [
      request.query.day,
      request.query.start,
      request.query.duration + ':00',
      request.query.temperature,
      (request.query.dontClear == 'yes'),
      (request.query.active == 'yes' && request.query.duration > 0),
      request.query.ID
    ]);
    db.query(sqlstr, function (err, result) {
      if (err) { console.log("updateOverride %j SQL = %s request= %j", err, sqlstr, request); errorStr = "Empty values?"; }
      reload(request.query.zoneID);
    });
  }
  console.log("**mobileOverrides: %j", request.query);
  if (request.query.zoneID) {
    if (request.query.Action == "Set") {
      if (login.check(request, response)) {
        updateOverride(request);
        processHeating.load();
      }
    } else {
      reload(request.query.zoneID);
    }
  } else {
    reload();
  }
}

exports.mobileGroups = function (request, response) {
  var errorStr = "";

  function reload() {
    var zoneName = "";
    var zoneRow = 0;
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

  function updateGroup(request) {
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log("updateGroup %j", err); }
      reload();
    });
  }

  switch (request.query.Action) {
    case "Set Group":
      if (login.check(request, response)) {
        if (request.query.Name) {
          updateGroup(request);
        } else {
          reload();
        }
        processHeating.load();
      }
      break;
    default:
      reload();
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
  db.query(sqlstr, function (err, result) {
    if (err) { console.log("set Emergency Group %j", err); }
    processHeating.load();
  });
}

exports.clearEmergencyOverride = function () {
  var sqlstr = "UPDATE heatingoverrides SET "
    + "active = 0 "
    + "WHERE Name = 'Emergency'";
  db.query(sqlstr, function (err, result) {
    if (err) { console.log("clear Emgergency Group %j", err); }
    processHeating.load();
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
  var sqlstr = "SELECT ID, Name FROM heatingZones"
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

  function reload(zone) {
    var zoneName = "";
    var zoneRow = 0;
    var sqlstr = "SELECT zoneID, heatingoverrides.ID AS oID, heatingzones.Name AS zoneName, "
      + "heatingoverrides.Name AS oName,  heatingoverrides.priority AS priority,  TemperatureMax, TemperatureMin, "
      + "heatingoverrides.day, daysofweek.Name AS dayName, "
      + "heatingoverrides.`start`, duration, temperature, dontClear, active, TRUE AS ex "
      + "FROM heatingoverrides "
      + "INNER JOIN heatingzones ON heatingoverrides.zoneID = heatingzones.ID "
      + "INNER JOIN daysofweek ON heatingoverrides.day = daysofweek.ID "
      + "ORDER BY oName";
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

  function updateOverride(request) {
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); errorStr = "Empty values?"; }
      reload();
    });
  }

  function insertOverride(request) {
    var sqlstr = "INSERT heatingoverrides  "
      + "(Name, priority, zoneID, day, Temperature, start, duration, active, dontClear) "
      + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload();
    });
  }

  function deleteOverride(z) {
    var sqlstr = "DELETE FROM heatingoverrides WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [z]);
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload();
    });
  }

  function updateGroup(request) {
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload();
    });
  }

  switch (request.query.Action) {
    case "Update":
      if (request.query.ID != 0) {
        updateOverride(request);
      } else {
        reload();
      }
      processHeating.load();
      break;
    case "Delete":
      console.log("Delete override %d", request.query.ID);
      if (request.query.ID != 0) {
        deleteOverride(request.query.ID);
      } else {
        reload();
      }
      processHeating.load();
      break;
    case "Add":
      if (request.query.ID != 0) {
        insertOverride(request);
      } else {
        reload();
      }
      processHeating.load();
      break;
    case "Set Group":
      if (request.query.Name) {
        updateGroup(request);
      } else {
        reload();
      }
      processHeating.load();
      break;
    default:
      reload();
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
      db.query(sqlstr, function (err, result) {
        if (err) {
          if (alarmLog.set(2000, err.code, device)) { // New
            utils.notify("Remote override fail", 'Alarm', device, err.message + ". " + override);
          }
        } else {
          processHeating.load(); // Update all flags and current heating
        }
      });
    }
  } catch (ex) {
    console.log("setOverride error %j, info %j", ex, info);
  }
}

function reloadZones(zone, request, response, render) {

  function respond(data) {
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
    + "LEFT JOIN SENSORS SC ON H.ControlDeviceID = SC.DeviceID AND H.ControlSensorID = SC.SensorID "
    + "order by H.Name";

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
          console.log(err);
          console.log(sqlstr);
          errorStr += err.message;
          resultp = [];
        }
        resultp.push({ days: 10, Name: 'Anyday', Start: '12:00:00', Temperature: 21, preset: false, Action: 'Add Programme' });
        respond({ map: result, programme: resultp, zone: { ID: zone, name: zoneName, row: zoneRow }, err: errorStr });
      });
    } else {
      respond({ map: result, err: errorStr });
    }
  });
}

exports.zonesInfo = function (request, response) {
  reloadZones(request.query.zoneID, request, response, 'json');
}

exports.zoneInfoByName = function (request, response) {
  function gotInfo(info) {
    response.setHeader('Content-Type', 'application/json');
    if (info.err != "OK") response.status(400);
    console.log("CK info: %j", info);
    response.send(JSON.stringify(info));
    response.end();
  }
  processHeating.zoneInfoByName(request.body.room, gotInfo);
}

exports.whyFiring = function (request, response) {
  function gotInfo(info) {
    response.setHeader('Content-Type', 'application/json');
    console.log("CK demand: %j", info);
    response.send(JSON.stringify(info));
    response.end();
  }
  processHeating.firingReason(request.body.onoff, request.body.temp, gotInfo);
}

exports.voiceOverrides = function (request, response) {
  function overrideSetResponse(info) {
    response.setHeader('Content-Type', 'application/json');
    if (info.err != "OK") response.status(400);
    //console.log("OR info: %j", info);
    response.send(JSON.stringify(info));
    response.end();
  }

  function makeAmountText(txt, amount) {
    var str = amount + ' ' + txt;
    if (amount != 1) str += 's';
    return str;
  }

  function chooseFastestZone(info) {
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

  function decodeRequestParams(info) {
    function decodeDuration(info) {
      if (request.body.duration) {
        let v = parseInt(request.body.duration, 10); // duration may be in the form '<v> hours'
        if (isNaN(v)) { // Assume may be in form {amount:<v>, unit:h||min }
          try {
            var duration = JSON.parse(request.body.duration);
            switch (duration.unit) {
              case 'h':
                info.hour = duration.amount;
                info.minute = 0;
                info.durationText = makeAmountText('hour', duration.amount);
                break;
              case 'min':
                info.hour = 0;
                info.minute = duration.amount;
                info.durationText = makeAmountText('minute', duration.amount);
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
    decodeDuration(info);
    return chooseFastestZone(info);
  }

  function gotZone(info) {
    if (info.err != "OK") {
      overrideSetResponse(info);
    } else {
      let id = decodeRequestParams(info); // index to info.zones[]
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
      db.query(sqlstr, function (err, result) {
        if (err) {
          console.log("OR error: %j %j", sqlstr, err);
          info.err = "Can't set override";
        } else {
          processHeating.load(); // Update all flags and current heating
        }
        overrideSetResponse(info);
      });
    }
  }

  // console.log("overrideHeating rq: %j", request.body);
  processHeating.zoneInfoByName(request.body.room, gotZone);
}

exports.manage = function (request, response) {

  function reload(zone) {
    reloadZones(zone, request, response, 'heating');
  }

  function updateZone(request) {
    var isMaster = false;
    if (request.query.IsMaster) isMaster = true;
    var sqlstr = "UPDATE heatingzones SET "
      + "Name = ?, "
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload();
    });
  }

  function deleteZone(z) {
    // First delete any programmes
    var sqlstr = "DELETE FROM heatingprogrammes WHERE zoneID = ?";
    sqlstr = sql.format(sqlstr, [z]);
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.log(err);
        reload();
      } else {
        sqlstr = "DELETE FROM heatingzones WHERE ID = ?";
        sqlstr = sql.format(sqlstr, [z]);
        db.query(sqlstr, function (err, result) {
          if (err) { console.log(err); }
          reload();
        });
      }
    });
  }

  function duplicateZone(request) {
    var sqlstr = "INSERT heatingzones  "
      + "(Name, MasterZone, TemperatureDeviceID, TemperatureSensorID, ControlDeviceID, ControlSensorID, TemperatureMax, TemperatureMin) "
      + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    sqlstr = sql.format(sqlstr, [
      request.query.Name,
      request.query.MasterZone,
      request.query.TemperatureDeviceID,
      request.query.TemperatureSensorID,
      request.query.ControlDeviceID,
      request.query.ControlSensorID,
      request.query.TemperatureMax,
      request.query.TemperatureMin
    ]);
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload();
    });
  }

  function updateProgramme(request) {
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
    db.query(sqlstr, function (err, result) {
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
          db.query(sqlstr, function (err, result) {
            if (err) { console.log(err); }
            reload(request.query.zoneID);
          });
        } else { console.log(err); }
      }
      reload(request.query.zoneID);
    });
  }

  function addProgramme(request) {
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
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload(request.query.zoneID);
    });
  }

  function deleteProgramme(request) {
    var sqlstr = "DELETE FROM heatingprogrammes WHERE zoneID = ? AND days = ? AND start = ?";
    sqlstr = sql.format(sqlstr, [request.query.zoneID, request.query.days, request.query.Start]);
    db.query(sqlstr, function (err, result) {
      if (err) { console.log(err); }
      reload(request.query.zoneID);
    });
  }

  switch (request.query.Action) {
    case "Update":
      if (login.check(request, response)) {
        if (request.query.ID) {
          updateZone(request);
        } else {
          reload();
        }
        processHeating.load();
      }
      break;
    case "Delete":
      if (login.check(request, response)) {
        if (request.query.ID) {
          deleteZone(request.query.row);
        } else {
          reload();
        }
        processHeating.load();
      }
      break;
    case "Duplicate":
      if (login.check(request, response)) {
        if (request.query) {
          duplicateZone(request);
        } else {
          reload();
        }
        processHeating.load();
      }
      break;
    case "Show Programme":
      reload(request.query.ID);
      break;
    case "Update Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          updateProgramme(request)
        } else {
          reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    case "Add Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          addProgramme(request)
        } else {
          reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    case "Delete Programme":
      if (login.check(request, response)) {
        if (request.query.zoneID) {
          deleteProgramme(request)
        } else {
          reload(request.query.zoneID);
        }
        processHeating.load();
      }
      break;
    case "Reload Control":
      reload();
      processHeating.load();
      break;
    default:
      reload();
      processHeating.load();
  }
}

exports.temperatureDials = function (request, response) {
  reloadZones(request.query.zoneID, request, response, 'temperatureDials');
}

exports.getAllDeviceInfo = getAllDeviceInfo;

function getAllDeviceInfo(request, response) {
  var sqlstr = "SELECT zoneID, heatingoverrides.ID AS oID, heatingzones.Name AS zoneName, "
    + "heatingzones.MasterZone, heatingzones.IsMaster, "
    + "heatingzones.TemperatureDeviceID, heatingzones.TemperatureSensorID, "
    + "heatingoverrides.Name AS groupName, TemperatureMax, TemperatureMin, "
    + "heatingoverrides.day, daysofweek.Name AS dayName, "
    + "heatingoverrides.`start`, duration, temperature, dontClear, active "
    + "FROM heatingoverrides "
    + "INNER JOIN heatingzones ON heatingoverrides.zoneID = heatingzones.ID "
    + "INNER JOIN daysofweek ON heatingoverrides.day = daysofweek.ID "
    + "WHERE heatingoverrides.Name = 'Mobile' "
  if (request.query.overrideID) {
    sqlstr += " AND heatingoverrides.ID = ? "
    sqlstr = sql.format(sqlstr, [request.query.overrideID]);
  }
  sqlstr = sqlstr + " ORDER BY zoneName";
  // console.log(sqlstr);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.log("zones %j", err);
    }
    var info = result.map(function (z) {
      var y = {};
      y.ID = z.zoneID;
      y.Name = z.zoneName;
      y.overrideID = z.oID
      y.MasterZone = z.MasterZone;
      y.IsMaster = z.IsMaster;
      var t = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      if (t)
        y.currentTemperature = t;
      else
        y.currentTemperature = 0;
      processHeating.set
      y.demand = processHeating.zoneDemand(z.zoneID);
      y.targetTemp = processHeating.zoneTargetTemp(z.zoneID);
      y.overrideOn = processHeating.zoneOverrideOn(z.zoneID);
      // console.log(y);
      return y;
    });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(info));
  });
}

exports.externalSetOverride = function (request, response) {
  if ((0 < request.query.hour && request.query.hour < 24)
    && (5 <= request.query.temperature && request.query.temperature <= 30)) {
    // NB The override must have the GroupName 'mobile' and the day as 'AnyDay' (10)
    var sqlstr = "UPDATE heatingOverrides " +
      "SET start = NOW(), duration = '?:0', temperature = ?, active = 1 " +
      "WHERE ID = ? AND Name = 'Mobile' AND day = 10";
    sqlstr = sql.format(sqlstr, [parseInt(request.query.hour), parseInt(request.query.temperature), request.query.overrideID]);
    db.query(sqlstr, function (err, result) {
      if (err) {
        if (alarmLog.set(2001, err.code, request.query.overrideID)) { // New
          utils.notify("Remote override fail", 'Alarm', request.query.overrideID, err.message);
          // console.log(sqlstr);
        }
      } else {
        processHeating.load(); // Update all flags and current heating
      }
    });
  }
  getAllDeviceInfo(request, response);
}
