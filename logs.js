var login = require('./login');

exports.showErrors = function(request, response) {
  if (request.query.Action == "Delete") {
    if (login.check(request, response)) {
      errorLog.remove(request.query.row);
    } else return;
  } else if (request.query.Action == "DeleteAll") {
    if (login.check(request, response)) {
      errorLog.removeAll();
    } else return;
  } else if (request.query.Action == "Read") {
    errorLog.read();
  } else if (request.query.Action == "Save") {
    errorLog.save();
  } else if (request.query.Action == "Sort") {
    response.render('errors', {map: errorLog.sort(request.query.Direction, request.query.Column)});
    return;
  }
  response.render('errors', {map: errorLog.map()});
}

exports.showMobileErrors = function(request, response) {
  var errorStr = "";

  if (request.query.row) {
    if (login.check(request, response)) {
      errorLog.remove(request.query.row);
      response.render('mobileErrors', {map: errorLog.mapFmt(), type:'Error', loggedIn: request.loggedIn});
    }
  } else {
    response.render('mobileErrors', {map: errorLog.mapFmt(), type:'Error', loggedIn: request.loggedIn});
  }
}

exports.showAlarms = function(request, response) {
  if (request.query.Action == "Delete") {
    if (login.check(request, response)) {
      alarmLog.remove(request.query.row);
    }
  } else if (request.query.Action == "DeleteAll") {
    if (login.check(request, response)) {
      alarmLog.removeAll();
    }
  } else if (request.query.Action == "Read") {
    alarmLog.read();
  } else if (request.query.Action == "Save") {
    alarmLog.save();
  } else if (request.query.Action == "Sort") {
    response.render('alarms', {map: alarmLog.sort(request.query.Direction, request.query.Column)});
    return;
  }
  response.render('alarms', {map: alarmLog.map()});
}

exports.showMobileAlarms = function(request, response) {
  if (request.query.Action == "Delete") {
    if (login.check(request, response)) {
      alarmLog.remove(request.query.row);
    }
  } else if (request.query.Action == "Save") {
    alarmLog.save();
  }
  response.render('mobileErrors', {map: alarmLog.mapFmt(), type:'Alarm', loggedIn: request.loggedIn});
}
