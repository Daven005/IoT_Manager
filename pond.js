"use strict";

var switchState = [];
setInterval(processOutputs, 60*1000);
var errorNotice = "";

exports.show = function(request, response) {
	response.render("pond", {map: switchState, err: errorNotice});
}

exports.update = function(deviceName, switchName, state, switchID) {
  var record = switchState[switchID];
  var key = deviceState.findDeviceID(deviceName);
  if (typeof record == 'undefined') {
     switchState[switchID] = {name: switchName, state: 'off', request: 'off', override: 'not set', deviceID: key, outputID: switchID};
  }
  switchState[switchID].state = (state) ? 'on' : 'off';
  switchState[switchID].outputID = switchID; // In case it changes
}

function processOutputs() {
  // Work output what each output would be programmed to be now
  var sqlstr = "SELECT * FROM pond WHERE startTime <= NOW() ORDER BY startTime";
  var states = [false, false, false, false, false]; // Assume all off at midnight
  if (!config.pond.enabled) {
	  errorNotice = "Pond functions not enabled";
	  return;
  }
  db.query(sqlstr, function(err, outputs) {
    if (err) {
      console.log("Err pond outputs %j", err);
    }
    outputs.forEach(function(output) {
      if (output.active == 1) 
        states[output.outputID-20] = true;
      else
        states[output.outputID-20] = false;
    });
    states.forEach(function(state, id) {
		if (typeof switchState[id] != 'undefined') {   
			if (switchState[id].override == 'not set') {
				switchState[id].state = switchState[id].request = state ? 'on' : 'off';
				var topic = '/Raw/'+switchState[id].deviceID+'/'+id+'/set/output';
				client.publish(topic, state ? '1' : '0');
			}
		}
    });
  });
}

exports.schedule = function(request, response) {
  var errorStr;
  function reload() {
    var sqlstr = "SELECT sensors.Name AS 'Name', sensors.sensorID FROM sensors "+ 
      "INNER JOIN devices ON sensors.DeviceID = devices.DeviceID "+
      "WHERE devices.Name = ? AND sensors.type = 'output'"
    sqlstr = sql.format(sqlstr, [config.pond.controllerName]);
    db.query(sqlstr, function(err, outputs) {
      if (err) {
        console.log("Err pond outputs %j ******>%s", err, sqlstr);
      }
      sqlstr = "SELECT *, TRUE AS ex FROM pond ORDER BY  startTime"
      db.query(sqlstr, function(err, schedule) {
        if (err) {
          console.log("Err pond schedule %j", err);
        }
        schedule.push({ID:0, sensorID: 0, startTime: '12:00:00', state: 0});
        response.render("pond_schedule", {outputs: outputs, schedule: schedule, err: errorNotice});
      });
    });
  }
  function updateSchedule(rq) {
    console.log("Update: %j", rq);
    var sqlstr = "UPDATE pond SET "
      +"outputID = ?, "
      +"startTime = ?, "
      +"active = ? "
      +"WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [
        request.query.outputID,
        request.query.start,
        (request.query.active == 'yes'),
        request.query.ID
      ]);
    db.query(sqlstr, function(err, result) {
      if (err) {console.log(err); errorStr = "Empty values?";}
      processOutputs();
      reload();
    });
  }
  function deleteSchedule(ID) {
    console.log("Delete %d", ID);
    var sqlstr = "DELETE FROM pond WHERE ID = ?";
    sqlstr = sql.format(sqlstr, [ID]);
    db.query(sqlstr, function(err, result) {
      if (err) { console.log(err); }
      processOutputs();
      reload();
    });
  }
  function insertSchedule(rq) {
    console.log("Insert %j", rq);
      var sqlstr = "INSERT pond "
      +"(outputID, startTime, active) "
      +"VALUES (?, ?, ?)";
    sqlstr = sql.format(sqlstr, [
        request.query.outputID,
        request.query.start,
        (request.query.active == 'yes'),
      ]);
    db.query(sqlstr, function(err, result) {
      if (err) {console.log(err);}
      processOutputs();
      reload();
    });
  }
  switch (request.query.Action) {
  case "Update":
    if (request.query.ID != 0) {
      updateSchedule(request.query);
    } else {
      reload();
    }
    break;
  case "Delete":
     if (request.query.ID != 0) {
      deleteSchedule(request.query.ID);
    } else {
      reload();
    }
    break;
  case "Add":
    if (request.query.ID != 0) {
      insertSchedule(request.query);
    } else {
      reload();
    }
    break;
  default:
    reload();
  }
}

exports.set = function(request, response) {
  if (request.query.request) {
    var id = request.query.id;
    if (switchState[id]) {
      if (request.query.request == 'not set') {
        switchState[id].override = 'not set';
        processOutputs();
      } else {
        switchState[id].request = switchState[id].override = request.query.request;
        var newState = (request.query.request == 'on') ? "1" : "0";
        var topic = '/Raw/'+switchState[id].deviceID+'/'+id+'/set/output';
        client.publish(topic, newState);
      }
    } else {
      console.log("Switch %d not set yet", id);
    }
  }
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(switchState));
  response.end();
}
