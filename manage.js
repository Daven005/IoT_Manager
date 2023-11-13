var utils = require('./utils');
var login = require('./login');
var currentDevice = "All";
var showAllDevices = false;

exports.settings = function (request, response) {

  function reload(device) {
    if (typeof (device) == "undefined") device = "All";
    currentDevice = device;
    var errorStr = "";
    var sqlstr1 = "SELECT Devices.Name AS DeviceName, Devices.DeviceID AS DeviceID, "
      + "setValues.ID AS ID, setvalues.value AS Value, setvalues.Name AS valueName FROM devices ";
    if (device == 'All') {
      sqlstr1 += "INNER JOIN setValues WHERE devices.DeviceID = setValues.DeviceID";
    } else {
      sqlstr1 = sql.format(sqlstr1 + " INNER JOIN setValues WHERE devices.DeviceID = setValues.DeviceID AND devices.DeviceID = ? ", currentDevice)
    }
    db.query(sqlstr1, (err, result1) => {
      if (err) {
        console.error(err);
        errorStr = err.message;
        result1 = [];
      }
      if (result1.length == 0 && currentDevice != 'All') {
        let idx;
        let sqlstr2 = "INSERT INTO setvalues (DeviceID, ID, value, Name) VALUES "
        for (idx = 0; idx < 10; idx++) {
          sqlstr2 += `${(idx == 0) ? '' : ', '}("${currentDevice}", ${idx}, 0, NULL)`;
        }
        console.log(sqlstr2);
        db.query(sqlstr2, (err, result1) => {
          if (err) {
            console.error(err);
            errorStr = err.message;
            result1 = [];
          }
          renderQuery(result1);
        });
      } else {
        renderQuery(result1);
      }
    });

    function renderQuery(result1) {
      var sqlstr = "SELECT Location, Name, DeviceID FROM devices ORDER BY Name, Location";
      db.query(sqlstr, (err, result2) => {
        if (err) {
          console.error(err);
          errorStr += err.message;
          result2 = [];
        }
        // console.log("Result1: %j Result2: %j", result1, result2);
        response.render('settings', { map: result1, devices: result2, selectedDevice: currentDevice, err: errorStr });
      });
    }
  }

  function updateSetting(rq) {

    client.publish('/Raw/' + rq.DeviceID + '/' + rq.ID + '/set/setting', rq.Value, { retain: true });

    var sqlstr = 'INSERT INTO setValues (DeviceID, ID, Value, Name) VALUES';
    sqlstr += '(?, ?, ? ,?) ';
    sqlstr += 'ON DUPLICATE KEY UPDATE setValues.Value=VALUES(setValues.Value), setValues.Name=VALUES(setValues.Name)';
    sqlstr = sql.format(sqlstr, [rq.DeviceID, rq.ID, rq.Value, rq.valueName]);
    db.query(sqlstr, function (err, result) {
      if (err) { console.error(err); }
      reload(currentDevice);
    });
  }

  var rq = request.query;
  if (rq.Action == "Update") {
    if (rq.row) {
      if (login.check(request, response)) {
        updateSetting(rq);
      }
    } else {
      reload(currentDevice);
    }
  } else if (rq.Action == "Select") {
    reload(rq.device);
  } else {
    reload(currentDevice);
  }
}

exports.showDeviceState = function (request, response) {
  response.end(deviceState.show());
}

exports.devices = function (request, response) {
  var errorStr = "";

  function reload() {
    var query = db.query(utils.sqlDeviceCounts(), function (err, result) {
      if (err) {
        console.error(err);
        errorStr = err.message;
      }
      response.render('devices', { map: result, err: errorStr, devices: deviceState.list() });
    });
  }

  function deleteItems(deleteTime) {
    try {
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ? AND time < ?";
      sqlstr = sql.format(sqlstr, [rq.DeviceID, deleteTime]);
      db.query(sqlstr, function (err, result) {
        if (err) {
          console.error(err);
          errorStr = err.message;
        }
        if (err || result.affectedRows > 0) {
          errorStr += result.affectedRows + " entries for '" + rq.DeviceID + "' deleted from the Temperature Log<br>";
          reload();
        }
      });
    } catch (err) {
      console.error(err);
      reload();
    }
  }

  var rq = request.query;
  if (rq.row) {
    if (login.check(request, response)) {
      if (rq.delMonth == "yes") {
        deleteItems(moment().subtract(1, "month").toISOString());
      } else if (rq.delWeek == "yes") {
        deleteItems(moment().subtract(1, "week").toISOString());
      } else if (rq.delAll == "yes") {
        deleteItems(moment().toISOString());
      }
    }
  } else {
    reload();
  }
}

exports.deviceList = function (request, response) {
  response.render('deviceList', { deviceList: deviceState.list() });
}

