var dgram = require('dgram');
var freeport = require('freeport');
var network = require('network');
var http = require('http');

var udpServer = dgram.createSocket('udp4');
var TLcList = config.TLc.list;

var enqTimer = null;
var enqBroadcastCb = null;
var broadcastAddress;
var refreshCompleteCb;
var controlState = 'Auto';

exports.init = init;
exports.send = send;
exports.rqInfo = rqInfo;
exports.control = control;
exports.trigger = trigger;
exports.setChannel = setChannel;
exports.showScene = showScene;
exports.refresh = refresh;
exports.list = list;
exports.state = state;
exports.checkTLcs = checkTLcs;

udpServer.on('message', udpServerMessageFunc);

function enqTimeoutCb() {
  TLcList.forEach(function (t) { // Deal with TLcs going offline
    if (!t.online) t.ip = null;
  });
  if (enqBroadcastCb) enqBroadcastCb();
  enqBroadcastCb = null;
}

function udpServerMessageFunc(message, remote) {
  var response = JSON.parse(message);
  console.log("UDP msg: %j", response);
  if (response.TLc) {
    var tlc = getTLc(response.TLc);
    if (tlc) {
      tlc.IPaddress = response.IPaddress;
      tlc.Version = response.Version.Major.toString()+'.'+response.Version.Minor.toString();
      tlc.online = true;
      tlc.errors = [];
      if (response.Errors) {
        response.Errors.forEach( (err) => { tlc.errors.push(err); });
      }
      if (enqTimer) {
        clearTimeout(enqTimer);
      }
      enqTimer = setTimeout(enqTimeoutCb, 500);
    } else {
      console.log("TLc %j not in TLcList", response.TLc);
    }
  } else if (response.OSC) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    var parts = response.OSC[0].split('-');
    if (parts[1] == 'Fader') {
      if (refreshCompleteCb) {
        refreshCompleteCb(parts[0], response.args[0]);
      }
    }
  } else {
    console.log("udpServerMessageFunc: %j", response);
  }
}

function broadcast(address, str) {
  var bfr = new Buffer.from(str);
  
  console.log("tlc:-> %s", str);
  udpServer.setBroadcast(true);
  udpServer.send(bfr, 0, bfr.length, config.TLc.udp_port, address, function(err, bytes) {
    if (err) {
      console.log("Broadcast error: %j", err);
    }
  });
}

function init(initDone) {
  enqBroadcastCb = initDone;
  freeport(function(err, port) {
    network.get_interfaces_list(function(err, list) {
      var i;
      for (i=0; i<list.length; i++) {
        if (list[i].type == 'Wired') {
          udpServer.bind(port, list[i].ip_address, function () {
            var address = udpServer.address();
            var p = address.address.split('.');
            broadcastAddress = p[0]+'.'+p[1]+'.'+p[2]+'.255';
            
            console.log('UDP udpServer listening on ' + address.address + ":" + address.port);
            broadcast(broadcastAddress, '{"enq":"TLc"}');
            enqTimer = setTimeout(enqBroadcastCb, 1000); // Allow longer time for initial response
          });
        }
        return;
      }
      console.log("No wired interface available");
    });
  });
}

function checkTLcs(cb) {
	if (enqBroadcastCb) return; // Already doing it
	enqBroadcastCb = cb;
	TLcList.forEach(function (t) {
		t.online = false;
	});
	broadcast(broadcastAddress, '{"enq":"TLc"}');
}

function rqInfo(tlc, info, cb, param) {
  var options = {
    timeout: 1000,
    host: getTLc(tlc).IPaddress,
    port: config.TLc.http_port,
  };

  options.path = '/'+info+'?serialNo='+getTLc(tlc).serNo
  if (param) {
    options.path += '&'+param;
  }
  // console.log("rqInfo: %j", options);
  var req = http.get(options, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      var obj = {};
      try {
        obj.data = JSON.parse(data); // Must be in try/catch
        if (!obj.data.result) { // NB reponse is EITHER a result code (+info) or the data
          obj.error = false;
        } else {
          obj.error = true;
          obj.info = "Rq returned false, info: "+data;
          //console.log("rqInfo Error %j, options %j", obj, options);
        }
      } catch(ex) {
        obj.error = true;
        obj.info = "Bad JSON: "+data;
        //console.log("rqInfo catch %s %j", data, options);
      }
      obj.reqInfo = info;
      obj.tlc = tlc;
      cb(obj);
    });
  });
  req.on('error', function(e) {
    console.log("rqInfo error: %j", e);
    cb({error: true, info: e.message, reqInfo: info, tl: tlc});
    if (!enqBroadcastCb) { // No enqBroadcastCb in progress
		checkTLcs(function() {
			console.log("Rechecked TLc IP addresses");
		});
	}
  });
}

function control(state) {
  switch (state) {
  case "Auto":
  case "Dark":
  case "Light":
    controlState = state;
  }
}

function state() {
  return controlState;
}

function isLight() {
  var times;
  var now = new Date();
  switch (controlState) {
  case "Auto":
    times = sunCalc.getTimes(now, config.latitude, config.longitude);
    if (now >= times.sunset || now <= times.sunrise) {
      return false;
    }
    return true;
  case "Dark":
    return false;
  case "Light":
    return true;
  }
  return true;
}

function trigger(tlc, area, channel, state, filter) {
  var msg;
  var val = (state == 'on') ? 255 : 0;
  if (filter) {
    if (isLight()) return;
  }
  msg = `{"OSC":["${area}-Fader","${channel}"],"args":[${val}]}`
  send(tlc, msg);
}

function setChannel(tlc, area, channel, val) {
  var msg;
  if (val<0) val = 0;
  if (val>255) val = 255;
  msg = `{"OSC":["${area}-Fader","${channel}"],"args":[${val}]}`
  send(tlc, msg);
}

function showScene(tlc, scene) {
  send(tlc, `{"OSC":["Area-Scene","${scene}"],"args":[1]}`);
};

function refresh(tlc, area, channel, cb) {
  console.log("refresh: %j %s-%s", tlc, area, channel);
  refreshCompleteCb = cb;
  send(tlc, `{"OSC":["Refresh Fader-${area}","${channel}"],"args":[1]}`);
};

function send(tlc, str) {
  var bfr = new Buffer.from(str);
  var tlcObj = getTLc(tlc)
  if (tlcObj) {
	  var ip = tlcObj.IPaddress.replace(/\.0/g, '.').replace(/\.0/g, '.');
	  console.log("%s=>%s %s", tlc, str, ip);
	  udpServer.send(bfr, 0, bfr.length, config.TLc.udp_port, ip, function(err, bytes) {
		if (err) {
		  console.log("tlc send error: %j", err);
		}
	  });
  } else {
	  console.log("TLc %j not online", tlc);
  }	
}

function getTLc(tlc) {
  var i;
  for (i=0; i< TLcList.length; i++) {
    if (TLcList[i].Name == tlc) {
      return TLcList[i];
    }
  }
  console.log("%j is not defined", tlc);
  return undefined;
}

function list() {
  return TLcList;
}
