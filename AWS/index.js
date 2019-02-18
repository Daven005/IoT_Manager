'use strict';
var http = require("http");
var querystring = require('querystring');
const debug = 1;
const dynDNS = "mooo.com";

function log(title, msg) {
    if (debug) console.log(`[${title}] ${msg}`);
}

function generateMessageID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Generate a response message
 *
 * @param {string} name - Directive name
 * @param {Object} payload - Any special payload required for the response
 * @returns {Object} Response object
 */
function generateResponse(name, payload) {
    return {
        header: {
            messageId: generateMessageID(),
            name: name,
            namespace: 'Alexa..Control',
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
    obj.forEach(function(zone) {
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
    http.get(options, function(res) {
        var data = '';
        var obj = {};
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
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
        res.on('error', function(e) {
            log('DEBUG', "Got error: " + e.message);
            context.done(null, 'FAILURE');
        });
    });
}

function actionLighting(request, tlc, scene, callback, value) {
    doHttp('/tlc/setScene?' + querystring.stringify({ TLc: tlc, Scene: scene }), function(obj) {
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
    doHttp('/tlc/setScene?' + querystring.stringify({ TLc: tlc, Scene: scene }), function(obj) {
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


function actionHeating(request, temperature, callback) {
    doHttp('/hollies/heating/override?' + querystring.stringify({ overrideID: request.endpoint.cookie.overrideID, hour: 1, temperature: temperature }), function(obj) {
        var date = new Date();
        var context = {
            properties: [{
                namespace: 'Alexa.ThermostatController',
                name: "targetSetpoint",
                value: obj.targetTemp,
                timeOfSample: date,
                uncertaintyInMilliseconds: 500
            }]
        };
        log('DEBUG', `THc Response: ${JSON.stringify(obj)}`);
        var header = request.header;
        header.name = "Response";
        header.namespace = 'Alexa';
        var response = { context: context, event: { header: header, endpoint: request.endpoint, payload: {} } };
        log('DEBUG', `action Response: ${JSON.stringify(response)}`);
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

    doHttp(`/hollies/lighting/getAllDeviceInfo`, function(objLighting) {
        var header = request.header;
        header.name = "Discover.Response";
        var endpoints = decodeLightingDevices(objLighting);

        doHttp(`/hollies/heating/getAllDeviceInfo`, function(objHeating) {
            var heatingEndpoints = decodeHeatingDevices(objHeating);
            heatingEndpoints.forEach(function(ep) { endpoints.push(ep) });
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
        callback(null, generateResponse('InvalidAccessTokenError', {}));
        return;
    }
    const applianceId = request.endpoint.endpointId;
    if (!applianceId) {
        log('ERROR', 'No applianceId provided in request');
        const payload = { faultingParameter: `applianceId: ${applianceId}` };
        callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
        return;
    }

    if (!isDeviceOnline(applianceId, userAccessToken)) {
        log('ERROR', `Device offline: ${applianceId}`);
        callback(null, generateResponse('TargetOfflineError', {}));
        return;
    }
    let response;

    switch (request.header.name) {
        case 'TurnOn':
            actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
            return;
        case 'TurnOff':
            actionLighting(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
            return;
        case "SetBrightness":
            {
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
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                }
            }
            break;
        case 'SetTargetTemperature':
            {
                const temperature = request.payload.targetSetpoint.value;
                if (temperature) {
                    if (5 <= temperature && temperature < 30) {
                        actionHeating(request, temperature, callback);
                    }
                }
                else {
                    const payload = { faultingParameter: `percentageState: ${temperature}` };
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                }
            }
            break;
        case 'Activate':
            activateScene(request, request.endpoint.cookie.TLc, request.endpoint.cookie.lower, callback);
        break;
        default:
            {
                log('ERROR', `No supported directive name: ${request.header.name}`);
                callback(null, generateResponse('UnsupportedOperationError', {}));
                return;
            }
    }
    log('DEBUG', `Control Confirmation: ${JSON.stringify(response)}`);
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

function statusCheck() {

}

function statusRequest(request, callback) {
    var path;
    if (request.endpoint.cookie.overrideID) {
        path = '/hollies/heating/getAllDeviceInfo?' + querystring.stringify({ overrideID: request.endpoint.cookie.overrideID });
    }
    else {
        path = '/hollies/heating/getAllDeviceInfo';
    }
    log('DEBUG', `getOptions: ${path}`);
    doHttp(path, function(obj) {
        var dateStr = new Date();
        var context = {
            properties: [{
                namespace: 'Alexa.ThermostatController',
                name: "targetSetpoint",
                value: {
                    value: obj[0].targetTemp,
                    scale: "CELSIUS"
                },
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }, {
                namespace: 'Alexa.TemperatureSensor',
                name: "temperature",
                value: {
                    value: obj[0].currentTemperature,
                    scale: "CELSIUS"
                },
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }, {
                namespace: 'Alexa.ThermostatController',
                name: "thermostatMode",
                value: (obj[0].overrideOn) ? 'HEAT' : (obj[0].demand) ? 'AUTO' : 'OFF',
                timeOfSample: dateStr,
                uncertaintyInMilliseconds: 500
            }]
        };
        log('DEBUG', `TLc Response: ${JSON.stringify(obj)}`);
        var header = request.header;
        header.name = "StateReport";
        header.namespace = 'Alexa';
        var response = { context: context, event: { header: header, endpoint: request.endpoint, payload: {} } };
        log('DEBUG', `action Response: ${JSON.stringify(response)}`);
        callback(null, response);
    });
}

exports.handler = (request, context, callback) => {
    log('DEBUG', `Control Request: ${JSON.stringify(request)} as ${context.functionName}`);
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
