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
      pond.update(values.deviceName, values.sensorName, values.state, values.sensorID - 20); // Note offset
    } else if (values.deviceName == config.watering.controllerName) {
      watering.update(values.sensorName, values.state, values.sensorID - 20); // Note offset
    } else if (values.deviceName == config.woodburner.WBtopDevice &&
      values.location == config.woodburner.WBtopLocation) {
      if (values.temperature) {
        woodburner.checkWB_Top(values.sensorName, values.temperature);
      }
    } else if (values.deviceName == config.woodburner.TSbottomDevice &&
      values.location == config.woodburner.TSbottomLocation) {
      if (values.temperature && values.sensorName) {
        woodburner.checkTS_Bottom(values.sensorName, values.temperature);
      }
    }
  } catch (ex) {
    console.error("Error in processValues ex='%s' values = %j", ex.message, values);
  }
}

function processSetMessage(topicParts, payload) { // /App/Set/Device Name/SettingID value
  var deviceID = deviceState.findDeviceID(topicParts[3]);
  if (deviceID == undefined) return;
  try {
    var setting = parseInt(payload);
    if (40 < setting && setting <= 70) {
      var topic = '/Raw/' + deviceID + '/0/set/setting';
      // console.log("%s=>%s", topic, setting);
      client.publish(topic, setting.toString(), { retain: true });
      // NB New info msg will be published which updates settings
    } else {
      console.error("/App/Set value (%d) out of range", setting);
    }
  } catch (ex) {
    console.error("Bad /App/Set value %j (%j)", payload, ex);
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
  } catch (ex) {
    console.error("Error in processAppMessage %j, payload %j", values, payload);
  }
  processValues(values);
}

function saveDeviceSettings(DeviceID, settings) {
  var idx;
  var sqlstr = 'INSERT INTO setValues (DeviceID, ID, Value) VALUES';
  for (idx = 0; idx < settings.length; idx++) {
    if (idx != 0) {
      sqlstr += ', ';
    }
    sqlstr += '("' + DeviceID + '", ' + idx + ', ' + settings[idx] + ')';
  }
  sqlstr += ' ON DUPLICATE KEY UPDATE Value=VALUES(Value)';
  // console.log(`saveDeviceSettings: ${sqlstr}`);
  db.query(sqlstr, function (err, result) {
    if (err) { console.error("saveDeviceSettings: %j", err); }
  });
}

function saveDeviceSettingsNames(DeviceID, settingsNames) {
  var idx;
  var sqlstr = 'INSERT INTO setValues (DeviceID, ID, Name) VALUES';
  for (idx = 0; idx < settingsNames.length; idx++) {
    if (idx != 0) {
      sqlstr += ', ';
    }
    sqlstr += `("${DeviceID}", ${idx}, "${settingsNames[idx]}")`;
  }
  sqlstr += ' ON DUPLICATE KEY UPDATE Name=VALUES(Name)';
  // console.log(`saveDeviceSettingsNames: ${sqlstr}`);
  db.query(sqlstr, function (err, result) {
    if (err) { console.error("saveDeviceSettingsNames: %j", err); }
  });
}

