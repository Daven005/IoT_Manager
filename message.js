var weather = require('./weather');
var time = require('./time');
var heating = require('./heating');
var woodburner = require('./woodburner');
var pond = require('./pond');
var watering = require('./watering');
var tlc = require('./tlc');

function processValues(values) {
  try {
    if (values.deviceName == config.gate.controllerName) {
      global.wifiGate.sendAlert(values.sensorName, values.state, values.deviceName);
    } else if (values.deviceName == config.pond.controllerName) {
      pond.update(values.deviceName, values.sensorName, values.state, values.sensorID-20); // Note offset
    } else if (values.deviceName == config.watering.controllerName) {
      watering.update(values.sensorName, values.state, values.sensorID-20); // Note offset
    } else if ( values.deviceName == config.woodburner.WBtopDevice &&
				values.location == config.woodburner.WBtopLocation) {		
		if (values.temperature) {
			woodburner.checkWB_Top(values.sensorName, values.temperature);
		}
    } else if ( values.deviceName == config.woodburner.TSbottomDevice &&
				values.location == config.woodburner.TSbottomLocation) {		
		if (values.temperature && values.sensorName) {
			woodburner.checkTS_Bottom(values.sensorName, values.temperature);
		}
    }
  } catch(ex) {
    console.log("Error in processValues ex='%s' values = %j", ex.message, values);
  }
}

function processSetMessage(topicParts, payload) { // /App/Set/Device Name/SettingID value
  var deviceID = deviceState.findDeviceID(topicParts[3]);
  if (deviceID == undefined) return;
  try {
    var setting = parseInt(payload);
    if (40 < setting && setting <= 70) {
      var topic = '/Raw/'+deviceID+'/0/set/setting';
      // console.log("%s=>%s", topic, setting);
      client.publish(topic, setting.toString(), {retain: true});
      // NB New info msg will be published which updates settings
    } else {
      console.log("/App/Set value (%d) out of range", setting);
    }
  } catch (ex) {
    console.log("Bad /App/Set value %j (%j)", payload, ex);
  }
}

function processAppMessage(topicParts, payload) {
  var values = {};
  values.location = topicParts[2];
  values.deviceName = topicParts[3];
  values.sensorName = topicParts[4];
  values.type = topicParts[5];
  values.sensorID = topicParts[6];
  try {
    switch (values.type) {
    case 'Temp':
      values.temperature = parseFloat(payload);
      break;
    case 'Input':
    case 'Output':
      values.state = (payload == 1);
      break;
    default:
      values.value = payload;
    }
  } catch(ex) {
    console.log("Error in processAppMessage %j, payload %j", values, payload);
  }
  processValues(values);
}

function saveDeviceSettings(DeviceID, settings) {
  var idx;
  var sqlstr =  'INSERT INTO setValues (DeviceID, ID, Value) VALUES';
  for (idx=0; idx < settings.length; idx++) {
    if (idx != 0) {
      sqlstr += ', ';
    }
    sqlstr += '("'+DeviceID+'", '+idx+', ' + settings[idx]+')';
  }
  sqlstr += ' ON DUPLICATE KEY UPDATE Value=VALUES(Value)';
  db.query(sqlstr, function(err, result) {
    if (err) {console.log("saveDeviceSettings: %j", err);}
  });
}

