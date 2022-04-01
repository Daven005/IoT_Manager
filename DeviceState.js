setTimeout(init, 1500);

function DeviceState () {
	this.state = [];
}

exports.init = init;

function init(cb) {
	var sqlstr = "SELECT devices.DeviceID AS deviceID, location, devices.name AS deviceName, sensorID, sensors.Name AS sensorName " +
		"FROM devices inner join sensors ON devices.DeviceID = sensors.DeviceID " +
		"WHERE sensors.type = 'Output'";
	db.query(sqlstr, function(err, result) {
		result.forEach(function(r) {
			deviceState.setName(r.deviceID, r.deviceName);
			deviceState.setLocation(r.deviceID, r.location);
			deviceState.setOutputName(r.deviceID, r.sensorID, r.sensorName);
        });
        if (cb) cb();
	});
}

DeviceState.prototype.delete = function(DeviceID) {
    this.state[DeviceID] = undefined;
}

DeviceState.prototype.set = function(DeviceID, isOnline) {
    try {
      var t = Date.now()
      var record = this.state[DeviceID];
      if (typeof record == 'undefined') {
        record = {online: isOnline, firstSet: t, lastSet: t, version: '-'}
      } else {
        if (record.online == isOnline) {
          record.lastSet = t;
        } else {
          record.online = isOnline;
          record.firstSet = t;
          record.lastSet = t;
          // Leave record.version alone
        }
      }
      this.state[DeviceID] = record;
    } catch (err) {
      console.log(err);
      console.log(DeviceID);
      console.log(isOnline);
      console.log(record);
    }
}

  DeviceState.prototype.setAlwaysOnline = function(DeviceID) {
    try {
      var t = Date.now()
      var record = this.state[DeviceID];
      if (typeof record == 'undefined') {
        record = {alwaysOnline: true, online: true, firstSet: t, lastSet: t, version: '-'}
      } else {
          record.lastSet = t;
          record.alwaysOnline = true;
          record.online = true;
      }
      this.state[DeviceID] = record;
    } catch (err) {
      console.error(err);
      console.error(DeviceID);
      console.error(isOnline);
      console.error(record);
    }
}
    
