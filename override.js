var login = require('./login');

var errorStr = "";
var topic = "None";
var currentDevice = "All";

exports.device = function(request, response) {  

    function reload(response) {
        var sqlstr = "SELECT Location, Name, DeviceID FROM devices ORDER BY Name, Location";
        db.query(sqlstr, function(err, result) {
          if (err) {
            console.log(err);
            errorStr += err.message;
            result = [];
          }
          response.render('deviceOverride', {devices: result, selectedDevice: currentDevice, err: errorStr});
        });
    }

    if (login.check(request, response)) {
        if (request.query.Action == "Update") {
            currentDevice = request.query.device;
            Object.keys(request.query).forEach(val => {
                let action = val.substring(0, 6);
                let output = val.substring(6);
                let setting = request.query[val];
                let topic;
                let value = 0;
                if (action == 'Value-') {
                    switch (setting) {
                        case '1':
                        case '0':
                            topic = `/Raw/${request.query.device}/${output}/set/output`;
                            value = setting;
                            break;
                        case 'Auto':
                            topic = `/Raw/${request.query.device}/${output}/clear/output`;
                            break;
                    }
                    if (setting != 'Leave') {
                        client.publish(topic, value);
                        console.log(`${topic}=${value}`);
                    }
                }
            });
        }
    }
    reload(response);
}

exports.output = function(request, response) {  

  function reload() {
    var sqlstr = "SELECT Location, Name, DeviceID, '0' as Output, '0' AS Value FROM devices ORDER BY Location, Name";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('output', {map: result, err: errorStr});
    });
  }
  if (login.check(request, response)) {
    if (request.query.action == 'Set') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.Output+'/set/output';
      client.publish(topic, request.query.Value);
    } else if (request.query.action == 'Clear') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.Output+'/clear/output';
      client.publish(topic, request.query.Value);
    }
    reload();
  }
}

exports.input = function(request, response) {
  var errorStr = "";
  var topic = "None";
  
  function reload() {
    var sqlstr = "SELECT Location, Name, DeviceID, '0' as Input, '0' AS Value FROM devices ORDER BY Location, Name";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('input', {map: result, err: errorStr});
    });
  }
  if (login.check(request, response)) {
    if (request.query.action == 'Set') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.Input+'/set/input';
      client.publish(topic, request.query.Value);
    } else if (request.query.action == 'Clear') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.Input+'/clear/input';
      client.publish(topic, request.query.Value);
    }
    reload();
  }
}

exports.flow = function(request, response) {
  var errorStr = "";
  var topic = "None";
  
  function reload() {
    var sqlstr =  
    "SELECT Location, Devices.Name AS DeviceName, devices.DeviceID AS DeviceID, '0' as Value FROM sensors "+
    "INNER JOIN devices WHERE sensors.DeviceID = devices.DeviceID AND Type = 'Flow' "+
    "ORDER BY location, devices.name";
    // "SELECT Location, Name, DeviceID, '0' AS Value FROM devices ORDER BY Location, Name";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('flow', {map: result, err: errorStr});
    });
  }
  if (login.check(request, response)) {
    if (request.query.action == 'Set') {
      topic = '/Raw/'+request.query.DeviceID+'/0/set/flow';
      client.publish(topic, request.query.Value);
    } else if (request.query.action == 'Clear') {
      topic = '/Raw/'+request.query.DeviceID+'/0/clear/flow';
      client.publish(topic, request.query.Value);
    }
    reload();
  }
}

exports.pressure = function(request, response) {
  var errorStr = "";
  var topic = "None";
  
  function reload() {
    var sqlstr = 
    "SELECT Location, Devices.Name AS DeviceName, devices.DeviceID AS DeviceID, '0' as Value FROM sensors "+
    "INNER JOIN devices WHERE sensors.DeviceID = devices.DeviceID AND Type = 'Pressure' "+
    "ORDER BY location, devices.name";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('pressure', {map: result, err: errorStr});
    });
  }
  if (login.check(request, response)) {
    if (request.query.action == 'Set') {
      topic = '/Raw/'+request.query.DeviceID+'/0/set/pressure';
      client.publish(topic, request.query.Value);
    } else if (request.query.action == 'Clear') {
      topic = '/Raw/'+request.query.DeviceID+'/0/clear/pressure';
      client.publish(topic, request.query.Value);
    }
    reload();
  }
}

exports.temperature = function(request, response) {
  var errorStr = "";
  var topic = "None";
  
  function reload() {
    var sqlstr = "SELECT Location, Devices.Name AS DeviceName, Sensors.Name AS SensorName, sensors.DeviceID, sensors.SensorID, mapping FROM sensors "+
              "INNER JOIN devices WHERE sensors.DeviceID = devices.DeviceID AND Type = 'Temp' "+
              "ORDER BY location, devices.name, sensors.name, sensors.sensorID";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      result.forEach(function(entry) {
        var temp = deviceState.getLatestTemperature(entry.DeviceID, entry.SensorID);
        if (typeof temp != 'undefined') {
          entry.value = temp;
        } else {
          entry.value = 0;
        }
      });
      response.render('temperature', {map: result, err: errorStr});
    });
  }
  if (login.check(request, response)) {
    if (request.query.action == 'Set') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.SensorID+'/set/temperature';
      client.publish(topic, request.query.Temperature);
    } else if (request.query.action == 'Clear') {
      topic = '/Raw/'+request.query.DeviceID+'/'+request.query.SensorID+'/clear/temperature';
      client.publish(topic, request.query.Temperature);
    }
    reload();
  }
}