function saveDeviceInfo(values) {
  var r;
  var sqlstr =  sql.format(
    "INSERT INTO Devices (DeviceID, Location, Name) VALUES(?, ?, ?) "+
    "ON DUPLICATE KEY UPDATE Location=VALUES(Location), Name=VALUES(Name)",
     [values.DeviceID, values.Location, values.Name]);
  // console.log(sqlstr);
  db.query(sqlstr,  function(err, result) {
    if (err) {
      console.log("saveDeviceInfo error: %j, sql = %s", err, sqlstr);
    }
    if (values.Settings) {
      saveDeviceSettings(values.DeviceID, values.Settings);
    }
    if (values.RSSI) {
      r = validateValue(values.RSSI, "RSSI");
      if (r.result == "numberInRange") {
        insertSensorLog(values.DeviceID, "RSSI", "RSSI", values.RSSI);
      } else {
        console.log(r.error+" from %s-%s", values.Location, values.Name);
      }
      deviceState.setRSSI(values.DeviceID, values.RSSI);
    }
    if (values.Vcc) {
      r = validateValue(values.Vcc, "Vcc")
      if (r.result == "numberInRange") {
        var vcc = values.Vcc/241; // Convert to voltage
        insertSensorLog(values.DeviceID, "Vcc", "Vcc", vcc);
      } else {
        console.log(r.error+" from %s-%s", values.Location, values.Name);
      }
    }
    if (values.Attempts) {
      r = validateValue(values.Attempts, "Attempts")
      if (r.result == "numberInRange") {
        insertSensorLog(values.DeviceID, "Attempts", "Attempts", values.Attempts);
        deviceState.setAttempts(values.DeviceID, values.Attempts);
      } else {
        if (values.Attempts != deviceState.getAttempts(values.DeviceID)) {
          deviceState.setAttempts(values.DeviceID, values.Attempts);
          console.log(r.error+" from %s-%s", values.Location, values.Name);
        }
      }
    }
    if (values.ConnectTime) {
      r = validateValue(values.ConnectTime, "ConnectTime")
      if (r.result == "numberInRange") {
        insertSensorLog(values.DeviceID, "ConnectTime", "ConnectTime", values.ConnectTime);
        deviceState.setAttempts(values.DeviceID, values.ConnectTime);
      } else {
        if (values.ConnectTime != deviceState.getAttempts(values.DeviceID)) {
          deviceState.setAttempts(values.DeviceID, values.ConnectTime);
          console.log(r.error+" from %s-%s", values.Location, values.Name);
        }
      }
    }
    if (values.Version) {
      deviceState.setVersion(values.DeviceID, values.Version);
    }
    if (values.Name) {
      deviceState.setName(values.DeviceID, values.Name);
    }
    if (values.Location) {
      deviceState.setLocation(values.DeviceID, values.Location);
    }
    if (values.IPaddress) {
      deviceState.setIPaddress(values.DeviceID, values.IPaddress);
    }
    if (values.Channel) {
      deviceState.setChannel(values.DeviceID, values.Channel);
    }
    if (values.AP) {
      deviceState.setAP(values.DeviceID, values.AP);
    }
  });
}

function processDeviceErrorMessage(values) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [values.DeviceID]);
  var lastError;
  db.query(sqlstr, function(err, result){
    if (err) {
      console.log("processDeviceErrorMessage %j", err);
      if (errorLog.set(values.error, values.info, values.deviceID, 'system')) { // true if new error
        lastError = errorLog.getLast();
        utils.notify('Error: ('+values.deviceID+') err: '+lastError.error+' info: '+lastError.info, "Error", values.deviceID);
      }
    } else {
      try {
        if (errorLog.set(values.error, values.info, result[0].Name, result[0].Location)) { // true if new error
          lastError = errorLog.getLast();
          utils.notify(`Error: (${deviceName}) err: ${lastError.error} info: ${lastError.info}`, "Error", deviceName);
        }
      } catch(ex) {
        console.log("dev err: %j, values %j", result[0], values);
      }
    }
  });
}

function processDeviceAlarmMessage(values) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [values.DeviceID]);
  var lastAlarm;
  db.query(sqlstr, function(err, result){
    if (err) {
      console.log("processDeviceAlarmMessage %j", err);
      if (alarmLog.set(values.alarm, values.info, values.deviceID)) { // true if new alarm
        lastAlarm = alarmLog.getLast();
        utils.notify('Alarm: ('+values.deviceID+') alm: '+lastAlarm.alarm+' info: '+lastAlarm.info, "Alarm", values.deviceID, lastAlarm.alarm);
      }
    } else {
       var deviceName = result[0].Name+'-'+result[0].Location;
       if (alarmLog.set(values.alarm, values.info, deviceName)) { // true if new alarm
          lastAlarm = alarmLog.getLast();
          utils.notify('Alarm: ('+deviceName+') err: '+lastAlarm.alarm+' info: '+lastAlarm.info, "Alarm", deviceName, lastAlarm.alarm);
       }
    }
  });
}

function processDeviceOffline(deviceID) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [deviceID]);
  var query = db.query(sqlstr, function(err, result){
	if (err) {
	  console.log("processDeviceOffline SQL error: %j", err);
	  console.log('When '+deviceID+' reported Offline');
	} else {
	  if (result[0]) {
		utils.notify('Device Offline: '+result[0].Name+'-'+result[0].Location+')', "Info");
	  } else {
		utils.notify(`Unknown Device Offline: ${deviceID}`, "Info");
	  }
	}
});
}