function saveDeviceInfo(values) {
  var r;
  var sqlstr = sql.format(
    "INSERT INTO Devices (DeviceID, Location, Name) VALUES(?, ?, ?) " +
    "ON DUPLICATE KEY UPDATE Location=VALUES(Location), Name=VALUES(Name)",
    [values.DeviceID, values.Location, values.Name]);
  // console.error(`saveDeviceInfo: ${JSON.stringify(values)}`);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error("saveDeviceInfo error: %j, sql = %s", err, sqlstr);
    }
    if (values.Settings) {
      saveDeviceSettings(values.DeviceID, values.Settings);
    }
    if (values.SettingsNames) {
      saveDeviceSettingsNames(values.DeviceID, values.SettingsNames);
    }
    if (values.RSSI) {
      r = validateValue(values.RSSI, "RSSI");
      if (r.result == "numberInRange") {
        checkInsertSensorLog(values.DeviceID, "RSSI", "RSSI", values.RSSI);
      } else {
        console.error(r.error + " from %s-%s", values.Location, values.Name);
      }
      deviceState.setRSSI(values.DeviceID, values.RSSI);
    }
    if (values.Vcc) {
      r = validateValue(values.Vcc, "Vcc")
      if (r.result == "numberInRange") {
        var vcc = values.Vcc / 241; // Convert to voltage
        checkInsertSensorLog(values.DeviceID, "Vcc", "Vcc", vcc);
      } else {
        console.error(r.error + " from %s-%s", values.Location, values.Name);
      }
    }
    if (values.Attempts) {
      r = validateValue(values.Attempts, "Attempts")
      if (r.result == "numberInRange") {
        checkInsertSensorLog(values.DeviceID, "Attempts", "Attempts", values.Attempts);
        deviceState.setAttempts(values.DeviceID, values.Attempts);
      } else {
        if (values.Attempts != deviceState.getAttempts(values.DeviceID)) {
          deviceState.setAttempts(values.DeviceID, values.Attempts);
          console.error(r.error + " from %s-%s", values.Location, values.Name);
        }
      }
    }
    if (values.ConnectTime) {
      r = validateValue(values.ConnectTime, "ConnectTime")
      if (r.result == "numberInRange") {
        checkInsertSensorLog(values.DeviceID, "ConnectTime", "ConnectTime", values.ConnectTime);
        deviceState.setAttempts(values.DeviceID, values.ConnectTime);
      } else {
        if (values.ConnectTime != deviceState.getAttempts(values.DeviceID)) {
          deviceState.setAttempts(values.DeviceID, values.ConnectTime);
          console.error(r.error + " from %s-%s", values.Location, values.Name);
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
    if (values.online && values.online == 'Always') {
      deviceState.setAlwaysOnline(values.DeviceID);
    }
  });
}

function processDeviceErrorMessage(values) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [values.DeviceID]);
  var lastError;
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error(`processDeviceErrorMessage ${err}`);
      if (errorLog.set(values.error, values.info, values.deviceID, 'system')) { // true if new error
        lastError = errorLog.getLast();
        utils.notify(`Error: (${values.deviceID}) err: ${lastError.error} info: ${lastError.info}`, "Error", values.deviceID);
      }
    } else {
      try {
        if (errorLog.set(values.error, values.info, result[0].Name, result[0].Location)) { // true if new error
          lastError = errorLog.getLast();
          utils.notify(`Error: (${deviceName}) err: ${lastError.error} info: ${lastError.info}`, "Error", deviceName);
        }
      } catch (ex) {
        console.error("dev err: %j, values %j", result[0], values);
      }
    }
  });
}

function processDeviceAlarmMessage(values) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [values.DeviceID]);
  var lastAlarm;
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error(`processDeviceAlarmMessage ${err}`);
      if (alarmLog.set(values.alarm, values.info, values.deviceID)) { // true if new alarm
        lastAlarm = alarmLog.getLast();
        utils.notify(`Alarm: (${values.deviceID}) alm: ${lastAlarm.alarm} info: ${lastAlarm.info}`, "Alarm", values.deviceID, lastAlarm.alarm);
      }
    } else {
      if (alarmLog.set(values.alarm, values.info, result[0].Name, result[0].Location)) { // true if new alarm
        lastAlarm = alarmLog.getLast();
        utils.notify(`Alarm: (${result[0].Name}-${result[0].Location} err: ${lastAlarm.alarm}info: ${lastAlarm.info}`, "Alarm", result[0].Name, lastAlarm.alarm);
      }
    }
  });
}