exports.sensors = function (request, response) {
  var errorStr = "";

  function reload() {
    var query = db.query(utils.sqlDevicesSensors(true), function (err, result) {
      if (err) {
        console.error(err);
        errorStr = err.message;
      }
      response.render('names', { map: result, err: errorStr, devices: deviceState.list(), allDevices: showAllDevices });
    });
  }

  function deleteDevice(rq) {
    try {
      var sqlstr = "SELECT COUNT(*) AS LogCount FROM temperaturelog WHERE DeviceID = ?";
      sqlstr = sql.format(sqlstr, [rq.DeviceID]);
      db.query(sqlstr, (err, result) => {
        if (err) {
          console.error(err)
          errorStr = err.message
        }
        if (result[0].LogCount > 0) {
          errorStr = "Delete all data first";
        } else {
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ?"
          sqlstr = sql.format(sqlstr, [rq.DeviceID])
          db.query(sqlstr, (err, result) => {
            if (err) {
              console.error(err)
              errorStr = err.message
            } else {
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?"
              sqlstr = sql.format(sqlstr, [rq.DeviceID])
              db.query(sqlstr, (err, result) => {
                if (err) {
                  console.error(err)
                  errorStr = err.message
                }
                if (err || result.affectedRows > 0) {
                  errorStr += "Device '" + rq.name + "' deleted<br>"
                  deviceState.delete(rq.DeviceID);
                }
              });
            }
          });
        }
        reload();
      });
    } catch (ex) {
      console.error(err);
      reload();
    }
  }

  function deleteItems(rq) {
    try {
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ? AND SensorID = ?";
      sqlstr = sql.format(sqlstr, [rq.DeviceID, rq.SensorID]);
      db.query(sqlstr, function (err, result) {
        if (err) {
          console.error(err);
          errorStr = err.message;
        }
        if (err || result.affectedRows > 0) {
          errorStr += result.affectedRows + " entries for '" + rq.SensorName + "' deleted from the Temperature Log<br>";
          reload();
        } else {
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ? AND SensorID = ?"
          sqlstr = sql.format(sqlstr, [rq.DeviceID, rq.SensorID])
          db.query(sqlstr, function (err, result) {
            if (err) {
              console.error(err)
              errorStr = err.message
            }
            if (err || result.affectedRows > 0) {
              errorStr += "Sensor '" + rq.SensorName + "' deleted<br>"
            } else {
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?"
              sqlstr = sql.format(sqlstr, [rq.DeviceID])
              db.query(sqlstr, function (err, result) {
                if (err) {
                  console.error(err)
                  errorStr = err.message
                }
                if (err || result.affectedRows > 0) {
                  errorStr += "Device '" + rq.DeviceName + "' deleted<br>"
                }
              });
            }
          });
          reload()
        }
      });
    } catch (err) {
      console.error(err);
      reload();
    }
  }

  function deleteAll(rq) {
    try {
      var msgStr = "";
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ?";
      sqlstr = sql.format(sqlstr, [rq.DeviceID]);
      db.query(sqlstr, function (err, result) {
        if (err) {
          console.error(err);
          errorStr = err.message;
          reload();
        } else {
          msgStr = result.affectedRows + " entries deleted from TemperatureLog<br>";
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ?"
          sqlstr = sql.format(sqlstr, [rq.DeviceID])
          db.query(sqlstr, function (err, result) {
            if (err) {
              console.error(err)
              errorStr = err.message;
              reload();
            } else {
              msgStr += result.affectedRows + " entries deleted from Sensors<br>";
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?";
              sqlstr = sql.format(sqlstr, [rq.DeviceID])
              db.query(sqlstr, function (err, result) {
                if (err) {
                  console.error(err);
                  errorStr = err.message;
                }
                msgStr += "Device '" + rq.DeviceName + "' deleted<br>";
              });
            }
          });
          errorStr += msgStr;
          reload();
        }
      });
    } catch (err) {
      console.error(err);
      reload();
    }
  }

  function updateItems(rq) {
    // var sqlstr = "UPDATE Devices SET Updates =?, Inputs = ?, Outputs = ? WHERE DeviceID = ?";
    // sqlstr = sql.format(sqlstr, [rq.Location, rq.DeviceName, rq.Updates, rq.Inputs, rq.Outputs, rq.DeviceID]);
    // db.query(sqlstr, function (err, result) {
    //     if (err) {
    //         console.error(err);
    //         errorStr = err.message;
    //         reload();
    //     } else {
    //         publishDeviceParams(rq, rq.DeviceID);

    // setTimeout(() => { // To avoid too many MQTT msgs  in one block
    sqlstr = "UPDATE Sensors SET Name = ?, Mapping = ?, deleteAfter = ? WHERE DeviceID = ? and SensorID = ?";
    if (!isNumeric(rq.Mapping)) { rq.Mapping = undefined; }
    sqlstr = sql.format(sqlstr, [rq.SensorName, rq.Mapping, rq.deleteAfter, rq.DeviceID, rq.SensorID]);
    db.query(sqlstr, function (err, result) {
      if (err) {
        console.error(err);
        errorStr = err.message;
        response.render('Names', { map: result, err: errorStr });
      } else {
        // These currently only used for temperature sensors
        client.publish('/Raw/' + rq.DeviceID + '/' + rq.SensorID + '/set/mapping', rq.Mapping); // Must come first
        client.publish('/Raw/' + rq.DeviceID + '/' + rq.SensorID + '/set/name',
          JSON.stringify({'name': rq.SensorName, 'map': rq.Mapping }), { retain: true });
        reload();
      }
      //     }, 1000);
    });
    //     }
    // });
  }

  function removeRetained(deviceID) {
    client.publish(`/Raw/${deviceID}/info`, '', { retained: true });
    client.publish(`/Raw/${deviceID}/mapping`, '', { retained: true });
    deviceState.set(deviceID, false);
  }

  var rq = request.query;
  if (rq.all) {
    showAllDevices = rq.all == 'yes';
    reload();
  } else if (rq.row) {
    if (login.check(request, response)) {
      if (rq.del == "yes") {
        if (rq.delDev == "yes") { // Delete everything wrt this device
          deleteAll(rq);
        } else { // Just items
          deleteItems(rq);
        }
      } else if (rq.delDev == "yes") {
        deleteDevice(rq);
      } else {
        updateItems(rq);
      }
    }
  } else if (rq.deviceID) { // Remove Retained
    if (login.check(request, response)) {
      removeRetained(rq.deviceID);
      reload();
    }
  } else {
    showAllDevices = false;
    reload();
  }
}

