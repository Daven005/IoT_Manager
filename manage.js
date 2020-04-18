var utils = require('./utils');
var login = require('./login');
var currentDevice = "All";
var showAllDevices = false;

exports.settings = function(request, response) {

  function reload(device) {
    if (typeof(device) == "undefined") device = "All";
    currentDevice = device;
    var errorStr = "";
    var sqlstr1 = "SELECT Devices.Name AS DeviceName, Devices.DeviceID AS DeviceID, "
      + "setValues.ID AS ID, setvalues.value AS Value, setvalues.Name AS valueName FROM devices ";
    if (device == 'All') {
      sqlstr1 += "INNER JOIN setValues WHERE devices.DeviceID = setValues.DeviceID";
    } else {
      sqlstr1 = sql.format(sqlstr1+" INNER JOIN setValues WHERE devices.DeviceID = setValues.DeviceID AND devices.DeviceID = ? ", currentDevice)
    }
    var query1 = db.query(sqlstr1, function(err, result1) {
      if (err) {
        console.log(err);
        errorStr = err.message;
        result1= [];
      }
      var sqlstr2 = "SELECT Location, Name, DeviceID FROM devices ORDER BY Name, Location";
      var query2 = db.query(sqlstr2, function(err, result2) {
        if (err) {
          console.log(err);
          errorStr += err.message;
          result2 = [];
        }
        // console.log("Result1: %j Result2: %j", result1, result2);
        response.render('settings', {map: result1, devices: result2, selectedDevice: currentDevice, err: errorStr});
      });
    });
  }

  function updateSetting(request) {
      
      client.publish('/Raw/'+request.query.DeviceID+'/'+request.query.ID+'/set/setting', request.query.Value, {retain: true});
      
      var sqlstr =  'INSERT INTO setValues (DeviceID, ID, Value, Name) VALUES';
      sqlstr += '("'+request.query.DeviceID+'", '+request.query.ID+', '+request.query.Value+', "'+request.query.valueName+'")';
      sqlstr += ' ON DUPLICATE KEY UPDATE setValues.Value=VALUES(setValues.Value), setValues.Name=VALUES(setValues.Name)';
      db.query(sqlstr, function(err, result) {
        if (err) {console.log(err);}
        reload(currentDevice);
      });
  }

  if (request.query.Action == "Update") {
    if (request.query.row) {
      if (login.check(request, response)) {
        updateSetting(request);
      }
    } else {
      reload(currentDevice);
    }
  } else if (request.query.Action == "Select") {
    reload(request.query.device);
  } else {
     reload(currentDevice);
  }
}

exports.devices = function(request, response) {
  var errorStr = "";

  function reload() {
    var query = db.query(utils.sqlDeviceCounts(), function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('devices', {map: result, err: errorStr, devices: deviceState.list()});
   });
  }

  function deleteItems(deleteTime) {
    try {
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ? AND time < ?";
      sqlstr = sql.format(sqlstr,[request.query.DeviceID, deleteTime]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
          errorStr = err.message;
        }
        if (err || result.affectedRows > 0) {
          errorStr += result.affectedRows + " entries for '" + request.query.DeviceID + "' deleted from the Temperature Log<br>";
          reload();
        }
      });
    } catch(err) {
      console.log(err);
      reload();
    }
  }
  
  if (request.query.row) {
    if (login.check(request, response)) {
      if (request.query.delMonth == "yes"){
        deleteItems(moment().subtract(1, "month").toISOString());
      } else if (request.query.delWeek == "yes"){
        deleteItems(moment().subtract(1, "week").toISOString());
      } else if (request.query.delAll == "yes") {
        deleteItems(moment().toISOString());
      }
    }
  } else {
    reload();
  }
}

