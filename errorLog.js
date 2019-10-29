var moment = require('moment');
var fs = require('fs');
var fileName = 'ERRORS.js';
var errorList = [];
var lastUpdate = -1;
var errorDescriptions = [];

exports.init = function (cb) {
    var sqlstr = "SELECT device, number, info, description FROM errorDescriptions WHERE type='error'"
    db.query(sqlstr, function (err, result) {
        if (err) {
            console.log("init errorLog %j, %s", err, sqlstr);
            console.log(db);
            return;
        }
        result.forEach(function (descr) {
            errorDescriptions.push({
                device: descr.device,
                number: descr.number,
                info: descr.info,
                description: descr.description
            });
        });
        // console.log(errorDescriptions);
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
                        if (data.length > 0 && data[0] == '[') {
                            errorList = JSON.parse(data);
                        }
                        lastUpdate = errorList.length - 1;
                        //console.log(errorList);
                        //console.log("%d Errors reloaded", lastUpdate);
                        if (cb) cb();
                    }
                });
            } else {
                if (cb) cb();
            }
        });
    } catch (ex) {
        console.log("Error reading errorlog %j", ex);
    }
}

exports.set = function (error, info, device, location) { // Returns true if new error

    function matchError(el, idx) {
        if (el.number != error) return false;
        if (el.device != device && el.device != "") return false;
        if (el.info == -1) { matchIdx = idx; return true; }
        if (el.info == -2) { matchIdx = idx; return true; }
        if (el.info != info) return false;
        matchIdx = idx;
        return true;
    }
    try {
        var matchIdx = -1;
        var matchInfo = -1;
        var e = {
            error: error,
            info: info,
            count: 1,
            device: device,
            location: location,
            first: Date.now(),
            last: Date.now()
        };
        var found = errorDescriptions.find(matchError);
        if (!found) {
            console.log("No matching error description for: ", device, error, info);
        } else {
            e.description = found.description;
            matchInfo = errorDescriptions[matchIdx].info;
        }
        for (el in errorList) {
            if (errorList[el].error == error && errorList[el].device == device) {
                if (errorList[el].info == info || matchInfo == -2) {
                    // Don't record separate error where info matches OR errorDescriptions has info as -2
                    errorList[el].last = Date.now();
                    errorList[el].info = info; // Record last info when errorDescriptions[].info == -2
                    errorList[el].count += 1;
                    lastUpdate = el;
                    return false;
                }
            }
        }
        lastUpdate = errorList.push(e) - 1;
        return true;
    } catch (e) {
        console.log(e);
    }
    return false;
}

exports.get = function (key) {
    return errorList[key];
}

exports.getLast = function () {
    if (lastUpdate >= 0)
        return errorList[lastUpdate];
    else
        return null;
}

exports.removeAll = function (key) {
    errorList = [];
    lastUpdate = -1;
}

exports.remove = function (key) {
    errorList.splice(key, 1);
}

exports.map = function () {
    var obj = [];
    for (_o in errorList) {
        obj[_o] = errorList[_o];
    }
    return obj;
}

exports.sort = function (direction, column) {
    var obj = [];
    var func;

    function errorAsc(el1, el2) {
        if (el1.error == el2.error) {
            return el1.info - el2.info
        }
        return el1.error - el2.error;
    }

    function errorDesc(el1, el2) {
        if (el1.error == el2.error) {
            return el2.info - el1.info
        }
        return el2.error - el1.error;
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
        case "error":
            if (direction == "Asc") func = errorAsc;
            else func = errorDesc;
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
            return errorList;
    }
    for (_o in errorList) {
        obj[_o] = errorList[_o];
    }
    obj.sort(func);
    //console.log("Sorted: %j", obj);
    return obj;
}

exports.save = function (cb) {
    fs.writeFile(fileName, JSON.stringify(errorList), function (err) {
        if (err) {
            console.log(err);
        } else {
            if (cb) cb();
        }
    });
}

exports.mapFmt = function () {
    return errorList;
}