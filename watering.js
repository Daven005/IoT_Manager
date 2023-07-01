fs = require('fs');
weather = require('./weather');
//NB moment is global
var deviceID1, deviceID2;
var currentOutputs = [0, 0, 0, 0, 0, 0, 0, 0, 0];

if (config.watering.enabled) setInterval(checkOutputs, 60 * 1000);

exports.checkOutputs = checkOutputs;
function checkOutputs() {
	function checkActive(prog) {
		let startTime = moment().startOf('day').format('DD-MM-YYYY') + ' ' + moment(prog.start, "HH:mm").format('HH:mm');
		let endTime = moment(startTime, 'DD-MM-YYYY HH:mm').add(prog.duration, 'minutes');
		return moment().isBetween(moment(startTime, 'DD-MM-YYYY HHmm'), endTime);
	}

	if (config.debug){
		deviceID1 = 'Test01234';
		deviceID2 = 'Test01235';
  } else {
		deviceID1 = deviceState.findDeviceID(config.watering.controller1.Name, config.watering.Location);
		deviceID2 = deviceState.findDeviceID(config.watering.controller2.Name, config.watering.Location);}
	if (!deviceID1) return;

	fs.readFile('public/settings.json', (err, data) => {
		try {
			var programmes = JSON.parse(data);
			currentOutputs = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			programmes.forEach((prog) => {
				let isActive = false; // NB value transmitted is 0 or 1
				if (1 <= prog.zone && prog.zone <= 8) {
					switch (prog.mode) {
					case 'On': isActive = true; break;
					case 'Off': break;
					case 'Auto': 
						isActive = checkActive(prog);
						if (prog.checkRain && (weather.rainToday > config.watering.likelyRainfall)) {
							isActive = false; // Don't water if enough rain
						}
						break;
					}
				} else { console.log(`Bad prog ${prog}`); }
				if (isActive) currentOutputs[prog.zone] = 1 // Accumulate all programmes
			});
			console.log(`Watering: ${currentOutputs}`);
			currentOutputs.forEach(setOutput);
		} catch (err) {
			console.log("Corrupt programmes %s %s", err.message, data);
		}
	});
}

function setOutput(state, chanl) {
  var topic;
	if (1 <= chanl && chanl <= 4) {
		topic = `/Raw/${deviceID1}/${chanl}/set/output`; // 1-4
  } else if (5 <= chanl && chanl <= 8) {
		topic = `/Raw/${deviceID2}/${chanl-5}/set/output`; // -> 0-3
  } else {
    return;
  }
  if (config.debug)
    console.log("%s ==> %s", topic, state.toString());
  else { 
    // console.log("%s ==> %s", topic, state.toString())
    client.publish(topic, state.toString())
  };
}

exports.schedule = function (request, response) {
	fs.readFile('public/settings.json', "utf8", (err, data) => {
		try {
			response.render("wateringMobile", { map: JSON.parse(data), menu: false });
		} catch (ex) {
			response.render("wateringMobile", { error: ex.message });
		}
	});
}

exports.mobileSchedule = function (request, response) {
	fs.readFile('public/settings.json', "utf8", (err, data) => {
		try {
			response.render("wateringMobile", { map: JSON.parse(data), menu: true });
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
