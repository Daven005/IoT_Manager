var login = require('./login');

errorLog.init();
alarmLog.init(); // Don't worry about callbacks

exports.showErrors = function (request, response) {
    function reload() {
        response.render('errors', {
            map: errorLog.map()
        });
    }
    if (request.query.Action == "Delete") {
        if (login.check(request, response)) {
            errorLog.remove(request.query.row);
            reload();
        }
    } else if (request.query.Action == "DeleteAll") {
        if (login.check(request, response)) {
            errorLog.removeAll();
            reload();
        }
    } else if (request.query.Action == "Read") {
        errorLog.read(() => { reload(); });
    } else if (request.query.Action == "Save") {
        errorLog.save(() => { reload(); });
    } else if (request.query.Action == "Sort") {
        response.render('errors', {
            map: errorLog.sort(request.query.Direction, request.query.Column)
        });
    } else {
        reload();
    }
}

exports.showMobileErrors = function (request, response) {
    if (request.query.row) {
        if (login.check(request, response)) {
            errorLog.remove(request.query.row);
            response.render('mobileErrors', {
                map: errorLog.mapFmt(),
                type: 'Error',
                loggedIn: request.loggedIn
            });
        }
    } else {
        response.render('mobileErrors', {
            map: errorLog.map(),
            type: 'Error',
            loggedIn: request.loggedIn
        });
    }
}

exports.showAlarms = function (request, response) {
    function reload() {
        response.render('alarms', {
            map: alarmLog.map()
        });
    }
    if (request.query.Action == "Delete") {
        if (login.check(request, response)) {
            alarmLog.remove(request.query.row);
            reload();
        }
    } else if (request.query.Action == "DeleteAll") {
        if (login.check(request, response)) {
            alarmLog.removeAll();
            reload();
        }
    } else if (request.query.Action == "Read") {
        alarmLog.read(() => { reload(); });
    } else if (request.query.Action == "Save") {
        alarmLog.save(() => { reload(); });
    } else if (request.query.Action == "Sort") {
        response.render('alarms', {
            map: alarmLog.sort(request.query.Direction, request.query.Column)
        });
    }
}

exports.showMobileAlarms = function (request, response) {
    function reload() {
        response.render('mobileErrors', {
            map: alarmLog.mapFmt(),
            type: 'Alarm',
            loggedIn: request.loggedIn
        });
    }
    if (request.query.Action == "Delete") {
        if (login.check(request, response)) {
            alarmLog.remove(request.query.row);
        }
    } else if (request.query.Action == "Save") {
        alarmLog.save(() => {
            reload();
        });
    } else {
        reload();
    }
}