function processDeviceOffline(deviceID) {
  var sqlstr = sql.format("SELECT Location, Name FROM devices WHERE DeviceID = ?", [deviceID]);
  var query = db.query(sqlstr, function (err, result) {
    if (err) {
      console.error("processDeviceOffline SQL error: %j", err);
      console.error('When ' + deviceID + ' reported Offline');
    } else {
      if (result[0]) {
        utils.notify('Device Offline: ' + result[0].Name + '-' + result[0].Location + ')', "Info");
      } else {
        utils.notify(`Unknown Device Offline: ${deviceID}`, "Info");
      }
    }
  });
}

function printMap(deviceID, map) {
  var idx;
  console.log("Mapping for [%s] %j:", deviceID, map);
  for (idx = 0; idx < map.length; idx++) {
    console.log("%d->%d [%s - %s]", idx, map[idx].map, map[idx].name, map[idx].sensorID);
  }
}

function checkSensor(result, map) { // result is db's sensor info, map is device's mapping report
  var idx;
  for (idx = 0; idx < map.length; idx++) {
    if (result.SensorID == map[idx].sensorID) {
      if (result.Mapping == idx && result.Name == map[idx].name) return; //OK
      console.error("Bad map: %s/%s [%d]->%d {(db sensor name)%s->(dev sensor name)%s}",
        result.DeviceID, map[idx].sensorID, idx, map[idx].map, result.Name, map[idx].name);
      return;
    }
  }
  console.error("Device %s has no mapping for sensor %s", result.DeviceID, result.SensorID);
  console.error("Received map: %j", map);
}

function checkMap(deviceID, map) {
  var sqlstr = "SELECT * FROM sensors WHERE deviceID = ? AND mapping IS NOT NULL";
  sqlstr = sql.format(sqlstr, deviceID);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error("checkMap %j", err);
      console.error(sqlstr);
      errorStr = err.message;
      result = [];
    } else {
      var idx;
      for (idx = 0; idx < result.length; idx++) {
        checkSensor(result[idx], map);
      }
    }

  });
}

exports.setDevice = function (id, info) {
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
      deviceState.set(topicParts[2], false);
      processDeviceOffline(topicParts[2]);
    } else {
      var values = JSON.parse(payload);
      values.DeviceID = topicParts[2];
      if (topicParts[3] == "info") {
        // Note these MQTT msgs are retained so devices may appear to be available when not
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
      } else if (topicParts[3] == "mapping") {
        checkMap(values.DeviceID, JSON.parse(payload));
        deviceState.set(values.DeviceID, true);
        //printMap(topicParts[2], JSON.parse(payload));
      }
    }
  } catch (ex) {
    console.error(`processRawDeviceMessage error: ${ex.message}, topic ${topicParts}, payload ${payload}`);
  }
}

function validateValue(value, type) {
  var return_b = false;
  switch (type) {
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
        return { result: "flag", value: value }; // Will not be logged
      break;
    case 'PIR LIGHT ON':
    case 'PIR FAN ON':
      return_b = (value == 0 || value == 1);
      break;
    case "AirQual":
      return_b = (0 <= value && value <= 800);
      break;
    case "CO2":
      return_b = (0 <= value && value <= 5000);
      break;
    case "TVOC":
      return_b = (0 <= value && value <= 10);
      break;
    case "HCHO":
      return_b = (0 <= value && value <= 5);
      break;
    case "Hum":
      return_b = (0 <= value && value <= 100);
      break;
    case "Level":
      return_b = (0 <= value && value <= 1024);
      break;
    case "Light":
      return_b = (0 <= value && value <= 3000);
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
      return { result: "string" };
  }
  if (return_b) {
    return { result: "numberInRange" };
  } else {
    return { result: "numberOutOfRange", error: 'Bad value (' + value + ') for ' + JSON.stringify(type) };
  }
}

