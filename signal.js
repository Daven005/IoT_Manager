var login = require('./login');
exports.gate = function(request, response) {
  if (request.query.Action == "Open / Close Gate") {
    if (login.check(request, response)) {
      client.publish("/Raw/Holliesf909a3/1/set/gate", "");
    }
  }
  response.render('signalGate', {loggedIn: request.loggedIn});
}

exports.socket = function(request, response) {
  if (login.check(request, response)) {
    if (request.query.s2 == "ON") {
      client.publish("/Raw/Holliesf909a3/2/set/socket", "0");
    } else if (request.query.s2 == "OFF") {
      client.publish("/Raw/Holliesf909a3/2/set/socket", "1");
    } else if (request.query.s3 == "OFF") {
      client.publish("/Raw/Holliesf909a3/3/set/socket", "0");
    } else if (request.query.s3 == "ON") {
      client.publish("/Raw/Holliesf909a3/3/set/socket", "1");
    } else if (request.query.ext1 == "OFF") {
      client.publish("/Raw/Hollies95c701/1/set/output", "0");
    } else if (request.query.ext1 == "ON") {
      client.publish("/Raw/Hollies95c701/1/set/output", "1");
    } else if (request.query.son2 == "OFF") {
      client.publish("/Raw/Hollies95de2a/1/set/output", "0");
    } else if (request.query.son2 == "ON") {
      client.publish("/Raw/Hollies95de2a/1/set/output", "1");
    }
  }
  response.render('signalSocket', {loggedIn: request.loggedIn});
}

exports.manual = function(request, response) {
  response.render('signalManual', {loggedIn: request.loggedIn});
}