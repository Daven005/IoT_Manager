setTimeout(init, 1500);

function DeviceState () {
	this.state = [];
}

function init() {
	var sqlstr = "SELECT devices.DeviceID AS deviceID, location, devices.name AS deviceName, sensorID, sensors.Name AS sensorName " +
		"FROM devices inner join sensors ON devices.DeviceID = sensors.DeviceID " +
		"WHERE sensors.type = 'Output'";
	db.query(sqlstr, function(err, result) {
		result.forEach(function(r) {
			deviceState.setName(r.deviceID, r.deviceName);
			deviceState.setLocation(r.deviceID, r.location);
			deviceState.setOutputName(r.deviceID, r.sensorID, r.sensorName);
		});
	});
}

DeviceState.prototype.set = function(key, isOnline) {
  try {
    var t = Date.now()
    var record = this.state[key];
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
    this.state[key] = record;
  } catch (err) {
    console.log(err);
    console.log(key);
    console.log(isOnline);
    console.log(record);
  }
}

DeviceState.prototype.setRSSI = function(key, r) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {rssi: r};
    } else {
      record.rssi = r;
      // Leave rest of record alone
    }
    this.state[key] = record;
}

DeviceState.prototype.setName = function(key, r) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {name: r};
    } else {
      record.name = r;
    }
    this.state[key] = record;
}

DeviceState.prototype.setLocation = function(key, r) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {location: r};
    } else {
      record.location = r;
    }
    this.state[key] = record;
}

DeviceState.prototype.setAttempts = function(key, r) {
    var record = this.state[key];
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
    this.state[key] = record;
}

DeviceState.prototype.setAP = function(key, r) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {AP: r};
    } else {
      record.AP = r;
      // Leave rest of record alone
    }
    this.state[key] = record;
}

DeviceState.prototype.setVersion = function(key, ver) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {version: ver};
    } else {
      record.version = ver;
      // Leave rest of record alone
    }
    this.state[key] = record;
}

DeviceState.prototype.setIPaddress = function(key, ip) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {ipAddress: ip};
    } else {
      record.ipAddress = ip;
      // Leave rest of record alone
    }
    this.state[key] = record;
}

DeviceState.prototype.setChannel = function(key, chan) {
    var record = this.state[key];
    if (typeof record == 'undefined') {
      record = {channel: chan};
    } else {
      record.channel = chan;
      // Leave rest of record alone
    }
    this.state[key] = record;
}

DeviceState.prototype.setLatestTemperature = function(device, sensorId, value) {
    var record = this.state[device];
    if (typeof record == 'undefined') {
      record = {temperature: []}
      record.temperature[sensorId] = value;
    } else {
      if (typeof record.temperature == 'undefined') {
        record.temperature = [];
      }
      record.temperature[sensorId] = value;
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

DeviceState.prototype.get = function(key) {
  return this.state[key];
}

DeviceState.prototype.getLatestTemperature = function(key, sensorId) {
  if (typeof this.state[key] == 'undefined') return undefined;
  if (typeof this.state[key].temperature == 'undefined') return undefined;
  return this.state[key].temperature[sensorId];
}

DeviceState.prototype.getLatestOutput = function(key, sensorId) {
  if (typeof this.state[key] == 'undefined') return undefined;
  if (typeof this.state[key].output == 'undefined') return undefined;
  return this.state[key].output[sensorId];
}

DeviceState.prototype.getOutputName = function(key, sensorId) {
  if (typeof this.state[key] == 'undefined') return undefined;
  if (typeof this.state[key].outputName == 'undefined') return undefined;
  return this.state[key].outputName[sensorId];
}

DeviceState.prototype.getOutputId = function(key, name) {
  if (typeof this.state[key] == 'undefined') return undefined;
  if (typeof this.state[key].outputName == 'undefined') return undefined;
  return this.state[key].outputName.findIndex(n => n === name);
}

DeviceState.prototype.getAttempts = function(key) {
  if (typeof this.state[key] == 'undefined') return undefined;
  return this.state[key].attempts;
}

DeviceState.prototype.findDeviceID = function(name, location) {
  for (key in this.state) {
    if (this.state[key].online && this.state[key].name == name) {
		if (typeof location == 'undefined') return key; // Return first found if no location
		if (this.state[key].location == location) return key;
	}
  };
  return undefined;
}

DeviceState.prototype.deviceList = function() {
  var obj = [];
  for (_o in this.state) {
    obj.push(_o);
  }
  //console.log(obj)
  return obj;
}

DeviceState.prototype.show = function() {
	console.log(this);
}

DeviceState.prototype.list = function() {
  var obj = [];
  for (_o in this.state) {
    obj[_o] = this.state[_o];
  }
  return obj;
}

exports.DeviceState = new DeviceState()
