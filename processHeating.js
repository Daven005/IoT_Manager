"use strict";
var zones = [];
var overrides = [];

exports.load = load;

function load(doCheck) { // doCheck after loading is complete
  var errorStr = "";
  var sqlstr = "SELECT * FROM heatingzones"
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log(err);
      console.log(sqlstr);
      errorStr = err.message;
      result = [];
    }
    zones = [];
    result.forEach(function(r) {
      r.overrideOn = false;
      r.demand = false;
      r.programme = [];
      zones[r.ID] = r;      
    });
    sqlstr = "SELECT * FROM heatingprogrammes ORDER BY days, start DESC"
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        console.log(sqlstr);
        errorStr = err.message;
        result = [];
      }
      result.forEach(function(r) {
        zones[r.zoneID].programme.push(r);
      });
      // console.log("Heating zones: %j", zones);
      sqlstr = "SELECT * FROM heatingoverrides"
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
          console.log(sqlstr);
          result = [];
        }
        overrides = [];
        result.forEach(function(r) {
          overrides[r.ID] = r;
        });
        if (doCheck) {
          // console.log("O->%j", overrides);
          check();
        }
      });
    });
  });
}

function checkZonesHeat(timeNow, dateStr, dow, previousDow, log) { 
  if (log) console.log(timeNow);

  zones.forEach(function (z) { // First check each zone's own demand
    checkZoneHeat(z, timeNow, dateStr, dow, previousDow);
  });
  
  zones.forEach(function (z) { // Then check for Master/Slave demands once all individual demands calculated
    if (log) {
      var currentTemperature = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      console.log("%s = %d ---> %d. Sensor %s Override: %s Demand: %s Other: %s", 
        z.Name, currentTemperature, z.targetTemp, z.ControlSensorID, 
        z.overrideOn ? "ON" : "OFF", 
        z.demand ? "ON" : "OFF", checkDemand(z) ? "ON" : "OFF");
    }
    z.demand = checkDemand(z); // Now Update any demand from other zones
    setHeatingOutput(z.ControlDeviceID, z.ControlSensorID, z.demand);
  });

  function checkZoneHeat(z, timeNow, dateStr, dow, previousDow) {    
    var targetTemp = -99;
    var presetIdx = -1;

    // if (log && (z.programme.length > 0)) console.log("P->%j", z.programme);

    // Find first programe for zone (z) that matches time/date and then set targetTemp
    // NB programmes are time descending
    z.programme.some(checkDayTime); 

    if (targetTemp == -99 && previousDow) {// Not found programme so look from midnight last night
        checkZoneHeat(z, new Date(dateStr+" 23:59:00"), dateStr, previousDow);
    } else {
      var currentTemperature = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      overrides.forEach(checkOverrides);
      z.demand = (currentTemperature < targetTemp);
      z.targetTemp = targetTemp;
    }
    return;
    
    function checkDayTime(p, idx) {
      if (isProgrammeDay(p, dow)) {
        if (checkTime()) return true;
      }   
      return false;

      function checkTime() {
        var start = new Date(dateStr + ' ' + p.start);       
        if (timeNow >= start) {
          targetTemp = p.temperature;
          return true;
        }
        return false;
      }
    }
    
    function checkOverrides(o) {
      if (o.zoneID == z.ID) {
        if (o.active) {
          if (log) console.log("override: %j", o);
          if (checkOverrideWithinTime()) {
            targetTemp = o.temperature;
            z.overrideOn = true;
          } else {
            z.overrideOn = false;
            if (!o.dontClear && checkOverrideAfterEnd()) {
              o.active = false;
              clearActive(o.ID); // In case of restart
              console.log("Override %d Active flag cleared", o.ID);
            }
          }
        }
      }
      
      function getDuration() {
        var a = o.duration.split(':');
        return 1000*(parseInt(a[0]) * 60 * 60 + parseInt(a[1]) * 60); // Ignoring seconds
      }
      
      function checkOverrideWithinTime() {
        var start = new Date(dateStr + ' ' + o.start);
        var duration = getDuration();
        if (duration == 0 || duration >= (24*60-1)*60*1000) return true; // 00:00 or 23:59
        return (start <= timeNow && timeNow <= (start.getTime()+duration));
      }
      
      function checkOverrideAfterEnd() {
        var start = new Date(dateStr + ' ' + o.start);
        var duration = getDuration();
        if (duration == 0 || duration >= (24*60-1)*60*1000) return true; // 00:00 or 23:59
        return timeNow >= (start.getTime()+duration);
      }
    }
    
    function clearActive(id) {
      var sqlstr = sql.format("UPDATE heatingoverrides SET active = 0 WHERE ID = ?", [id]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
        }
      });
    }
    
  }
  
  function checkDemand(thisZone) {
    var demand = thisZone.demand;
    zones.forEach(function (z) {
      if (z.MasterZone == thisZone.ID) {
        if (z.demand) {
          // if (log) console.log("Master zone %d demand set by zone %d", z.MasterZone, thisZone.ID);
          demand = true;
        }
      }
    });
    return demand;
  }

}

