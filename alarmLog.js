var moment = require('moment');
var fs = require('fs');
var fileName = 'ALARMS.js';
var alarmList = [];
var lastUpdate = -1;
var alarmDescriptions = [];

exports.init = function (cb) {
    var sqlstr = "SELECT device, number, info, description FROM errorDescriptions WHERE type='alarm'"
    db.query(sqlstr, function (err, result) {
        if (err) {
            console.log("init errorLog %j, %s", err, sqlstr);
            console.log(db);
            return;
        }
        result.forEach(function (descr) {
            alarmDescriptions.push({
                device: descr.device,
                number: descr.number,
                info: descr.info,
                description: descr.description
            });
        });
        // console.log(alarmDescriptions);
        if (cb) cb();
    });
}

exports.read = function (cb) {
    try {
        fs.exists(fileName, function (exists) {
            if (exists) {
                fs.readFile(fileName, 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data.length && data[0] == '[') {
                            alarmList = JSON.parse(data);
                        }
                        lastUpdate = alarmList.length - 1;
                        //console.log("%d Alarms reloaded", lastUpdate);
                    }
                    if (cb) cb();
                });
            } else {
                if (cb) cb();
            }
        });
    } catch (ex) {
        console.log("Error reading alarmlog %j", ex);
    }
}

exports.mapFmt = function () {
    return alarmList;
}

exports.set = function (alarm, info, device, location) { // Returns true if new alarm
    
    function matchAlarm(el, idx) {
        if (el.device != device) return false;
        if (el.number != alarm) return false;
        if (el.info == -1) { matchIdx = idx; return true; }
        if (el.info == -2) { matchIdx = idx; return true; }
        if (el.info != info) return false;
        matchIdx = idx;
        return true;
    }
    try {
        var matchIdx = -1;
        var matchInfo = -1;
        var a = {
            alarm: alarm,
            info: info,
            count: 1,
            device: device,
            location: location,
            first: Date.now(),
            last: Date.now()
        }
        var found = alarmDescriptions.find(matchAlarm);
        if (!found) {
            console.log("No matching alarm description for: ", device, alarm, info);
        } else {
            a.description = found.description;
            matchInfo = alarmDescriptions[matchIdx].info;
        }
        for (el in alarmList) {
            if (alarmList[el].alarm == alarm && alarmList[el].device == device) {
                if (alarmList[el].info == info || matchInfo == -2) {
                    // Don't record separate alarm where info matches OR alarmDescriptions has info as -2
                    alarmList[el].last = Date.now();
                    alarmList[el].info = info; // Record last info when alarmDescriptions[].info == -2
                    alarmList[el].count += 1;
                    lastUpdate = el;
                    return false;
                }
            }
        }

        lastUpdate = alarmList.push(a) - 1;
        return true;
    } catch (e) {
        console.error(`Can't set alarm ${alarm}, ${e}`);
    }
    return false;
}

exports.get = function (key) {
    return alarmList[key];
}

exports.getLast = function () {
    if (lastUpdate >= 0)
        return alarmList[lastUpdate];
    else
        return null;
}

exports.remove = function (key) {
    alarmList.splice(key, 1);
}

exports.removeAll = function () {
    alarmList = [];
    lastUpdate = -1;
}

exports.map = function () {
    var obj = [];
    for (_o in alarmList) {
        obj[_o] = alarmList[_o];
    }
    return obj;
}

exports.sort = function (direction, column) {
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
            if (direction == "Asc") func = alarmAsc;
            else func = alarmDesc;
            break;
        case "count":
            if (direction == "Asc") func = countAsc;
            else func = countDesc;
            break;
        case "last":
            if (direction == "Asc") func = lastUpdatedAsc;
            else func = lastUpdatedDesc;
            break;
        case "device":
            if (direction == "Asc") func = deviceAsc;
            else func = deviceDesc;
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

exports.save = function (cb) {
    fs.writeFile(fileName, JSON.stringify(alarmList), function (err) {
        if (err) {
            console.log(err);
        }
        if (cb) cb();
    });
}