function printMap(deviceID, map) {
  var idx;
  console.log("Mapping for [%s] %j:", deviceID, map);
  for (idx=0; idx<map.length; idx++) {
    console.log("%d->%d [%s - %s]", idx, map[idx].map, map[idx].name, map[idx].sensorID);
  }
}

function checkSensor(result, map) { // result is db's sensor info, map is device's mapping report
  var idx;
  for (idx = 0; idx < map.length; idx++) {
    if (result.SensorID == map[idx].sensorID) {
      if (result.Mapping == idx && result.Name == map[idx].name) return; //OK
      console.log("Bad map: %s/%s [%d]->%d {(db sensor name)%s->(dev sensor name)%s}", 
        result.DeviceID, map[idx].sensorID, idx, map[idx].map, result.Name, map[idx].name);
      return;
    }
  }
  console.log("Device %s has no mapping for sensor %s", result.DeviceID, result.SensorID);
  console.log("Received map: %j", map);
}

function checkMap(deviceID, map) {
  var sqlstr = "SELECT * FROM sensors WHERE deviceID = ? AND mapping IS NOT NULL";
  sqlstr = sql.format(sqlstr, deviceID);
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log("checkMap %j", err);
      console.log(sqlstr);
      errorStr = err.message;
      result = [];
    } else {
      var idx;
      for (idx=0; idx < result.length; idx++) {
        checkSensor(result[idx], map); 
      }
    }

  });
}

exports.setDevice = function(id, info) {
  //console.log("%s = %j", id, info);
  info.DeviceID = id;
  saveDeviceInfo(info);
  deviceState.set(id, true); // This sets uip the TLcs as devices. 
  // They may not have any temperature sensors (which would flag them as being online) so set them online anyway
}

function processRawDeviceMessage(topicParts, payload) {
  try { //because of JSON.parse
    if (topicParts[3] == "offline") { // LWT from Broker
		// NB can't parse payload as not JSON
		deviceState.set(topicParts[3], false);
		processDeviceOffline(topicParts[3]);
    } else {
		var values = JSON.parse(payload);
		values.DeviceID = topicParts[2];
		if (topicParts[3] == "info") {
		  saveDeviceInfo(values);
		} else if (topicParts[3] == "error") {
		   processDeviceErrorMessage(values);
		} else if (topicParts[3] == "alarm") {
		  processDeviceAlarmMessage(values);
		} else if (topicParts[3] == "reset") {
		  if (typeof values.Version != 'undefined') {
			deviceState.setVersion(values.DeviceID, values.Version);
		  }
		  processDeviceResetMessage(values);
		} else  if (topicParts[3] == "mapping") { 
		  checkMap(values.DeviceID, JSON.parse(payload));
		  deviceState.set(values.DeviceID, true);
		  //printMap(topicParts[2], JSON.parse(payload));
		}
	}
  } catch (ex) {
    console.log("processRawDeviceMessage error: %j, topic %j, payload %s", ex.message, topicParts, payload);
  }
}

function validateValue(value, type) {
  var return_b = false;
  switch(type) {
  case 'Temp':
  case 'Temperature':
    return_b = (-10 <= value && value <= 130);
    break;
  case 'Input':
  case 'Output':
    return_b = (value == 0 || value == 1);
    break;
  case 'PIR':
    return_b = (value == 0 || value == 1);
    if (return_b)
      return {result: "flag", value: value};
    break;
  case 'PIR LIGHT ON':
  case 'PIR FAN ON':
    return_b = (value == 0 || value == 1);
    break;
  case "Hum":
    return_b = (0 <= value && value <= 100);
    break;
  case "Level":
    return_b = (0 <= value && value <= 1024);
    break;
  case "Speed":
    return_b = (0 <= value && value <= 100);
    break;
  case "Pressure":
    return_b = (0 <= value && value <= 1024);
    break;
  case "Fan":
  case "Pump":
    return_b = (-1 <= value && value <= 5000);
    break;
  case "RSSI":
    return_b = ((value == 31) || (0 > value && value >= -100));
    break;
  case "ConnectTime":
    return_b = (0 <= value && value <= 10000);
    break;
  case "Attempts":
    return_b = (0 <= value && value <= 250);
    break;
  case "Vcc":
    return_b = (0 <= value && value <= 1024);
    break;
  case "FlowMax":
    return_b = (0 <= value && value <= 200000);
    break;
  case "Flow":
  case "FlowTimes":
    return_b = (0 <= value && value <= 5000);
    break;
  case "Energy":
  case "Power":
    return_b = (-130000 <= value && value <= 130000);
    break;
  case "Voltage":
    return_b = (-400 <= value && value <= 400)
    break;
  case "Message":
    return {result: "string"};
  }
  if (return_b) {
    return {result: "numberInRange"};
  } else {
    return {result: "numberOutOfRange", error: 'Bad value ('+value+') for '+type};
  }
}

