exports.get = function(request, response) {
  var sqlstr;
  var device = request.query.device;
  var location = request.query.location;
  var type = request.query.type;
  if (!type) {
    if (!device) device = "Boiler Control";
    if (!location) location = "Boiler Rm";
    sqlstr = sql.format("SELECT ROUND(value,1) AS value, sensorName, Type, units, scaleFactor "+
                  "FROM latestValues WHERE location = ? AND deviceName = ?"+
                  "ORDER BY Type, SensorName", [location, device]);
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
      }
      response.render('Dashboard', {map: result, device: device, location: location, loggedIn: request.loggedIn });
    });
  } else {
    if (type == 'Status') {
      sqlstr = sql.format("SELECT deviceID, Name, location "+
                    "FROM devices WHERE location NOT IN ('Test', 'Spare', 'Unknown') "+
                    "ORDER BY location, Name");
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
        }
        response.render('SystemStatus', {map: result, dev: deviceState.list()});
      });
    } else {
      sqlstr = sql.format("SELECT value, sensorName, deviceName, location "+
                    "FROM latestValues WHERE type = ?"+
                    "ORDER BY deviceName, SensorName", [type]);
      db.query(sqlstr, function(err, result) {
        if (err) {
          console.log(err);
        }
        response.render('Controls', {map: result, control: type, loggedIn: request.loggedIn });
      });
    }
  }
}