exports.sensors = function(request, response) {
  var errorStr = "";

  function reload() {
    var query = db.query(utils.sqlDevicesSensors(true), function(err, result) {
    if (err) {
      console.log(err);
      errorStr = err.message;
    }
     response.render('names', {map: result, err: errorStr, devices: deviceState.list(), allDevices: showAllDevices});
   });
  }
 
  function deleteDevice() {
    try {
      var sqlstr = "SELECT COUNT(*) AS LogCount FROM temperaturelog WHERE DeviceID = ?";
      sqlstr = sql.format(sqlstr,[request.query.DeviceID]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err)
          errorStr = err.message
        }
        if (result[0].LogCount > 0) {
          errorStr = "Delete all data first";
        } else {
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ?"
          sqlstr = sql.format(sqlstr,[request.query.DeviceID])
          db.query(sqlstr, function(err, result) {
            if (err) {
              console.log(err)
              errorStr = err.message
            } else {
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?"
              sqlstr = sql.format(sqlstr,[request.query.DeviceID])
              db.query(sqlstr, function(err, result) {
                if (err) {
                  console.log(err)
                  errorStr = err.message
                }
                if (err || result.affectedRows > 0) {
                  errorStr += "Device '" + request.query.name + "' deleted<br>"
                }
              });
            }
           });
        }
        reload();
      });
    } catch (ex) {
      console.log(err);
      reload();
    }
  }
 
  function deleteItems() {
    try {
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ? AND SensorID = ?";
      sqlstr = sql.format(sqlstr,[request.query.DeviceID, request.query.SensorID]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
          errorStr = err.message;
        }
        if (err || result.affectedRows > 0) {
          errorStr += result.affectedRows + " entries for '" + request.query.SensorName + "' deleted from the Temperature Log<br>";
          reload();
        } else {
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ? AND SensorID = ?"
          sqlstr = sql.format(sqlstr,[request.query.DeviceID, request.query.SensorID])
          db.query(sqlstr, function(err, result) {
            if (err) {
              console.log(err)
              errorStr = err.message
            }
            if (err || result.affectedRows > 0) {
              errorStr += "Sensor '" + request.query.SensorName + "' deleted<br>"
            } else {
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?"
              sqlstr = sql.format(sqlstr,[request.query.DeviceID])
              db.query(sqlstr, function(err, result) {
                if (err) {
                  console.log(err)
                  errorStr = err.message
                }
                if (err || result.affectedRows > 0) {
                  errorStr += "Device '" + request.query.DeviceName + "' deleted<br>"
                }
              });
            }
           });
           reload()
        }
      });
    } catch(err) {
      console.log(err);
      reload();
    }
  }

  function deleteAll() {
    try {
      var msgStr = "";
      var sqlstr = "DELETE FROM temperaturelog WHERE DeviceID = ?";
      sqlstr = sql.format(sqlstr,[request.query.DeviceID]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
          errorStr = err.message;
          reload();
        } else {
          msgStr = result.affectedRows + " entries deleted from TemperatureLog<br>";
          sqlstr = "DELETE FROM Sensors WHERE DeviceID = ?"
          sqlstr = sql.format(sqlstr,[request.query.DeviceID])
          db.query(sqlstr, function(err, result) {
            if (err) {
              console.log(err)
              errorStr = err.message;
              reload();
            } else {
              msgStr += result.affectedRows + " entries deleted from Sensors<br>";
              sqlstr = "DELETE FROM Devices WHERE DeviceID = ?";
              sqlstr = sql.format(sqlstr,[request.query.DeviceID])
              db.query(sqlstr, function(err, result) {
                if (err) {
                  console.log(err);
                  errorStr = err.message;
                }
                msgStr += "Device '" + request.query.DeviceName + "' deleted<br>";
              });
            }
          });
          errorStr += msgStr;
          reload();
        }
      });
    } catch(err) {
      console.log(err);
      reload();
    }
  }

  function updateItems() {
    var sqlstr = "UPDATE Devices SET Location = ?, Name = ?, Updates =?, Inputs = ?, Outputs = ? WHERE DeviceID = ?";
    sqlstr = sql.format(sqlstr, [request.query.Location, request.query.DeviceName, request.query.Updates, request.query.Inputs, request.query.Outputs, request.query.DeviceID]);
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
        reload();
      } else {
        client.publish('/Raw/'+request.query.DeviceID+'/set/location', request.query.Location, {retain: true});
        client.publish('/Raw/'+request.query.DeviceID+'/set/name', request.query.DeviceName, {retain: true});
        client.publish('/Raw/'+request.query.DeviceID+'/set/updates', request.query.Updates, {retain: true});
        client.publish('/Raw/'+request.query.DeviceID+'/set/inputs', request.query.Inputs, {retain: true});
        client.publish('/Raw/'+request.query.DeviceID+'/set/outputs', request.query.Outputs, {retain: true});
        client.publish('/Raw/'+request.query.DeviceID+'/set/deviceParams', 
          JSON.stringify({ location: request.query.Location,
            name: request.query.DeviceName,
            updates: request.query.Updates, 
            inputs: request.query.Inputs, 
            outputs: request.query.Outputs }), 
            {retain: true});

        sqlstr = "UPDATE Sensors SET Name = ?, Mapping = ?, deleteAfter = ? WHERE DeviceID = ? and SensorID = ?";
        if (!isNumeric(request.query.Mapping)) {request.query.Mapping = undefined;}
        sqlstr = sql.format(sqlstr, [request.query.SensorName, request.query.Mapping, request.query.deleteAfter, request.query.DeviceID, request.query.SensorID]);
        db.query(sqlstr, function(err, result) {
          if (err) {
            console.log(err);
            errorStr = err.message;
            response.render('Names', {map: result, err: errorStr});
          } else {
            client.publish('/Raw/'+request.query.DeviceID+'/'+request.query.SensorID+'/set/mapping', request.query.Mapping); // Must come first
            client.publish('/Raw/'+request.query.DeviceID+'/'+request.query.SensorID+'/set/name', 
              JSON.stringify({'name': request.query.SensorName, 'map':request.query.Mapping}), {retain: true});
            reload();
           }
        });
       }
    });
  }
  if (request.query.all) {
    showAllDevices = request.query.all == 'yes';
    reload();
  } else if (request.query.row) {
    if (login.check(request, response)) {
      if (request.query.del == "yes") {
        if (request.query.delDev == "yes") { // Delete everything wrt this device
          deleteAll();
        } else { // Just items
          deleteItems();
        }
      } else if (request.query.delDev == "yes") {
        deleteDevice();
      } else {
        updateItems();
      }
    }
  } else {
    reload();
  }
}