function publishAppInfo(DeviceID, SensorID, Value) {
  db.query('SELECT Location, Devices.Name AS DeviceName, Sensors.Name AS SensorName, Type '+
    'FROM Devices INNER JOIN Sensors ON Devices.DeviceID = Sensors.DeviceID WHERE Devices.DeviceID = ? AND SensorID = ?',
    [DeviceID, SensorID],  function(err, result) {
      if (err) {
        console.log('Select Location err: '+err);
      } else {// Closure!!
        try {
          var topic = '/App/'+result[0].Location+'/'+result[0].DeviceName+'/'+result[0].SensorName+'/'+result[0].Type+'/'+SensorID;
          client.publish(topic, Value.toString());
          return result[0].SensorName;
        } catch (ex) {
          console.log("Raw sensor error %s (DeviceID %s, SensorID %s, Value %j", ex.message, DeviceID, SensorID, Value);
        }
      }
   });
   // Allow it to return 'undefined' in error cases
}

function insertSensorLog(DeviceID, SensorID, Type, value, time) {
  db.query(updateSensorSQLstring(DeviceID, SensorID, Type), function(err, result) {
      if (err) {
        console.log('Insert Sensors table err: '+err);
      } else {
        if (time) {
          var sqlstr = sql.format('INSERT INTO TemperatureLog (time, DeviceID, SensorID, Value) '+
            'VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Value=VALUES(Value)', 
            [moment(time*1000).format("YYYY-MM-DD HH:mm:ss"), DeviceID, SensorID, value]);
          var query = db.query(sqlstr, function(err, result) {
              if (err) {
                console.log('Insert Log table err: '+err+' [%s]', sqlstr);
              } else {
                // console.log(sqlstr);
              }
          });
        } else {
          var sqlstr = sql.format('INSERT INTO TemperatureLog (DeviceID, SensorID, Value) '+
            'VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Value=VALUES(Value)', 
            [DeviceID, SensorID, value]);
          var query = db.query(sqlstr, function(err, result) {
              if (err) {
                console.log('Insert Log table err: '+err+' [%s]', sqlstr);
              }
          });
        }
      }
  });
}

function updateSensorSQLstring(DeviceID, SensorID, Type) {
  return sql.format('INSERT INTO Sensors (DeviceID, SensorID, Type) '+
    'VALUES(?, ?, ? ) ON DUPLICATE KEY UPDATE Type=VALUES(Type)', 
    [DeviceID, SensorID, Type]);
}

function processSensorValues(values, val) {
    var r = validateValue(val, values.Type);
    switch (r.result) {
    case "numberOutOfRange":
      console.log(r.error+' for %j', values);
      return;
    case "string":
      db.query(updateSensorSQLstring(values.DeviceID, values.SensorID, values.Type), function(err, result) {
        if (err) {
          console.log('Insert Sensors table err: %j, values=%j', err, values);
        }
        deviceState.set(values.DeviceID, true); // Record device is online
      });
      return; // Don't put message in log
    default: break;
    }
    deviceState.set(values.DeviceID, true); // Record device is online
    publishAppInfo(values.DeviceID, values.SensorID, values.Value);
    switch (r.result) {
    case "flag": // e.g. PIR ON
      break;
    case "numberInRange":
      switch (values.Type) {
      case "Temp":
        deviceState.setLatestTemperature(values.DeviceID, values.SensorID, val);
        break;
      case "Input":
        deviceState.setLatestInput(values.DeviceID, values.SensorID, val);
        break;
      case "Output":
        deviceState.setLatestOutput(values.DeviceID, values.SensorID, val);
        break;
      }
      insertSensorLog(values.DeviceID, values.SensorID, values.Type, val);
      break;
    }
}

