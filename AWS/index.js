'use strict';
var http = require("http");
var querystring = require('querystring');
const debug = false;
const dynDNS = "mooo.com";

function log(title, msg) {
    if (debug) console.log(`[${title}] ${msg}`);
}

function generateMessageID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateResponse(name, namespace, payload) {
    return {
        header: {
            messageId: generateMessageID(),
            name: name,
            namespace: namespace,
            payloadVersion: '3',
        },
        payload: payload,
    };
}

function decodeHeatingDevices(obj) {
    var devices = [];
    var capablities = [{
        type: "AlexaInterface",
        interface: "Alexa.ThermostatController",
        version: "3",
        properties: {
            supported: [{
                "name": "targetSetpoint"
            },
            {
                "name": "thermostatMode"
            }
            ],
            proactivelyReported: false,
            retrievable: true
        },
        configuration: {
            supportsScheduling: true,
            supportedModes: [
                "HEAT",
                "AUTO"
            ]
        }
    },
    {
        type: "AlexaInterface",
        interface: "Alexa.TemperatureSensor",
        version: "3",
        properties: {
            supported: [{
                name: "temperature"
            }],
            proactivelyReported: false,
            retrievable: true
        }
    }
    ];
    obj.forEach(function (zone) {
        if (zone.Name != 'Any Radiator') {
            var displayCategories = ['THERMOSTAT', "TEMPERATURE_SENSOR"];
            var endpoint = {};
            endpoint.endpointId = 'H' + zone.ID;
            endpoint.friendlyName = zone.Name + ((zone.MasterZone == 0 || zone.MasterZone == zone.ID) ? ' underfloor' : ' radiator');
            endpoint.description = "touchHeat Override";
            endpoint.manufacturerName = 'touchHeat';
            endpoint.displayCategories = displayCategories;
            endpoint.cookie = zone;
            endpoint.capabilities = capablities;
            devices.push(endpoint);
        }
    });

    return devices;
}

function decodeLightingDevices(obj) {
    var devices = [];
    var capablities = [{
        type: "AlexaInterface",
        interface: "Alexa.PowerController",
        version: "3",
        properties: {
            supported: [{
                name: "powerState"
            }],
            proactivelyReported: false,
            retrievable: false
        }
    }];
    var sceneCapablities = [{
        type: "AlexaInterface",
        interface: "Alexa.SceneController",
        version: "3",
        supportsDeactivation: false,
        proactivelyReported: false
    }];
    for (var name in obj) {
        let zones = obj[name];
        let endpoint = {};
        endpoint.endpointId = zones.id;
        endpoint.friendlyName = name;
        endpoint.description = "touchLight switch";
        endpoint.manufacturerName = 'touchLight';
        endpoint.displayCategories = ['LIGHT'];
        endpoint.cookie = zones;
        endpoint.capabilities = capablities;
        devices.push(endpoint);

        if (zones.off != zones.lower) {
            endpoint = {};
            endpoint.displayCategories = ['ACTIVITY_TRIGGR'];
            endpoint.endpointId = zones.id + '_scene';
            endpoint.friendlyName = name + ' dim scene';
            endpoint.description = "touchLight scene";
            endpoint.manufacturerName = 'touchLight';
            endpoint.cookie = zones;
            endpoint.capabilities = sceneCapablities;
            devices.push(endpoint);
        }
    }

    return devices;
}

function isValidToken() {
    /**
     * Always returns true for sample code.
     * You should update this method to your own access token validation.
     */
    return true;
}

function isDeviceOnline(applianceId) {
    log('DEBUG', `isDeviceOnline (applianceId: ${applianceId})`);

    /**
     * Always returns true for sample code.
     * You should update this method to your own validation.
     */
    return true;
}

function doHttp(path, callback) {
    var options = {
        host: `touchheat.${dynDNS}`,
        port: 8090,
        path: path
    };
    http.get(options, function (res) {
        var data = '';
        var obj = {};
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            try {
                obj = JSON.parse(data); // Must be in try/catch
            }
            catch (ex) {
                log('DEBUG', "Bad JSON: " + data);
                context.done(null, 'FAILURE');
            }
            log('DEBUG', `${path} => ${JSON.stringify(obj)}`);
            callback(obj);
        });
        res.on('error', function (e) {
            log('DEBUG', "Got error: " + e.message);
            context.done(null, 'FAILURE');
        });
    });
}

function actionLighting(request, tlc, scene, callback, value) {
    doHttp('/tlc/setScene?' + querystring.stringify({ TLc: tlc, Scene: scene }), function (obj) {
        var date = new Date();
        var context = {
            properties: [{
                namespace: 'Alexa.PowerController',
                name: "powerState",
                value: value,
                timeOfSample: date,
                uncertaintyInMilliseconds: 500
            }]
        };
        var header = request.header;
        header.name = "Response";
        header.namespace = 'Alexa';
        var response = { context: context, event: { header: header, endpoint: request.endpoint, payload: {} } };
        log('DEBUG', `action Response: ${JSON.stringify(response)}`);
        callback(null, response);
    });
}