DeviceState.prototype.setRSSI = function(DeviceID, r) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {rssi: r};
    } else {
      record.rssi = r;
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setName = function(DeviceID, r) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {name: r};
    } else {
      record.name = r;
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setLocation = function(DeviceID, r) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {location: r};
    } else {
      record.location = r;
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setAttempts = function(DeviceID, r) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {attempts: r, minAttempts: r, maxAttempts: r};
    } else {
      record.attempts = r;
      if (r < record.minAttempts) {
        record.minAttempts = r;
      }
      if (r > record.maxAttempts) {
        record.maxAttempts = r;
      }
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setAP = function(DeviceID, r) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {AP: r};
    } else {
      record.AP = r;
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setVersion = function(DeviceID, ver) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {version: ver};
    } else {
      record.version = ver;
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setIPaddress = function(DeviceID, ip) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {ipAddress: ip};
    } else {
      record.ipAddress = ip;
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setChannel = function(DeviceID, chan) {
    var record = this.state[DeviceID];
    if (typeof record == 'undefined') {
      record = {channel: chan};
    } else {
      record.channel = chan;
      // Leave rest of record alone
    }
    this.state[DeviceID] = record;
}

DeviceState.prototype.setLatestTemperature = function (device, sensorId, value) {
    var record = this.state[device];
    if (typeof record == 'undefined') {
        record = { temperature: [] }
        record.temperature[sensorId] = { latest: value, averages: [] };
    } else {
        if (typeof record.temperature == 'undefined') {
            record.temperature = [];
            record.temperature[sensorId] = { latest: value, averages: [] };
        } else {
            if (typeof record.temperature[sensorId] == 'undefined') {
                record.temperature[sensorId] = { latest: value, averages: [] };
            } else
                record.temperature[sensorId].latest = value;
        }
        let len = record.temperature[sensorId].averages.length;
        if (len == 0) {
            record.temperature[sensorId].averages.push(value);
        } else {
            record.temperature[sensorId].averages.push
                ((record.temperature[sensorId].averages[len-1]*3 + value)/4);
            if (len /*was*/ >= 4) {
                record.temperature[sensorId].averages.shift();
            }
        }
    }
    this.state[device] = record;
}

DeviceState.prototype.setLatestInput = function(device, ip, value) {
    var record = this.state[device];
    if (typeof record == 'undefined') {
      record = {input: []}
      record.input[ip] = value;
    } else {
      if (typeof record.input == 'undefined') {
        record.input = [];
      }
      record.input[ip] = value;
    }
    this.state[device] = record;
}

DeviceState.prototype.setLatestOutput = function(device, op, value) {
  var record = this.state[device];
  if (typeof record == 'undefined') {
    record = {output: [], outputName: []}
    record.output[op] = value;
  } else {
    if (typeof record.output == 'undefined') {
      record.output = [];
    }
    record.output[op] = value;
  }
  this.state[device] = record;
}

DeviceState.prototype.setOutputName = function(device, op, name) {
  var record = this.state[device];
  if (typeof record == 'undefined') {
    record = {output: [], outputName: []}
    record.outputName[op] = name;
  } else {
    if (typeof record.outputName == 'undefined') {
      record.outputName = [];
    }
    record.outputName[op] = name;
  }
  this.state[device] = record;
}

DeviceState.prototype.get = function(DeviceID) {
  console.log(this.state[DeviceID]);
    return this.state[DeviceID];
}

DeviceState.prototype.getLatestTemperature = function(deviceId, sensorId) {
    if (typeof this.state[deviceId] == 'undefined') return undefined;
    if (typeof this.state[deviceId].temperature == 'undefined') return undefined;
    if (typeof this.state[deviceId].temperature[sensorId] == 'undefined') return undefined;
    return this.state[deviceId].temperature[sensorId].latest;
}
DeviceState.prototype.getAverageTemperature = function(deviceId, sensorId) {
    if (typeof this.state[deviceId] == 'undefined') return undefined;
    if (typeof this.state[deviceId].temperature == 'undefined') return undefined;
    let len = this.state[deviceId].temperature[sensorId].averages.length;
    if (len == 0) return undefined;
    return this.state[deviceId].temperature[sensorId].averages[len-1];
}

  DeviceState.prototype.getTemperatureChange = function(deviceId, sensorId) {
    if (typeof this.state[deviceId] == 'undefined') return -999;
    if (typeof this.state[deviceId].temperature == 'undefined') return -998;
    if (typeof this.state[deviceId].temperature[sensorId] == 'undefined') return -997;
    if (typeof this.state[deviceId].temperature[sensorId].averages == 'undefined') return -996;
    let len = this.state[deviceId].temperature[sensorId].averages.length;
    if (len <= 2) return 0;
    // console.log(`temp averages = ${deviceId}, ${sensorId}, ${this.state[deviceId].temperature[sensorId].averages}`);
    return this.state[deviceId].temperature[sensorId].averages[len-1] -
        this.state[deviceId].temperature[sensorId].averages[0];
}
    
DeviceState.prototype.getLatestOutput = function(deviceId, sensorId) {
  if (typeof this.state[deviceId] == 'undefined') return undefined;
  if (typeof this.state[deviceId].output == 'undefined') return undefined;
  return this.state[deviceId].output[sensorId];
}

DeviceState.prototype.getOutputName = function(DeviceID, sensorId) {
  if (typeof this.state[DeviceID] == 'undefined') return undefined;
  if (typeof this.state[DeviceID].outputName == 'undefined') return undefined;
  return this.state[DeviceID].outputName[sensorId];
}

DeviceState.prototype.getOutputId = function(DeviceID, name) {
  if (typeof this.state[DeviceID] == 'undefined') return undefined;
  if (typeof this.state[DeviceID].outputName == 'undefined') return undefined;
  return this.state[DeviceID].outputName.findIndex(n => n === name);
}

DeviceState.prototype.getAttempts = function(DeviceID) {
  if (typeof this.state[DeviceID] == 'undefined') return undefined;
  return this.state[DeviceID].attempts;
}

DeviceState.prototype.findDeviceID = function(name, location) {
  for (DeviceID in this.state) {
    if (/*this.state[DeviceID].physioph && */ this.state[DeviceID].name == name) {
		if (typeof location == 'undefined') return DeviceID; // Return first found if no location
		if (this.state[DeviceID].location == location) return DeviceID;
	}
  };
  return undefined;
}

DeviceState.prototype.deviceList = function() { // List of device Names
  var obj = [];
  for (_o in this.state) {
    obj.push(_o);
  }
  //console.log(obj)
  return obj;
}

DeviceState.prototype.show = function() {
	return JSON.stringify(this.state);
}

DeviceState.prototype.list = function() { // List of all device info
  var obj = [];
  for (_o in this.state) {
    obj[_o] = this.state[_o];
  }
  return obj;
}

exports.DeviceState = new DeviceState()