exports.setSensor = function(DeviceID, SensorID, info) {
  var val = parseFloat(info.Value);
  info.DeviceID = DeviceID;
  info.SensorID = SensorID;
  //console.log('%s:%s = %j', DeviceID, SensorID, info);
  processSensorValues(info, val); 
}

function processRawSensorMessage(topicParts, payload) {
  try {
    var values = JSON.parse(payload);
    var val = parseFloat(values.Value);
    values.DeviceID = topicParts[2];
    values.SensorID = topicParts[3];
    processSensorValues(values, val); 
  } catch(ex) {
    console.log("processRawSensorMessage error: %j. Topic %j, Payload %j", ex.message, topicParts, payload);
  }
}

function processBulkData(topicParts, payload) {
  function insert(id, type) {
    insertSensorLog(topicParts[2], id, type, values[id], values.time);
  }
  
  var values = JSON.parse(payload);
  deviceState.set(topicParts[2], true);
  
  // NOTE will want to allow for other types of bulkData other than wind (eg topicParts[3])
  
  insert("avgWind", 'Speed');
  insert("minWind", 'Speed');
  insert("maxWind", 'Speed');
  insert("cutinWind", 'Speed');
}

function processDeviceResetMessage(values) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [values.DeviceID]);
  var query = db.query(sqlstr, function(err, result) {
    if (err) {
      console.log("processDeviceResetMessage %j", err);
      utils.notify('Reset: ('+values.deviceID+') reason: '+values.Reason+' last action: '+values.LastAction+
        ' Version: '+values.Version, "Alarm");
    } else {
      try {
        var resetType = [ 'Power ON', 'HW WDT', 'Exception', 'SW WDT', 'Soft restart', 'Wake Up', 'External' ];
        var deviceName = result[0].Name+'-'+result[0].Location;
        if (values.Reason != 5) { // Wake Up
          alarmLog.set(1000, values.Reason, deviceName);
          utils.notify('Reset: ('+deviceName+') reason: '+values.Reason+' {'+resetType[Number(values.Reason)]+') last action: '+values.LastAction+
            ' Version: '+values.Version, "Alarm", deviceName, resetType[Number(values.Reason)]);
        }
        time.publish();
        weather.publish();
      } catch (ex) {
        console.log("Reset problem %j values %j result %j", ex.message, values, result);
      }
    }
  });
}

function decodeMessage(topic, payload) {
  try {
    var topicParts = topic.toString().split("/");
    if (topicParts[1] == 'App') {
      switch (topicParts[2]) {
      case 'Set':
        processSetMessage(topicParts, payload);
        break;
      default:
        if (topicParts[3] == 'MHRV') {
          tlc.decodeMHRV(topic, payload);
        }
        processAppMessage(topicParts, payload);
      }
    } else if (topicParts[1] == 'Raw') {
      if (topicParts[3] == 'info' || topicParts[3] == 'error' || topicParts[3] == 'alarm' 
        || topicParts[3] == 'reset' || topicParts[3] == 'offline' || topicParts[3] == 'mapping') { // Device Info
        processRawDeviceMessage(topicParts, payload);
      } else if (topicParts[3] == 'Override' && topicParts[4] == 'info') { // Override Info (NB before Sensor Info!!
        heating.setOverride(topicParts[2], payload);
      } else if (topicParts[4] == 'info') { // Sensor Info
        processRawSensorMessage(topicParts, payload);
      } else if (topicParts[3] == 'bulkData') { // Sensor Info
        processBulkData(topicParts, payload);
      } else if (topicParts[3] == 'message' 
        || topicParts[3] == 'clear' || topicParts[4] == 'clear'
        || topicParts[3] == 'set'   || topicParts[4] == 'set') {
      // ignore
      } else {
        console.log('Bad Topic: '+topic.toString());
      }
    } else {
      console.log('Unknown Topic: '+topic.toString());
    }
  } catch (ex) {
    console.log('Decode Message error: %j topic: %j payload: %j', ex.message, topic, payload);
  }
}
exports.decode = decodeMessage;