function activateScene(request, tlc, scene, callback) {
    doHttp('/tlc/setScene?' + querystring.stringify({ TLc: tlc, Scene: scene }), function (obj) {
        var date = new Date();
        var header = request.header;
        var payload = {
            cause: {
                type: "VOICE_INTERACTION"
            },
            timestamp: date
        };
        header.name = "ActivationStarted";
        var response = { context: {}, event: { header: header, endpoint: request.endpoint, payload: payload } };
        log('DEBUG', `action Response: ${JSON.stringify(response)}`);
        callback(null, response);
    });
}

function actionHeating(request, temperature, hours, callback) {
    let zoneInfo = request.endpoint.cookie;
    if (!(zoneInfo.ID || zoneInfo.overrideID)) {
        log('ERROR', `actionHeating invalid parameter(s) zone:${zoneInfo.ID}  override:${zoneInfo.overrideID}`);
        callback(null, generateResponse("ErrorResponse", 'Alexa.ThermostatController', {}));
        return;
    }
    doHttp('/hollies/heating/override?'
        + querystring.stringify({ zoneID: zoneInfo.ID, overrideID: zoneInfo.overrideID, hour: hours, temperature: temperature }),
        function (obj) {
            var date = new Date();
            var context = {
                properties: [{
                    namespace: 'Alexa.ThermostatController',
                    name: "targetSetpoint",
                    value: obj.targetTemp,
                    scale: 'CELSIUS',
                    timeOfSample: date,
                    uncertaintyInMilliseconds: 500
                }]
            };
            log('DEBUG', `THc Response: ${JSON.stringify(obj)}`);
            var header = request.header;
            header.name = "Response";
            header.namespace = 'Alexa';
            var response = {
                context: context,
                event: {
                    header: header,
                    endpoint: request.endpoint,
                    payload: {
                        targetSetpoint: {
                            value: obj.targetTemp,
                            scale: "CELSIUS"
                        }
                    }
                }
            };
            response.event.endpoint.cookie.targetTemp = obj.targetTemp.toString();
            log('DEBUG', `actionHeating Response: ${JSON.stringify(response)}`);
            callback(null, response);
        });
}

function handleDiscovery(request, callback) {
    log('DEBUG', `Discovery Request: ${JSON.stringify(request)}`);

    const userAccessToken = request.payload.scope.token.trim();

    if (!userAccessToken || !isValidToken(userAccessToken)) {
        const errorMessage = `Discovery Request [${request.header.messageId}] failed. Invalid access token: ${userAccessToken}`;
        log('ERROR', errorMessage);
        callback(new Error(errorMessage));
    }

    doHttp(`/hollies/lighting/getAllDeviceInfo`, function (objLighting) {
        var header = request.header;
        header.name = "Discover.Response";
        var endpoints = decodeLightingDevices(objLighting);

        doHttp(`/hollies/heating/getAllDeviceInfo`, function (objHeating) {
            var heatingEndpoints = decodeHeatingDevices(objHeating);
            heatingEndpoints.forEach(function (ep) { endpoints.push(ep) });
            var response = { event: { header: header, payload: { endpoints: endpoints } } };
            log('DEBUG', `Discovery Response: ${JSON.stringify(response)}`);
            callback(null, response);
        });
    });
}

