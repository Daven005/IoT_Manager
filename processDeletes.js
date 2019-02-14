var deletes = [];

function doDelete(entry) {
  var sqlstr = "DELETE FROM temperatureLog WHERE deviceID = ? AND sensorID = ? "+
            "AND Time < DATE_ADD(CURDATE(), INTERVAL -? DAY)"
  sqlstr = sql.format(sqlstr, [entry.deviceID, entry.sensorID, entry.deleteAfter]);
  db.query(sqlstr, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.affectedRows > 0)
        console.log("Deleted %d records from %s:%s", result.affectedRows, entry.deviceID, entry.sensorID);
    }
  });
}

exports.check = check;

function check() {
  if (deletes.length == 0) {
    var sqlstr = "SELECT deviceID, sensorID, deleteAfter FROM Sensors";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      } else {
        result.forEach(function(r) {
          deletes.push(r);
        });
      }
    });
  } else {
    if (deletes[0]) {
      doDelete(deletes[0]);
    }
    deletes.splice(0, 1);
  }
}

