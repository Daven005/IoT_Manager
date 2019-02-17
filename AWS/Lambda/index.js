'use strict';
var http = require("http");
var querystring = require('querystring');
const dynDNS = "mooo.com";

function log(title, msg) {
    console.log(`[${title}] ${msg}`);
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

/**
 * Mock functions to access device cloud.
 *
 * TODO: Pass a user access token and call cloud APIs in production.
 */

function decodeHeatingDevices(obj) {
    var devices = [];
    var capablities = [{
            type: "AlexaInterface",
            interface: "Alexa.PowerController",
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
                retrievable: false
            }
        }
    ];
    for (var name in obj) {
        var scenes = obj[name];
        var displayCategories = ['THERMOSTAT'];
        var endpoint = {};
        endpoint.endpointId = scenes.id;
        endpoint.friendlyName = name;
        endpoint.description = "touchHeat Thermostat";
        endpoint.manufacturerName = 'touchHeat';
        endpoint.displayCategories = displayCategories;
        endpoint.cookie = scenes;
        endpoint.capabilities = capablities;
        devices.push(endpoint);
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

function turnOn(request, callback) {
    log('DEBUG', `turnOn (applianceId: ${request.endpoint.endpointId})`);
    action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
}

function turnOff(request, callback) {
    log('DEBUG', `turnOff (applianceId: ${request.endpoint.endpointId})`);
    action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
}

function action(request, tlc, scene, callback, value) {
    var getOptions = {
        host: `touchheat.${dynDNS}`,
        port: 8090,
        path: '/tlc/setScene?' + querystring.stringify({ TLc: tlc, Scene: scene })
    };
    http.get(getOptions, function(res) {
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
            var context = {
                properties: [{
                    namespace: 'Alexa.PowerController',
                    name: "powerState",
                    value: value,
                    timeOfSample: Date.now().JSON,
                    uncertaintyInMilliseconds: 500
                }]
            };
            log('DEBUG', `TLc Response: ${JSON.stringify(obj)}`);
            var header = request.header;
            header.name = "Response";
            header.namespace = 'Alexa';
            var response = { context: context, event: { header: header, endpoint: request.endpoint, payload: {} } };
            log('DEBUG', `Discovery Response: ${JSON.stringify(response)}`);
            callback(null, response);
        });
        res.on('error', function(e) {
            log('DEBUG', "Got error: " + e.message);
            context.done(null, 'FAILURE');
        });
    });
}

function setPercentage(applianceId, percentage) {
    log('DEBUG', `setPercentage (applianceId: ${applianceId}), percentage: ${percentage}`);

    // Call device cloud's API to set percentage

    return generateResponse('SetPercentageConfirmation', {});
}

function incrementPercentage(applianceId, delta) {
    log('DEBUG', `incrementPercentage (applianceId: ${applianceId}), delta: ${delta}`);

    // Call device cloud's API to set percentage delta

    return generateResponse('IncrementPercentageConfirmation', {});
}

function decrementPercentage(applianceId, delta) {
    log('DEBUG', `decrementPercentage (applianceId: ${applianceId}), delta: ${delta}`);

    // Call device cloud's API to set percentage delta

    return generateResponse('DecrementPercentageConfirmation', {});
}

function handleDiscovery(request, callback) {
    log('DEBUG', `Discovery Request: ${JSON.stringify(request)}`);

    const userAccessToken = request.payload.scope.token.trim();

    if (!userAccessToken || !isValidToken(userAccessToken)) {
        const errorMessage = `Discovery Request [${request.header.messageId}] failed. Invalid access token: ${userAccessToken}`;
        log('ERROR', errorMessage);
        callback(new Error(errorMessage));
    }

    http.get(`http://touchheat.${dynDNS}:8090/heating/zones`, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            var obj = {};
            try {
                obj = JSON.parse(data); // Must be in try/catch
            }
            catch (ex) {
                log('DEBUG', "Bad JSON: " + data);
                context.done(null, 'FAILURE');
            }
            var header = request.header;
            header.name = "Discover.Response";
            var endpoints = decodeHeatingDevices(obj);
            var response = { event: { header: header, payload: { endpoints: endpoints } } };
            log('DEBUG', `Discovery Response: ${JSON.stringify(response)}`);
            callback(null, response);
        });
        res.on('error', function(e) {
            log('DEBUG', "Got error: " + e.message);
            context.done(null, 'FAILURE');
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
            action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
            return;
        case 'TurnOff':
            action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
            return;
        case "SetBrightness":
            {
                const brightness = request.payload.brightness.value;
                if (brightness) {
                    if (brightness < 10) {
                        action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
                    }
                    else if (brightness > 90) {
                        action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.on, callback, 'ON');
                    }
                    else {
                        action(request, request.endpoint.cookie.TLc, request.endpoint.cookie.off, callback, 'OFF');
                    }
                }
                else {
                    const payload = { faultingParameter: `percentageState: ${brightness}` };
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                }
            }
            break;
        case 'SetPercentage':
            {
                const brightness = request.payload.brightness.value;
                if (!brightness) {
                    const payload = { faultingParameter: `percentageState: ${brightness}` };
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                    return;
                }
                response = setPercentage(applianceId, userAccessToken, brightness);
                break;
            }
        case 'IncrementPercentage':
            {
                const delta = request.payload.deltaPercentage.value;
                if (!delta) {
                    const payload = { faultingParameter: `deltaPercentage: ${delta}` };
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                    return;
                }
                response = incrementPercentage(applianceId, userAccessToken, delta);
                break;
            }
        case 'DecrementPercentageRequest':
            {
                const delta = request.payload.deltaPercentage.value;
                if (!delta) {
                    const payload = { faultingParameter: `deltaPercentage: ${delta}` };
                    callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                    return;
                }
                response = decrementPercentage(applianceId, userAccessToken, delta);
                break;
            }
        default:
            {
                log('ERROR', `No supported directive name: ${request.header.name}`);
                callback(null, generateResponse('UnsupportedOperationError', {}));
                return;
            }
    }
    log('DEBUG', `Control Confirmation: ${JSON.stringify(response)}`);
}

function handleQuery(request, callback) {
    callback(null, generateResponse('query', null));
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

exports.handler = (request, context, callback) => {
    log('DEBUG', `Control Request: ${JSON.stringify(request)}`);
    switch (request.directive.header.namespace) {
        case 'Alexa.Discovery':
            handleDiscovery(request.directive, callback);
            break;

        case 'Alexa.PowerController':
        case 'Alexa.BrightnessController':
        case 'Alexa.PowerLevelController':
            handleControl(request.directive, callback);
            break;

        case 'Alexa.Authorization':
            handleAuthorization(request.directive, callback);
            break;

        case 'Alexa.ConnectedHome.Query':
            handleQuery(request, callback);
            break;

        default:
            {
                const errorMessage = `No supported namespace: ${request.directive.header.namespace}`;
                log('ERROR', errorMessage);
                callback(new Error(errorMessage));
            }
    }
};
