var moment = require('moment');
var fs = require('fs');
var fileName = 'ALARMS.js';
var alarmList = [];
var lastUpdate = -1;

exports.read = function () {
  try {
    fs.exists(fileName, function(exists) {
      if (exists) {
        fs.readFile(fileName, 'utf8', function(err, data) {
          if (err) {
            console.log(err);
          } else {
            if (data.length && data[0] =='[') {
              alarmList = JSON.parse(data);
            }
            lastUpdate = alarmList.length-1;
            //console.log("%d Alarms reloaded", lastUpdate);
          }
        });
      }
    });
  } catch (ex) {
    console.log("Error reading alarmlog %j", ex);
  }
}

exports.mapFmt = function() {
  return alarmList;
}

exports.set = function(alarm, info, device) { // Returns true if new alarm
  try {
    for (el in alarmList) {
      if (alarmList[el].alarm == alarm && alarmList[el].info == info && alarmList[el].device == device) {
        alarmList[el].last = Date.now();
        alarmList[el].count += 1;
        lastUpdate = el;
	      return false;
      }
    }
    var e = {alarm: alarm, info: info, count:1, device: device, first: Date.now(), last:Date.now()}
    lastUpdate = alarmList.push(e)-1;
    return true;
  } catch(e) {
      console.log("Can't set alarm %d, %j", alarm, e);
  }
  return false;
}

exports.get = function(key) {
  return alarmList[key];
}

exports.getLast = function() {
  if (lastUpdate >= 0)
    return alarmList[lastUpdate];
  else
    return null;
}

exports.remove = function(key) {
  alarmList.splice(key,1);
}

exports.removeAll = function(key) {
  alarmList = [];
  lastUpdate = -1;
}

exports.map = function() {
  var obj = [];
  for (_o in alarmList) {
    obj[_o] = alarmList[_o];
  }
  return obj;
}

exports.sort = function(direction, column) {
  var obj = [];
  var func;
  function alarmAsc(el1, el2) {
    if (el1.alarm == el2.alarm) {
      return el1.info - el2.info
    }
    return el1.alarm - el2.alarm;
  }
  function alarmDesc(el1, el2) {
    if (el1.alarm == el2.alarm) {
      return el2.info - el1.info
    }
    return el2.alarm - el1.alarm;
  }
  function countAsc(el1, el2) {
    return el1.count - el2.count;
  }
  function countDesc(el1, el2) {
    return el2.count - el1.count;
  }
  function lastUpdatedAsc(el1, el2) {
    return el1.last - el2.last;
  }
  function lastUpdatedDesc(el1, el2) {
    return el2.last - el1.last;
  }
  function deviceAsc(el1, el2) {
    return el1.device.localeCompare(el2.device);
  }
  function deviceDesc(el1, el2) {
    return -el1.device.localeCompare(el2.device);
  }
  switch (column) {
  case "alarm":
    if (direction == "Asc") func = alarmAsc; else func = alarmDesc;
    break;
  case "count":
    if (direction == "Asc") func = countAsc; else func = countDesc;
    break;
  case "last":
    if (direction == "Asc") func = lastUpdatedAsc; else func = lastUpdatedDesc;
    break;
  case "device":
    if (direction == "Asc") func = deviceAsc; else func = deviceDesc;
    break;
  default:
    console.log("Bad column %s", column);
    return alarmList;
  }
  for (_o in alarmList) {
    obj[_o] = alarmList[_o];
  }
  obj.sort(func);
  //console.log("Sorted: %j", obj);
  return obj;
}

exports.save = function() {
  fs.writeFile(fileName, JSON.stringify(alarmList), function(err) {
    if (err) {
      console.log(err);
    }
  });
}
