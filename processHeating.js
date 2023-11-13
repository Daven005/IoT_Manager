"use strict";
var zones = [];
var overrides = [];

exports.allZones = function() {return zones;}
exports.allOverrides = function() {return overrides;}

exports.load = load;

function load(reason, callback) {
  var sqlstr = "SELECT * FROM heatingzones"
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log(errorStr = err.message); result = [];
    }
    zones = [];
    result.forEach((r) => {
      r.overrideOn = false;
      r.demand = false;
      r.programme = [];
      zones[r.ID] = r; // Save each zone data     
    });
    sqlstr = "SELECT * FROM heatingprogrammes ORDER BY days, start DESC"
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(errorStr = err.message); result = [];
      }
      result.forEach((r) => zones[r.zoneID].programme.push(r));
      sqlstr = "SELECT * FROM heatingoverrides ORDER BY priority DESC"
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(errorStr = err.message); result = [];
        }
        overrides = [];
        result.forEach((r) => overrides.push(r));
        check(reason, undefined, callback);
      });
    });
  });
}

function checkZonesHeat(timeNow, dateStr, dow, previousDow, log) { 
  if (log) {
    console.log(timeNow.format("YYYY/MM/DD HH:mm:ss"));
  }
  zones.forEach(function (z) { // First check each zone's own demand
    checkZoneHeat(z, timeNow, dateStr, dow, previousDow);
  });
  
  zones.forEach(function (z) { // Then check for Master/Slave demands once all individual demands calculated
    if (log) {
      var currentTemperature = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      console.log("%s = %d ---> %d. Sensor %s Override: %s Demand: %s Other: %s", 
        z.Name, currentTemperature, z.targetTemp, z.ControlSensorID, 
        z.overrideOn ? "ON" : "OFF", 
        z.demand ? "ON" : "OFF", // this zone demand
        checkDemand(z) ? "ON" : "OFF" // Other zone demand
        );
    }
    z.demand = checkDemand(z); // Now Update any demand from other zones
    if (z.Enabled) setHeatingOutput(z.ControlDeviceID, z.ControlSensorID, z.demand);
  });

  function checkZoneHeat(z, timeNow, dateStr, dow, previousDow) {    
    var targetTemp = -99;
    var presetIdx = -1;

    if (!z.Enabled) return; // Allow for a (real) zone to have an alternative programme

    // if (log && (z.programme.length > 0)) console.log("P->%j", z.programme);

    // Find first programe for zone (z) that matches time/date and then set targetTemp
    // NB programmes are time descending
    z.programme.some(checkDayTime); 

    if (targetTemp == -99 && previousDow) {// Not found programme so look from midnight last night
        checkZoneHeat(z, new Date(dateStr+" 23:59:00"), dateStr, previousDow);
    } else {
      var currentTemperature = deviceState.getLatestTemperature(z.TemperatureDeviceID, z.TemperatureSensorID);
      var overrideName = null;
      overrides.forEach(checkOverride);
      z.overrideName = overrideName;
      z.demand = (currentTemperature < targetTemp);
      z.targetTemp = targetTemp;
    }
    return;
    
    function checkDayTime(programmeEntry) { // Updates targetTemp if this programmentry applies
      if (isProgrammeDay(programmeEntry, dow)) {
        return checkTime();
      }   
      return false;

      function checkTime() {
        var start = new Date(dateStr + ' ' + programmeEntry.start);       
        if (timeNow >= start) {
          targetTemp = programmeEntry.temperature; // NB may be overwritten by a later programmeEntry
          return true;
        }
        return false;
      }
    }
    
    function checkOverride(o) { // NB this is called with highest priority override first
      if (o.zoneID == z.ID) {
        if (!overrideName) z.overrideID = o.ID; // Make sure lower priority overrides don't change the overrideID
        if (o.active) {
          if (checkOverrideWithinTime()) {
            if (!overrideName) { // Not already found a higher prority override
              targetTemp = o.temperature;
              z.overrideOn = true;
              overrideName = o.Name;
            }
          } else {
            z.overrideOn = false;
            if (!o.dontClear && checkOverrideAfterEnd()) {
              o.active = false;
              clearActive(o.ID); // In case of restart
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
        if (duration >= (24*60)*60*1000) return true; // 00:00 or 23:59
        return (start <= timeNow && timeNow <= (start.getTime()+duration));
      }
      
      function checkOverrideAfterEnd() {
        var start = new Date(dateStr + ' ' + o.start);
        var duration = getDuration();
        if (duration >= (24*60)*60*1000) return true; // 00:00 or 23:59
        return timeNow >= (start.getTime()+duration);
      }
    }
    
    function clearActive(id) {
      var sqlstr = sql.format("UPDATE heatingoverrides SET active = 0 WHERE ID = ?", [id]);
      db.query(sqlstr, function(err) {
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
          demand = true;
        }
      }
    });
    return demand;
  }
}

exports.check = check;

function check(reason, t, callback) {
  var info = {dow:0,  prevDow:0,  nextDow:0,  timeNow:0,  dateStr:""};
  calcDates(t, info);
  checkZonesHeat(info.timeNow, info.dateStr, info.dow, info.previousDow, (typeof t != 'undefined'));
  if (callback) callback();
}

exports.setOutput = setHeatingOutput;

function setHeatingOutput(Device, Sensor, demand) {
    var topic, error ;
    
    if (Sensor >= 20) Sensor -= 20; // Allow for offset Sensor IDs
    if ((Sensor == 4 || Sensor == 7) && demand) {
		error = new Error(`setHeatingOutput ${Sensor}, ${demand}`);
	}
	topic = `/Raw/${Device}/${Sensor}/set/output`;
  if (config.boiler.enabled) {
		client.publish(topic, (demand) ? '1' : '0');
	} else {
		console.log("Heating: %s->%j", topic, demand);
	}
}

exports.test = function(request, response) {
  var obj;
  console.log("Action %s Command: %s", request.query.action, request.query.command);
  switch (request.query.action) {
  case 'devices':
	console.log(deviceState.show());
  case "load":
    load(`test page`,);
    break;
  case "zones":
    console.log("Zones %j", obj = zones);
    break;
  case "overrides":
    var idx;
    console.log("Overrides:");
    for (idx=0; idx<overrides.length; idx++) {
      if (overrides[idx]) {
        console.log("%j", overrides[idx]);
      }
    }
    obj = overrides;
    break;
  default:
    check("test page", request.query.command, null);
  }
  response.render("testHeating", {show: obj});
}

exports.zoneDemand = zoneDemand;
exports.zoneTargetTemp = zoneTargetTemp;
exports.zoneCurrentTemp = zoneCurrentTemp;
exports.zoneOverrideOn = zoneOverrideOn;
exports.zoneOverrideName = zoneOverrideName;

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

function zoneOverrideOn(id) { // Set when ANY override is active for this zone
  return zones[id].overrideOn;
}

function zoneOverrideName(id) { 
  return zones[id].overrideName;
}

exports.zoneInfoByName = function(name, callback) {
  var info = {err: 'OK', zones: []};
  var sqlstr = sql.format('SELECT ID, Name, HeatGainRate FROM HeatingZones WHERE Name LIKE "%?%"', [name]);
  sqlstr = sqlstr.replace(/'/g, "");
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log(`zoneInfoByName: ${err} ${sqlstr}`);
      info.err = `Can't find room called ${name}`;
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
        info.err = `Can't find room called ${name}`;
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
        `WHERE D.name = '${config.boiler.controllerName}' ` +
        'AND S.Name = "TS Top" '+
        'AND T.Time > DATE_SUB(now(), INTERVAL 20 MINUTE) '+
        'ORDER BY T.Value ASC LIMIT 1';
    db.query(sqlstr, function(err, result) {
      var dhwTemp;
      if (err) {
        console.log(`${err} No temperatureLog for 'TS Top'`);
        dhwTemp = 0;
      } else {
        dhwTemp = result[0].Value;
        var dhwSetpoint = 60.0;
        sqlstr = 'SELECT T.Value, T.time from devices AS D '+
          'INNER JOIN sensors AS S ON D.deviceID = S.DeviceID '+
          'INNER JOIN temperaturelog AS T on T.deviceID = D.deviceID AND T.SensorID = S.SensorID '+
          `WHERE D.name = '${config.boiler.controllerName}' `+
          'AND S.Name = "DHW setpoint" '+
          'AND T.Time > DATE_SUB(now(), INTERVAL 1 MINUTE) '+
          'ORDER BY T.Time DESC LIMIT 1';
        db.query(sqlstr, function(err, result) {
          if (err) {
            console.log(`${err} No temperatureLog for 'DHW setpoint'`);
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
                                    && (zoneCurrentTemp(z.ID) - zoneTargetTemp(z.ID)) < 0))
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

function checkPreset(timeNow, currentTemp, outsideTemp) { // Scheme to preset heating so it come to temperature by the start of the time period
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
  info.timeNow = new moment(); // IE now
  info.dateStr =  info.timeNow.format("YYYY/MM/DD");
  info.dow = info.timeNow.day()+1;
  try {
    if (t) {
      info.timeNow = new moment(info.dateStr+' '+t, 'YYYY/MM/DD HH:mm');
      info.dow = info.timeNow.day()+1;
    } 
  } catch (ex) {
      console.log(`${ex.message} Bad date ${t}`);
  }
  if ((info.prevDow = info.dow - 1) == 0) info.prevDow = 7;
  if ((info.nextDow = info.dow + 1) == 8) info.nextDow = 1;
}
