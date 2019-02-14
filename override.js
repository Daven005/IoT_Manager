var login = require('./login');

exports.output = function(request, response) {
  var errorStr = "";
  var topic = "None";
  
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
    var sqlstr = "SELECT Location, Name, DeviceID, '0' as Input, '0' AS Value FROM devices ORDER BY Locatiom, Name";
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
    var sqlstr = "SELECT Location, Name, DeviceID, '0' AS Value FROM devices ORDER BY Location, Name";
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
    var sqlstr = "SELECT Location, Name, DeviceID, '0' AS Value FROM devices ORDER BY Location, Name";
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
    var sqlstr = "select DeviceID, SensorID, location, name, sensorName, value, max(Time) as T from "+
          "(select devices.name, devices.location, sensors.DeviceID, sensors.SensorID, sensors.Name as SensorName from sensors "+
          "inner join devices  using(DeviceID) where sensors.type = 'Temp') as t "+
          "join temperaturelog using(DeviceID, sensorID) "+
          "group by deviceID, sensorID";
    sqlstr = "SELECT Location, Devices.Name AS DeviceName, Sensors.Name AS SensorName, sensors.DeviceID, sensors.SensorID, mapping FROM sensors "+
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