function publishAppInfo(DeviceID, SensorID, Value) {
  let sqlstr = sql.format('SELECT Location, Devices.Name AS DeviceName, Sensors.Name AS SensorName, Type ' +
    'FROM Devices INNER JOIN Sensors ON Devices.DeviceID = Sensors.DeviceID WHERE Devices.DeviceID = ? AND SensorID = ?',
    [DeviceID, SensorID]);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error('Select Location err: ' + err);
    } else {// Closure!!
      try {
        var topic = '/App/' + result[0].Location + '/' + result[0].DeviceName + '/' + result[0].SensorName + '/' + result[0].Type + '/' + SensorID;
        client.publish(topic, Value.toString());
        return result[0].SensorName;
      } catch (ex) {
        console.error(`Raw sensor error ${ex.message} ${DeviceID}, ${SensorID}, Value ${Value}`);
      }
    }
  });
  // Allow it to return 'undefined' in error cases
}

function checkTempChangeWarning(deviceId, sensorId, delta) {
  let sqlstr = sql.format('SELECT Location, Devices.Name AS DeviceName, Sensors.Name AS SensorName, WarnRate ' +
    'FROM Devices INNER JOIN Sensors ON Devices.DeviceID = Sensors.DeviceID WHERE Devices.DeviceID = ? AND SensorID = ?',
    [deviceId, sensorId]);
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.error(`Select WarnRate err: ${err}`);
    } else {
      if (result[0].WarnRate < 0.0) {
        if (delta < result[0].WarnRate) {
          utils.notify(`Temperature drop ${delta}`, `Message`,
            `${result[0].Location}-${result[0].DeviceName}`);
        }
      }
    }
  });
}

function insertSensorLogTime(DeviceID, SensorID, value, time) {
  var sqlstr = sql.format('INSERT INTO TemperatureLog (time, DeviceID, SensorID, Value) ' +
    'VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Value=VALUES(Value)',
    [moment(time * 1000).format("YYYY-MM-DD HH:mm:ss"), DeviceID, SensorID, value]);
  db.query(sqlstr, function (err) {
    if (err) {
      console.error(`Insert Log table (time) err: ${err} - ${sqlstr}`);
    }
  });
}

function insertSensorLog(DeviceID, SensorID, value, time) {
  if (arguments.length == 3 || time === undefined) {
    var sqlstr = sql.format('INSERT INTO TemperatureLog (DeviceID, SensorID, Value) ' +
      'VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Value=VALUES(Value)',
      [DeviceID, SensorID, value]);
    db.query(sqlstr, function (err) {
      if (err) {
        console.error(`Insert Log table err: ${err} - ${sqlstr}`);
      }
    });
  } else if (arguments.length == 4 && time != undefined) {
    insertSensorLogTime(DeviceID, SensorID, value, time);
  } else {
    console.error('Bad parameters to insertSensorLog: ', arguments.length, time);
  }
}

function checkInsertSensorLog(DeviceID, SensorID, Type, value, time) {
  db.query(updateSensorSQLstring(DeviceID, SensorID, Type), function (err) {
    if (err) {
      console.error(`Insert Sensors table err: ${err}`);
    } else {
      if (time) {
        insertSensorLogTime(DeviceID, SensorID, value, time);
      } else {
        insertSensorLog(DeviceID, SensorID, value);
      }
    }
  });
}

function updateSensorSQLstring(DeviceID, SensorID, Type) {
  return sql.format('INSERT INTO Sensors (DeviceID, SensorID, Type) ' +
    'VALUES(?, ?, ? ) ON DUPLICATE KEY UPDATE Type=VALUES(Type)',
    [DeviceID, SensorID, Type]);
}

