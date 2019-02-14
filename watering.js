fs = require('fs');
weather = require('./weather');
var deviceID;
var currentOutputs = [0, 0, 0, 0, 0];

if (config.watering.enabled) setInterval(checkOutputs, 60*1000);

function checkOutputs() {
	deviceID = deviceState.findDeviceID(config.watering.controllerName, config.watering.controllerLocation);
	if (!deviceID) return;
	var time = new Date();
	var outputs = [0, 0, 0, 0, 0]; // 1...4
	var qtrHour = time.getHours()*4 + Math.floor(time.getMinutes()/15);
	fs.readFile('public/settings.json', (err, data) => {
		try {
			var programmes = JSON.parse(data);
			programmes.forEach((prog) => {
				if (1 <= prog.output && prog.output <= 4) {
					if (prog.start <= qtrHour && qtrHour < prog.end) {
						outputs[prog.output] = 1; // Accumulate all programmes
					}
				}
			});
			outputs.forEach(setOutput);
		} catch(err) {
			console.log("Corrupt programmes %s %s", err.message, data);
		}
	});
}

function setOutput(state, chanl) {
	if (chanl > 0) {
		var topic = `/Raw/${deviceID}/${chanl}/set/output`;
		// console.log("%s ==> %s", topic, state.toString());
		client.publish(topic, state.toString());
	}
}

exports.schedule = function(request, response) {
	response.render("watering");
}

exports.restore = function(request, response) {
	fs.rename('public/settings.bak', 'public/settings.json', (err) => {
		if (err) {
			console.log(err);
			response.end('Error: '+err);
		} else {
			response.end("OK");
		}
	});
}

exports.settings = function(request, response) {
	fs.rename('public/settings.json', 'public/settings.bak', (err) => {
		if (err) {
			console.log(err);
			response.end("Error: "+err);
			return;
		}
		fs.writeFile('public/settings.json', JSON.stringify(request.body), (err) => {
			if (err) {
				console.log(err);
				response.end("Error: "+err);
			} else {
				response.end("OK");
				checkOutputs();
			}
		});
	});	
}

exports.getUpdate = function(request, response) {
	response.json({
		rain: (weather.rainToday > config.watering.likelyRainfall),
		outputs: currentOutputs});
}

exports.update = function(sensorName, state, sensorID) {
	currentOutputs[sensorID] = !state; // Solenoid outputs are inverted
}