exports.updateMapping = function (request, response) {
  var errorStr = '';
  var sqlStr = "SELECT devices.location, devices.Name  AS deviceName, mapping, sensors.name AS sensorName, sensors.deviceID, sensorID FROM devices "+
                "INNER JOIN sensors ON devices.DeviceID = sensors.DeviceID WHERE mapping IS NOT NULL ORDER BY location, deviceName, mapping";

  db.query(sqlStr, function(err, result) {
    var mapIdx;
    
    function publishNext() {
      mapIdx++;
      if (mapIdx >= result.length) {
        response.render("mapping", { map: result, err: errorStr });
      } else {
        client.publish('/Raw/'+result[mapIdx].deviceID+'/'+result[mapIdx].sensorID+'/set/mapping', 
          result[mapIdx].mapping.toString()); // Must come first
        client.publish('/Raw/'+result[mapIdx].deviceID+'/'+result[mapIdx].sensorID+'/set/name', 
          JSON.stringify({'name': result[mapIdx].sensorName, 'map':result[mapIdx].mapping}), 
          {retain: true, qos: 1}, // Use qos{1 to slow down transmission to avoid msg straddling 2 tcp blocks
          delayedPublish);      
      }
    }
    
    function delayedPublish() {
      setTimeout(publishNext, 500);
    }
    
    if (err) {
      console.log(err);
      console.log(sqlStr);
      errorStr = err.message;
      response.render('mapping', {map: result, err: errorStr});
    } else {
      mapIdx = 0;
      publishNext();
    }
  });
}