exports.check = check;

function check(t) {
  var info = {dow:0,  prevDow:0,  nextDow:0,  timeNow:0,  dateStr:""};
  calcDates(t, info);
  checkZonesHeat(info.timeNow, info.dateStr, info.dow, info.previousDow, (typeof t != 'undefined'));
}

exports.setOutput = setHeatingOutput;

function setHeatingOutput(Device, Sensor, demand) {
    var topic, error ;
    
    if (Sensor >= 20) Sensor -= 20; // Allow for offset Sensor IDs
    if ((Sensor == 4 || Sensor == 7) && demand) {
		error = new Error(`setHeatingOutput ${Sensor}, ${demand}`);
		//console.log(error.stack);
	}
	topic = `/Raw/${Device}/${Sensor}/set/output`;
    //console.log("Heating %s %j", topic, demand);
    if (config.boiler.enabled) {
		client.publish(topic, (demand) ? '1' : '0');
	} else {
		console.log("Heating: %s->%j", topic, demand);
	}
}

exports.test = function(request, response) {
  console.log("Action %s Command: %s", request.query.action, request.query.command);
  switch (request.query.action) {
  case 'devices':
	console.log(deviceState.show());
  case "load":
    load(false);
    break;
  case "zones":
    console.log("Zones %j", zones);
    break;
  case "overrides":
    var idx;
    console.log("Overrides:");
    for (idx=0; idx<overrides.length; idx++) {
      if (overrides[idx]) {
        console.log("%j", overrides[idx]);
      }
    }
    break;
  default:
    check(request.query.command);
  }
  response.render("testHeating", {});
}

exports.zoneDemand = zoneDemand;
exports.zoneTargetTemp = zoneTargetTemp;
exports.zoneCurrentTemp = zoneCurrentTemp;
exports.zoneOverrideOn = zoneOverrideOn;

function zoneDemand(id) {
  if (zones[id])
    return zones[id].demand;
  else {
    console.log("Bad zone ID: %j", id);
    return false;
  }
}

function zoneCurrentTemp(id) {
  var t = deviceState.getLatestTemperature(zones[id].TemperatureDeviceID, zones[id].TemperatureSensorID);
  if (t) 
    return t;
  else
    return 0;
}

function zoneTargetTemp(id) {
  return zones[id].targetTemp;
}

function zoneOverrideOn(id, name) { // Set when ANY override is active for this zone
  return zones[id].overrideOn;
}

