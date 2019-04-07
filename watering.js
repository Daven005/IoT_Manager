fs = require('fs');
weather = require('./weather');
//NB moment is global
var deviceID;
var currentOutputs = [0, 0, 0, 0, 0];

if (config.watering.enabled) setInterval(checkOutputs, 60 * 1000);

exports.checkOutputs = checkOutputs;
function checkOutputs() {
	if (config.debug)
		deviceID = 'Test01234';
	else
		deviceID = deviceState.findDeviceID(config.watering.controllerName, config.watering.controllerLocation);
	if (!deviceID) return;

	function checkActive(prog) {
		let startTime = moment().startOf('day').format('DD-MM-YYYY') + ' ' + moment(prog.start, "HH:mm").format('HH:mm');
		let endTime = moment(startTime, 'DD-MM-YYYY HH:mm').add(prog.duration, 'minutes');
		return moment().isBetween(moment(startTime, 'DD-MM-YYYY HHmm'), endTime);
	}

	fs.readFile('public/settings.json', (err, data) => {
		try {
			var programmes = JSON.parse(data);
			currentOutputs = [0,0,0,0,0];
			programmes.forEach((prog) => {
				let isActive = false; // NB value transmitted is 0 or 1
				if (1 <= prog.zone && prog.zone <= 4) {
					switch (prog.mode) {
						case 'On': isActive = true; break;
						case 'Off': break;
						case 'Auto': isActive = checkActive(prog); break;
					}
					if (prog.checkRain && (weather.rainToday > config.watering.likelyRainfall)) {
						isActive = false; // Don't water if enough rain
					}
					if (isActive) currentOutputs[prog.zone] = 1 // Accumulate all programmes
				} else {
					console.log(`Bad prog ${prog}`);
				}
			});
			console.log(`Watering: ${outputs}`);
			outputs.forEach(setOutput);
		} catch (err) {
			console.log("Corrupt programmes %s %s", err.message, data);
		}
	});
}

function setOutput(state, chanl) {
	if (chanl > 0) {
		var topic = `/Raw/${deviceID}/${chanl}/set/output`;
		if (config.debug)
			console.log("%s ==> %s", topic, state.toString());
		else
			client.publish(topic, state.toString());
	}
}

exports.schedule = function (request, response) {
	response.render("watering");
}

exports.mobileSchedule = function (request, response) {
	fs.readFile('public/settings.json', "utf8", (err, data) => {
		try {
			response.render("wateringMobile", { map: JSON.parse(data) });
		} catch (ex) {
			response.render("wateringMobile", { error: ex.message });
		}
	});
}

exports.settings = function (request, response) {
	const fileName = 'public/settings';
	const getData = (fileName) => {
		return new Promise((resolve, reject) => {
			fs.readFile(fileName + '.json', "utf8", (err, data) => {
				if (err) reject(err);
				try {
					var settings = JSON.parse(data);
					if (Array.isArray(settings))
						resolve(settings);
					else
						reject(`${fileName}.json not an array: ${typeof settings}`)
				} catch (err) {
					reject(err);
				}
			})
		});
	};
	const rename = (fileName, settings) => {
		return new Promise((resolve, reject) => {
			fs.rename(fileName + '.json', fileName + '.bak', (err) => {
				return err ? reject(err) : resolve(settings);
			})
		});
	};
	const putData = (fileName, settings) => {
		return new Promise((resolve, reject) => {
			fs.writeFile(fileName + '.json', JSON.stringify(settings), (err) => {
				return err ? reject(err) : resolve();
			})
		});
	};

	getData(fileName)
		.then((settings) => {
			var newSetting = request.body.programme;
			var id = parseInt(request.body.id);
			if (request.body.action == "update") {
				settings[id] = newSetting;
			} else if (request.body.action == "delete") {
				settings.splice(id, 1);
			} else if (request.body.action == "add") {
				settings.push(newSetting);
			}
			// console.log(`Updated settings ${JSON.stringify(settings)}`);
			return rename(fileName, settings);
		})
		.then((settings) => { // Rename OK
			return putData(fileName, settings);
		})
		.then(() => {
			response.status(200).json({ OK: true });
			checkOutputs();
		})
		.catch((err) => {
			console.log(`Update settings error: ${err}`);
			response.status(500).json({ error: err.message });
		});
}

exports.getUpdate = function (request, response) {
	response.json({
		rain: (weather.rainToday > config.watering.likelyRainfall),
		outputs: currentOutputs
	});
}

exports.update = function (sensorName, state, sensorID) { // From /App message
	currentOutputs[sensorID] = !state; // Solenoid outputs are inverted
}
