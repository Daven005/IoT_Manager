var login = require('./login');
var sse = require('sse-node');
var sseClient;
const ISOPEN = 4;
const CLOSING = 2;
const OPENING = 1;
var states = ["closed", "opening", "closing", "error", "open", "opening", "closing", "error"];
var gateState = 7;
var deviceName = "";

exports.operate = function(request, response) {
  var deviceID = deviceState.findDeviceID(deviceName);
  if (deviceID) {
    if (login.check(request, response)) {
      client.publish("/Raw/"+deviceID+"/set/gate", "1000");
    }
  } else {
    console.log("Can't find '"+deviceName+"'", deviceName);
  }
  response.end("OK");
 }

exports.monitor = function(request, response) {
  response.render("gate", {loggedIn: request.loggedIn});
}

exports.monitorMobile = function(request, response) {
  response.render("gateMobile", {loggedIn: request.loggedIn});
}

exports.sse = function(request, response) {
  sseClient = sse(request, response, {ping:30000});
  sseClient.send(states[gateState]);
  console.log("Hi Gate client");
  sseClient.onClose(() => {console.log("Bye Gate client");});
}

function setMask(state, mask) {
  if (state) gateState |= mask; else gateState &= ~mask;
}

exports.sendAlert = function(sensor, state, device) {
  deviceName = device;
  switch (sensor) {
  case "isOpen": setMask(state, ISOPEN); break;
  case "closing": setMask(state, CLOSING); break;
  case "opening": setMask(state, OPENING); break;
  }
  if (sseClient) {
    sseClient.send(states[gateState]);
    //console.log("%s Sensor: %s, state: %d, gateState: %d %s", device, sensor, state, gateState, states[gateState]);
  }
}