exports.zoneInfoByName = function(name, callback) {
  var info = {err: 'OK', zones: []};
  var sqlstr = sql.format('SELECT ID, Name, HeatGainRate FROM HeatingZones WHERE Name LIKE "%?%"', [name]);
  sqlstr = sqlstr.replace(/'/g, "");
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log("zoneInfoByName %j", err);
      info.err = "Can't find room called "+name;
    } else {
      if (result.length >= 1) {
        result.forEach(function(result) {
          var id = result.ID;
          var zone = {};
          zone.temperature = zoneCurrentTemp(id);
          zone.demand = zoneDemand(id);
          zone.targetTemp = zoneTargetTemp(id);
          zone.override = zoneOverrideOn(id);
          zone.zoneID = id;
          zone.zoneName = result.Name;
          zone.heatGainRate = result.HeatGainRate;
          info.zones.push(zone);
        });
      } else {
        info.err = "Can't find room called "+name;
      }
    }
    callback(info);
  });
}

exports.firingReason = function(onoff, temperature, callback) {
  var sqlstr;
  var info = {err: 'OK', demand: []};

  function checkDHW(onoff) {
    sqlstr = 'SELECT T.Value, T.time from devices AS D '+
        'INNER JOIN sensors AS S ON D.deviceID = S.DeviceID '+
        'INNER JOIN temperaturelog AS T on T.deviceID = D.deviceID AND T.SensorID = S.SensorID '+
        'WHERE D.name = ' + config.boiler.controllerName + ' ' +
        'AND S.Name = "TS Top" '+
        'AND T.Time > DATE_SUB(now(), INTERVAL 20 MINUTE) '+
        'ORDER BY T.Value ASC LIMIT 1';
    db.query(sqlstr, function(err, result) {
      var dhwTemp;
      if (err) {
        console.log("No temperatureLog for 'TS Top'");
        dhwTemp = 0;
      } else {
        dhwTemp = result[0].Value;
        var dhwSetpoint = 60.0;
        sqlstr = 'SELECT T.Value, T.time from devices AS D '+
          'INNER JOIN sensors AS S ON D.deviceID = S.DeviceID '+
          'INNER JOIN temperaturelog AS T on T.deviceID = D.deviceID AND T.SensorID = S.SensorID '+
          'WHERE D.name = ' + config.boiler.controllerName + ' '+
          'AND S.Name = "DHW setpoint" '+
          'AND T.Time > DATE_SUB(now(), INTERVAL 1 MINUTE) '+
          'ORDER BY T.Time DESC LIMIT 1';
        db.query(sqlstr, function(err, result) {
          if (err) {
            console.log("No temperatureLog for 'DHW setpoint'");
          } else {
            if (result[0].Value) dhwSetpoint = result[0].Value
            if (onoff) {
              if (dhwSetpoint > dhwTemp) 
                info.demand.push({name: 'Hot Water', temperature: dhwTemp, override: false, target: dhwSetpoint});
            } else {
              if ((dhwTemp - dhwSetpoint) < 1)
                info.demand.push({name: 'Hot Water', temperature: dhwTemp, override: false, target: dhwSetpoint});
            }
          }
          callback(info);
        });
      }
    });
  }
  
  if (onoff == 'on') {
    info.demand = zones.filter((z) => (z && z.demand && !z.IsMaster))
                  .map((z) => {return {'name':z.Name, 
                                       'temperature': zoneCurrentTemp(z.ID), 
                                       'override': zoneOverrideOn(z.ID),
                                       'target': zoneTargetTemp(z.ID)}
                  });
    if (info.demand.length == 0) info.err = 'No demand';
  } else { // off
    info.demand = zones.filter((z) => (z && z.demand && !z.IsMaster));
    if (info.demand.length > 0) {
      info.err = 'Heating is on';
    } else {
      info.demand = zones.filter((z) => (z && !z.demand && !z.IsMaster 
                                    && (zoneCurrentTemp(z.ID) - zoneTargetTemp(z.ID)) < 1))
                  .map((z) => {return {'name':z.Name, 
                                       'temperature': zoneCurrentTemp(z.ID), 
                                       'override': zoneOverrideOn(z.ID),
                                       'target': zoneTargetTemp(z.ID)}
                  });      
      if (info.demand.length == 0) info.err = 'All rooms above target';
    }
  }
  checkDHW(onoff == 'on');
}

