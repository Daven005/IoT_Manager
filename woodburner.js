var heating = require('./heating');

var WBtopTemp = -99.0;
var TSbottomTemp = -99.0;

exports.checkWB_Top = function(sensorName, temperature) {
	if (sensorName != config.woodburner.WBtopName) return false;
	
	WBtopTemp = temperature;
	if (temperature > config.woodburner.overheatOn) {
		heating.setEmergencyOverride('2:00:00', 28);
	} else if (temperature < config.woodburner.overheatOff) {
		heating.clearEmergencyOverride();
	}
	if (temperature > config.woodburner.supplyOn) {
		if (!checkRelativeTemps()) {
			client.publish(supplyControlTopic(), "1");
			console.log("Woodburner check+ %d", temperature)
		}
	} else if (temperature < config.woodburner.supplyOff)  {
		client.publish(supplyControlTopic(), "0");
		// console.log("Woodburner check- %d",  temperature)
	}
	return true;
}

exports.checkTS_Bottom = function(sensorName, temperature) {
	if (sensorName != config.woodburner.TSbottomName) return false;
	
	TSbottomTemp = temperature;
	checkRelativeTemps();
	return true;
}

function checkRelativeTemps() {
	if (!temperaturesValid()) return false;
	
	if (WBtopTemp < TSbottomTemp) {
		console.log("Woodburner check<");
		client.publish(supplyControlTopic(), "0");
		return true;
	}
	return false;
}

function supplyControlTopic() {
	var supplyDeviceID = deviceState.findDeviceID(config.woodburner.supplyName, config.woodburner.supplyLocation);
	var op = deviceState.getOutputId(supplyDeviceID, config.woodburner.supplyOp)-20;
	// if (op == 4 || op == 7) console.trace('supplyControlTopic');
	return `/Raw/${supplyDeviceID}/${op}/set/output`;
}

function temperaturesValid() {
	if (TSbottomTemp < 0.0) return false;
	if (WBtopTemp < 0.0) return false;
	return true;
}