function processSensorValues(values, val) {
  function updateSensorInfo(cb) {
    db.query(updateSensorSQLstring(values.DeviceID, values.SensorID, values.Type), (err) => {
      if (err) {
        console.error(`Insert Sensors table err: ${err}, values=${values}`);
      } else {
        deviceState.set(values.DeviceID, true); // Record device is online
        if (cb) cb();
      }
    });
  }

  var r = validateValue(val, values.Type);
  switch (r.result) {
    case "numberOutOfRange":
      console.error(`${r.error} for ${JSON.stringify(values)}`);
      break;
    case "flag": // No logging
      updateSensorInfo(() => {
        publishAppInfo(values.DeviceID, values.SensorID, values.Value);
      });
      break;
    case "string":
      updateSensorInfo();
      break; // Don't publish nor put message in log
    case "numberInRange":
      updateSensorInfo(() => {
        let delta;
        publishAppInfo(values.DeviceID, values.SensorID, values.Value);
        switch (values.Type) {
          case "Temp":
            deviceState.setLatestTemperature(values.DeviceID, values.SensorID, val);
            delta = deviceState.getTemperatureChange(values.DeviceID, values.SensorID);
            checkInsertSensorLog(values.DeviceID, values.SensorID + '_delta', "TempDelta", delta);
            checkTempChangeWarning(values.DeviceID, values.SensorID, delta);
            break;
          case "Power":
            deviceState.setLatestInput(values.DeviceID, values.SensorID, val);
            break;
          case "Input":
            deviceState.setLatestInput(values.DeviceID, values.SensorID, val);
            break;
          case "Output":
            deviceState.setLatestOutput(values.DeviceID, values.SensorID, val);
            break;
          case "Light":
            deviceState.setLatestLight(values.DeviceID, values.SensorID, val);
            console.log(`Set light ${values.DeviceID} ${values.SensorID} ${val}`);
            break;
          default:
            // console.log(`processSensorValues (Other Type) ${JSON.stringify(values)}`);
            break;
        }
        insertSensorLog(values.DeviceID, values.SensorID, val, values.time); // Not checkInsert.. already updated
      });
      break;
  }
}

exports.setSensor = function (DeviceID, SensorID, info) {
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
  } catch (ex) {
    console.error("processRawSensorMessage (parse) error: %j. Topic %j, Payload %j", ex.message, topicParts, payload);
  }
  try {
    values.DeviceID = topicParts[2];
    values.SensorID = topicParts[3];
    processSensorValues(values, val);
  } catch (ex) {
    console.error("processRawSensorMessage (process) error: %j. Topic %j, Payload %j", ex.message, topicParts, payload);
  }
}

function processBulkData(topicParts, payload) {
  function insert(id, type) {
    checkInsertSensorLog(topicParts[2], id, type, values[id], values.time);
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
  var query = db.query(sqlstr, function (err, result) {
    if (err) {
      console.error("processDeviceResetMessage %j", err);
      utils.notify('Reset: (' + values.deviceID + ') reason: ' + values.Reason + ' last action: ' + values.LastAction +
        ' Version: ' + values.Version, "Alarm");
    } else {
      try {
        var resetType = ['Power ON', 'HW WDT', 'Exception', 'SW WDT', 'Soft restart', 'Wake Up', 'External'];
        var deviceName = result[0].Name + '-' + result[0].Location;
        if (values.Reason != 5) { // Wake Up
          alarmLog.set(1000, values.Reason, deviceName);
          utils.notify('Reset: (' + deviceName + ') reason: ' + values.Reason + ' {' + resetType[Number(values.Reason)] + ') last action: ' + values.LastAction +
            ' Version: ' + values.Version, "Alarm", deviceName, resetType[Number(values.Reason)]);
        }
        time.publish();
        weather.publish();
      } catch (ex) {
        console.error("Reset problem %j values %j result %j", ex.message, values, result);
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
          // Turn ON/OFF lights from PIR type message
          tlc.checkLights(topicParts[2], topicParts[3], topicParts[4], payload);
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
      } else if (topicParts[3] == 'bulkData') { // Sensor Info. Used eg in windSensor
        processBulkData(topicParts, payload);
      } else if (topicParts[3] == 'message'
        || topicParts[3] == 'clear' || topicParts[4] == 'clear'
        || topicParts[3] == 'set' || topicParts[4] == 'set') {
        // ignore
      } else {
        console.error('Bad Topic: ' + topic.toString());
      }
    } else {
      console.error('Unknown Topic: ' + topic.toString());
    }
  } catch (ex) {
    console.error('Decode Message error: %j topic: %j payload: %j', ex.message, topic, payload);
  }
}
exports.decode = decodeMessage;