function handleControl(request, callback) {
    log('DEBUG', `Control Request: ${JSON.stringify(request)}`);

    const userAccessToken = request.endpoint.scope.token.trim();

    if (!userAccessToken || !isValidToken(userAccessToken)) {
        log('ERROR', `Discovery Request [${request.header.messageId}] failed. Invalid access token: ${userAccessToken}`);
        callback(null, generateResponse('InvalidAccessTokenError', 'Alexa', {}));
        return;
    }
    const applianceId = request.endpoint.endpointId;
    if (!applianceId) {
        log('ERROR', 'No applianceId provided in request');
        const payload = { faultingParameter: `applianceId: ${applianceId}` };
        callback(null, generateResponse('UnexpectedInformationReceivedError', 'Alexa', payload));
        return;
    }

    if (!isDeviceOnline(applianceId, userAccessToken)) {
        log('ERROR', `Device offline: ${applianceId}`);
        callback(null, generateResponse('TargetOfflineError', 'Alexa', {}));
        return;
    }

    switch (request.header.name) {
        case 'TurnOn':
            actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
            break;
        case 'TurnOff':
            actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
            break;
        case "SetBrightness": {
            const brightness = request.payload.brightness.value;
            if (brightness) {
                if (brightness < 10) {
                    actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
                }
                else if (brightness > 90) {
                    actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
                }
                else {
                    actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
                }
            }
            else {
                const payload = { faultingParameter: `percentageState: ${brightness}` };
                callback(null, generateResponse('UnexpectedInformationReceivedError', "Alexa.BrightnessController", payload));
            }
        }
            break;
        case 'SetTargetTemperature': {
            const temperature = request.payload.targetSetpoint.value;
            if (temperature) {
                let tMin = parseInt(request.endpoint.cookie.TemperatureMin);
                let tMax = parseInt(request.endpoint.cookie.TemperatureMax);
                if (tMin <= temperature && temperature <= tMax) {
                    actionHeating(request, temperature, 1, callback);
                } else {
                    temperatureOutOfRange(temperature);
                }
            }
            else {
                const payload = { faultingParameter: `value: ${temperature}` };
                callback(null, generateResponse('UnexpectedInformationReceivedError', "Alexa.ThermostatController", payload));
            }
        }
            break;
        case 'AdjustTargetTemperature': {
            const temperatureDelta = request.payload.targetSetpointDelta.value;
            const temperature = parseInt(request.endpoint.cookie.targetTemp) + temperatureDelta;
            let tMin = parseInt(request.endpoint.cookie.TemperatureMin);
            let tMax = parseInt(request.endpoint.cookie.TemperatureMax);
            if (tMin <= temperature && temperature <= tMax) {
                actionHeating(request, temperature, 1, callback);
            } else {
                temperatureOutOfRange(temperature);
            }
        }
            break;
        case 'SetThermostatMode':
            switch (request.payload.thermostatMode.value) {
                case 'AUTO':
                    actionHeating(request, parseInt(request.endpoint.cookie.targetTemp), 0, callback);
                    break;
                case 'HEAT':
                    actionHeating(request, parseInt(request.endpoint.cookie.targetTemp), 1, callback);
                    break;
                default:
                    log('ERROR', `No supported SetThermostatMode name: ${request.payload.thermostatMode.value}`);
                    callback(null, generateResponse('UnsupportedOperationError', 'Alexa', {}));
            }
            break;
        case 'Activate':
            activateScene(request, request.endpoint.cookie.TLc, request.endpoint.cookie.lower, callback);
            break;
        default: {
            log('ERROR', `No supported directive name: ${request.header.name}`);
            callback(null, generateResponse('UnsupportedOperationError', 'Alexa', {}));
        }
    }

    function temperatureOutOfRange(temperature) {
        const payload = {
            type: "TEMPERATURE_VALUE_OUT_OF_RANGE",
            message: `The requested temperature of ${temperature} for ${request.endpoint.cookie.Name} is out of range`,
            validRange: {
                minimumValue: {
                    value: request.endpoint.cookie.TemperatureMin,
                    scale: "CELSIUS"
                },
                maximumValue: {
                    value: request.endpoint.cookie.TemperatureMax,
                    scale: "CELSIUS"
                }
            }
        };
        callback(null, generateResponse('ErrorResponse', "Alexa.ThermostatController", payload));
    }
}

function handleAuthorization(request, callback) {
    log('DEBUG', `Authorization Request: ${JSON.stringify(request)}`);

    const response = {
        event: {
            header: {
                messageId: generateMessageID(),
                name: 'AcceptGrant.Response',
                namespace: 'Alexa.Authorization',
                payloadVersion: '3',
            }
        },
        payload: {},
    };

    log('DEBUG', `Authorization Response: ${JSON.stringify(response)}`);
    callback(null, response);
}

function statusRequest(request, callback) {
    var path;
    if (request.endpoint.cookie.ID) {
        path = '/hollies/heating/getAllDeviceInfo?' + querystring.stringify({ zoneID: request.endpoint.cookie.ID });
    } else {
        path = '/hollies/heating/getAllDeviceInfo';
        log('ERROR', `Unexpected Status request (ALL) ${request}`);
    }
    log('DEBUG', `statusRequest getOptions: ${path}`);
    doHttp(path, function (obj) {
        var dateStr = new Date();
        var context = {
            properties: [{
                namespace: 'Alexa.ThermostatController',
                name: "targetSetpoint",
                value: {
                    value: obj.targetTemp,
                    scale: "CELSIUS"
                },
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }, {
                namespace: 'Alexa.TemperatureSensor',
                name: "temperature",
                value: {
                    value: obj.currentTemperature,
                    scale: "CELSIUS"
                },
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }, {
                namespace: 'Alexa.ThermostatController',
                name: "thermostatMode",
                value: (obj.isChangeable) ? 'HEAT' : 'AUTO',
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }]
        };
        log('DEBUG', `Status Request Response: ${JSON.stringify(obj)}`);
        var header = request.header;
        header.name = "StateReport";
        header.namespace = 'Alexa';
        var response = { context: context, event: { header: header, endpoint: request.endpoint, payload: {} } };
        callback(null, response);
    });
}

exports.handler = function (request, context, callback) {
    log('DEBUG', `Handler Request: ${JSON.stringify(request)} as ${context.functionName}`);
    switch (request.directive.header.namespace) {
        case 'Alexa.Discovery':
            handleDiscovery(request.directive, callback);
            break;
        case 'Alexa':
            statusRequest(request.directive, callback);
            break;
        case 'Alexa.PowerController':
        case 'Alexa.BrightnessController':
        case 'Alexa.PowerLevelController':
        case 'Alexa.ThermostatController':
        case 'Alexa.SceneController':
            handleControl(request.directive, callback);
            break;
        case 'Alexa.Authorization':
            handleAuthorization(request.directive, callback);
            break;
        default:
            {
                const errorMessage = `No supported namespace: ${request.directive.header.namespace}`;
                log('ERROR', errorMessage);
                callback(new Error(errorMessage));
            }
    }
};