function checkPreset(timeNow, currentTemp, outsideTemp) {
  var info = {dow:0,  prevDow:0,  nextDow:0,  timeNow:0,  dateStr:""};
  var rate = 0;
  var tDiff = 0;
  var timeToChange = 0;
  calcDates(timeNow, info);
  zones.forEach(function (z) { // First check each zone's own demand
    var temperatureTarget = checkNewZoneHeat(z, info.timeNow, info.dateStr, info.dow, info.previousDow);
    if (temperatureTarget.preset) { // Modify targetTemp based on external factors
 
      if (temperatureTarget.next < currentTemp) { 	// ***** Cooling
        tDiff = currentTemp - outsideTemp;
        rate = z.HeatLossRate * tDiff + z.HeatLossConstant; // In degrees/hour
        timeToChange = rate * (temperatureTarget.next - currentTemp);
       } else { 									// ******Warming
        tDiff = currentTemp - outsideTemp;
        rate = z.HeatGainRate * tDiff + z.HeatGainConstant; // In degrees/hour
        timeToChange = rate * (currentTemp - temperatureTarget.next);
      }
      client.publish(`/App/${z.Name}/heating`,
			JSON.stringify({currentTemp:currentTemp, outsideTemp:outsideTemp, rate:rate, timeToChange:timeToChange}));
    }
  });
}

function checkNewZoneHeat(z,  timeNow,  dateStr,  dow,  prevDow, nextDow) {
  var nextProgramme = JSON.parse(JSON.stringify(z.programme.filter((p, dow) => isProgrammeDay)));
  nextProgramme.forEach(p => {p.newStart = new moment(dateStr + ' ' + p.start).add(+1,  "days")});

  var thisProgramme = JSON.parse(JSON.stringify(z.programme.filter((p, dow) => isProgrammeDay)));
  thisProgramme.forEach(p => {p.newStart = new moment(dateStr + ' ' + p.start)});

  var prevProgramme = JSON.parse(JSON.stringify(z.programme.filter((p,  previousDow) => isProgrammeDay)));
  prevProgramme.forEach(p => {p.newStart = new moment(dateStr + ' ' + p.start).add(-1,  "days")});

  var programme = [];
  nextProgramme.forEach(p => programme.push(p));
  thisProgramme.forEach(p => programme.push(p));
  prevProgramme.forEach(p => programme.push(p));
  console.log(JSON.stringify(programme));
  var pIdx = programme.findIndex(p => p.newStart < timeNow);
  var timeLeft = moment.duration(programme[pIdx-1].newStart.diff(timeNow));
  return {next: programme[pIdx-1].temperature, 
          curent: programme[pIdx].temperature, 
          timeLeft: timeLeft/(3600*1000.0),
          preset: programme[pIdx-1].preset};
}

function isProgrammeDay(p, dow) {
  if (p.days == 0) return false; // Not set
  if (p.days == dow) return true; // Specific day
  if (p.days == 8 && (1 == dow || dow == 7)) return true; // Weekend
  if (p.days == 9 && (1 < dow && dow < 7)) return true; // Weekday
  if (p.days == 10) return true; // AnyDay
  return false;
}

function calcDates(t, info) {
  info.timeNow = new moment();
  info.dateStr =  info.timeNow.format("YYYY/MM/DD");
  info.dow = info.timeNow.day()+1;
  try {
    if (t) {
      info.timeNow = new Date(info.dateStr+' '+t);
      info.dow = info.timeNow.getDay()+1;
    } 
  } catch (ex) {
      console.log(ex);
      console.log("Bad date %s", t);
  }
  if ((info.prevDow = info.dow - 1) == 0) info.prevDow = 7;
  if ((info.nextDow = info.dow + 1) == 8) info.nextDow = 1;
}