// *** getDeviceInfo *** invoked from Update command in Names ((/Manaage/Sensors))

exports.getDeviceInfo = function (request, response) {
  response.setHeader('Content-Type', 'application/json');
  var rq = request.query;
  if (rq.device) {
    if (rq.Command) {
      client.publish(`/Raw/${rq.device}/${rq.Command}`);
    }
    if (rq.Location) { //Update
      let sqlstr = `UPDATE devices SET Location=?, Name=?, Updates=?, Inputs=?, Outputs=?
                WHERE deviceID=?`;
      sqlstr = sql.format(sqlstr,
        [rq.Location, rq.DeviceName, rq.Updates, rq.Inputs, rq.Outputs, rq.device]);
      console.log(sqlstr);
      db.query(sqlstr, (err, result) => {
        if (err) { console.error(err); } else {
          publishDeviceParams(rq, rq.device);
          reload(rq.device);
        }
      });
    } else {
      reload(rq.device);
    }
  } else {
    response.end("Bad request");
  }

  function reload(device) {
    let sqlstr =
      "SELECT Location, Name As DeviceName, Updates, Inputs, Outputs FROM devices WHERE deviceID = ?";
    sqlstr = sql.format(sqlstr, [device]);
    db.query(sqlstr, (err, result) => {
      if (err) {
        console.error(err);
        errorStr = err.message;
      }
      response.end(JSON.stringify(result[0]));
    });
  }
}

exports.updateMapping = function (request, response) {
  var errorStr = '';
  var sqlStr = "SELECT devices.location, devices.Name  AS deviceName, mapping, sensors.name AS sensorName, sensors.deviceID, sensorID FROM devices " +
    "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID WHERE mapping IS NOT NULL ORDER BY location, deviceName, mapping";

  db.query(sqlStr, function (err, result) {
    var mapIdx;

    function publishNext() {
      mapIdx++;
      if (mapIdx >= result.length) {
        response.render("mapping", { map: result, err: errorStr });
      } else {
        client.publish('/Raw/' + result[mapIdx].deviceID + '/' + result[mapIdx].sensorID + '/set/mapping',
          result[mapIdx].mapping.toString()); // Must come first
        client.publish('/Raw/' + result[mapIdx].deviceID + '/' + result[mapIdx].sensorID + '/set/name',
          JSON.stringify({ 'name': result[mapIdx].sensorName, 'map': result[mapIdx].mapping }),
          { retain: true, qos: 1 }, // Use qos{1 to slow down transmission to avoid msg straddling 2 tcp blocks
          delayedPublish);
      }
    }

    function delayedPublish() {
      setTimeout(publishNext, 500);
    }

    if (err) {
      console.error(err, sqlStr);
      errorStr = err.message;
      response.render('mapping', { map: result, err: errorStr });
    } else {
      mapIdx = 0;
      publishNext();
    }
  });
}

function publishDeviceParams(rq, device) {
  console.log("publishDeviceParams: ", device);
  client.publish('/Raw/' + device + '/set/location', rq.Location, { retain: true });
  client.publish('/Raw/' + device + '/set/name', rq.DeviceName, { retain: true });
  client.publish('/Raw/' + device + '/set/updates', rq.Updates, { retain: true });
  client.publish('/Raw/' + device + '/set/inputs', rq.Inputs, { retain: true });
  client.publish('/Raw/' + device + '/set/outputs', rq.Outputs, { retain: true });
  client.publish('/Raw/' + device + '/set/deviceParams',
    JSON.stringify({
      location: rq.Location,
      name: rq.DeviceName,
      updates: rq.Updates,
      inputs: rq.Inputs,
      outputs: rq.Outputs
    }),
    { retain: true });
}

