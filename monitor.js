var ping = require('./ping');
var utils = require('./utils');

var hosts = config.pingAddresses; // All WiFi Access Points + google
var failures = 0;

function pingNetwork() {
	hosts.forEach(function(host){
	    ping.ping(host, function(delay, isAlive){
	        if (!isAlive) {
	          alarmLog.set(2000, delay, host);
	          utils.notify("Network failure: "+delay, 'Alarm', host, "Ping fail");
	          failures++;
	        }
	    });
	});
}

function pingDb() {
	db.ping(function(err) {
	  if (err) {
	    console.log("pingDb error: %j", err);
	    alarmLog.set(2000, 2, "mySql");
	    utils.notify("DB failure", 'Alarm', "mySql", "Ping fail");
	    failures++;
	  }
	});
}

exports.checkNetwork = function () {
	failures = 0;
	pingNetwork();
	pingDb();
	if (failures > 0) beep.play('./foghorn.wav');
	return failures;
}
