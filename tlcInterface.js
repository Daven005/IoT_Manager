var dgram = require('dgram');
var freeport = require('freeport');
var network = require('network');
var http = require('http');
var weather = require('./weather');

var TLcList = config.TLc.list;
var allScenes = [];
var allChannels = [];

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
exports.updateScenes = updateScenes;

var udpServervar;

function enqTimeoutCb() {
    console.log("### Tlc enqTimeoutCb");
    TLcList.forEach((t) => { // Deal with TLcs going offline
        if (!t.online) t.ip = null;
    });
    if (enqBroadcastCb) {
        console.log(`TLcs: ${JSON.stringify(TLcList, null, 2)}`)
        updateScenes(enqBroadcastCb);
        // enqBroadcastCb();
        enqBroadcastCb = null;
    }
}

function udpServerMessageFunc(message, remote) {
    console.log("### UDP msg")
    try {
        var response = JSON.parse(message);
        /* Should be like:
            {"TLc":"Hollies-L",
            "Version":{"Major":0,"Minor":73},
            "IPaddress":"192.168.001.081",
            "snMatches":true,
            "Errors":[{"Section":1,"Error":1,"Count":32,"Message":"Corrupt SwitchPlate msg 2"},...]
            }
            or
            {"OSC"}
        */
    } catch (ex) {
        console.error("UDP msg: %j %s", response, ex.message);
    }
    if (response.TLc) {
        var _tlc = getTLc(response.TLc);
        if (_tlc) {
            _tlc.IPaddress = response.IPaddress.replace(/\.0/g, '.').replace(/\.0/g, '.');;
            _tlc.Version = response.Version.Major.toString() + '.' + response.Version.Minor.toString();
            _tlc.online = true;
            _tlc.errors = [];
            if (response.Errors) {
                response.Errors.forEach((err) => { _tlc.errors.push(err); });
            }
            if (enqTimer) {
                clearTimeout(enqTimer);
            }
            enqTimer = setTimeout(enqTimeoutCb, 500);
            console.log("### Reset enqTimer");
        } else {
            console.error(`TLc ${response.TLc} not in TLcList`);
            addTLc(response.TLc, response.IPaddress, `${response.Version.Major}.${response.Version.Minor}`)
        }
    } else if (response.OSC) {
        console.log(remote.address + ':' + remote.port + ' - ' + message);
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
    udpServer.send(bfr, 0, bfr.length, config.TLc.udp_port, address, (err, bytes) => {
        if (err) {
            console.log("Broadcast error: %j", err);
        }
    });
}

function init(initDone) {
    enqBroadcastCb = initDone;
    udpServer = dgram.createSocket('udp4');
    udpServer.on('message', udpServerMessageFunc);
    udpServer.on('error', (err) => {
        console.error(`UDP error ${err}`);
    });
    freeport((err, port) => {
        if (err) console.error(`No free port ${err}`);
        network.get_interfaces_list((err, list) => {
            var i;
            for (i = 0; i < list.length; i++) {
                console.log(`IFs: ${JSON.stringify(list[i])}`)
                if (list[i].type == 'Wired') {
                    try {
                        udpServer.bind(port, list[i].ip_address, () => {
                            var address = udpServer.address();
                            var p = address.address.split('.');
                            broadcastAddress = `${p[0]}.${p[1]}.${p[2]}.255`;

                            console.log('UDP udpServer listening on ' + address.address + ":" + address.port);
                            broadcast(broadcastAddress, '{"enq":"TLc"}');
                            console.log("### Start timeout");
                            enqTimer = setTimeout(enqTimeoutCb, 1000); // Allow longer time for initial response
                        });
                    } catch (ex) {
                        console.error(`UDP bind error: ${ex}`);
                    }
                    return;
                }
            }
            console.error("No wired interface available");
        });
    });
}

function checkTLcs(cb) {
    if (enqBroadcastCb) {
        console.log("checkTLcs, enq in progress");
        return; // Already doing it
    }
    enqBroadcastCb = cb;
    TLcList.forEach((t) => { t.online = false });
    broadcast(broadcastAddress, '{"enq":"TLc"}');
}

function rqInfo(tlcName, info, cb, param) {
    var options = {
        timeout: 1000,
        host: "",
        port: config.TLc.http_port,
    };
    t = getTLc(tlcName);
    if (t) {
        if (t.serNo.length > 6) {
            options.host = getTLc(tlcName).IPaddress;
        } else {
            cb({ error: true, info: `${tlcName} not online` });
        }
    } else {
        cb({ error: true, info: `${tlcName} not registered in config` });
        return;
    }

    options.path = '/' + info + '?serialNo=' + getTLc(tlcName).serNo
    if (param) {
        options.path += '&' + param;
    }
    var req = http.get(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var obj = {};
            try {
                obj.data = JSON.parse(data); // Must be in try/catch
                if (!obj.data.result) { // NB reponse is EITHER a result code (+info) or the data
                    obj.error = false;
                } else {
                    obj.error = true;
                    obj.info = `Rq ${info} returned false, info: ${data}`;
                }
            } catch (ex) {
                obj.error = true;
                obj.info = "Bad JSON: " + data;
            }
            obj.reqInfo = info;
            obj.tlc = tlcName;
            cb(obj);
        });
    });
    req.on('error', (e) => {
        console.error("rqInfo error: %j", e);
        console.log(e.stack);
        cb({ error: true, info: e.message, reqInfo: info, tlc: tlcName });
        if (!enqBroadcastCb) { // No enqBroadcastCb in progress
            checkTLcs(() => {
                console.log("Rechecked TLc IP addresses");
            });
        } else {
            console.log("rqInfo enqBroadcast in progress");
        }
    });
}

exports.test = function (request, response) {
    updateScenes(() => {
        response.setHeader('Content-Type', 'application/json');
        response.end(allScenes);
    });
}

function getChannel(tlcName, channelID) {
    var chnl = allChannels.find(channel => {
        return channel.tlcName == tlcName && channel.id == channelID;
    });
    return chnl;
}

function updateScenes(cb) {
    let tlcCount = TLcList.length;
    allChannels = [];
    TLcList.forEach(function (_tlc) {
        // e.g. channels {"ID":5,"AreaID":0,"Name":"Bay green"},
        // e.g. areas {"ID":1,"Name":"Hall","LastScene":19},
        // e.g. channelvalues [255,0,0,0,0,0,0,0,0,0,255,255,255,0,0,0,255,255,0,255,255,0,255,0,0,0,0,0,255,255,255]
        const MAXAREAS = 20;
        const MAXCHANNELS = 50;
        let areaNames = [];
        let channels = [];
        let channelValues = [];

        for (let i = 0; i < MAXAREAS; i++) areaNames.push('-');

        const getTLcData = function (url) {
            return new Promise((resolve, reject) => {
                rqInfo(_tlc.Name, url, (result) => {
                    if (result.error)
                        reject(result);
                    else {
                        resolve(result.data);
                    }
                });
            });
        }

        if (_tlc.online) {
            getTLcData('areas')
                .then(_areas => {
                    _areas.forEach(a => { areaNames[a.ID] = a.Name; });
                    return getTLcData('channelValues');
                })
                .then(_values => {
                    channelValues = _values;
                    return getTLcData('channels');
                })
                .then(_channels => {
                    _channels.forEach((c) => {
                        channels.push({ id: c.ID, name: c.Name, tlcName: _tlc.Name, areaName: areaNames[c.AreaID], currentValue: channelValues[c.ID] });
                    });
                    Array.prototype.push.apply(allChannels, channels);
                    return getTLcData('scenes');
                })
                .then(tlcScenes => {
                    if (tlcScenes.length > 0) {
                        tlcScenes.forEach((scene) => { updateScene(_tlc.Name, scene); });
                    } else {
                        console.log(`No scenes from ${_tlc.Name}`);
                    }
                    return getTLcData('sceneChannels');
                })
                .then(tlcSceneChannels => {
                    tlcSceneChannels.forEach(sc => { updateSceneChannels(_tlc.Name, sc); });
                    console.log(allScenes.length);
                    if (--tlcCount == 0) {
                        if (cb) cb();
                    }
                })
                .catch(e => console.log(e));
        } else {
            console.log(`TLc ${_tlc.Name} is offline`);
            if (cb) cb();
        }

        // e.g. allScenes {"ID":1, "Name": "Reading", "FadeIn":20, "Duration":0, "FadeOut":0, "FadePrev":false, "NextScene":255, "StartTime":"42:30"},
        function updateScene(tlcName, scene) {
          try {
            let idx = allScenes.findIndex((sc) => { return sc.tlcName == tlcName && scene.ID == sc.ID });
            if (idx >= 0) {
                allScenes[idx].Name = scene.Name; // That's all that might have changed that we want
            } else {
               
            }allScenes.push({ tlcName: tlcName, ID: scene.ID, Name: scene.Name, channels: [] });
          } catch(e) {
            console.error(`updateScene Error ${e}`);
          }
        }

        // e.g. sceneChannels {"SceneID":1,"Channel":{"ID":2,"Max":2,"value":250}}
        function updateSceneChannels(tlcName, sceneChannel) {
            try {
                let sceneIdx = allScenes.findIndex(scene => { return scene.tlcName == tlcName && scene.ID == sceneChannel.SceneID });
                if (sceneIdx >= 0) {
                    // console.log(`updateSceneChannels: %d %j`, sceneIdx, sceneChannel);
                    // Add to scene.channels[] => {ID, targetValue, currentValue, areaName, channelName}
                    let scene = allScenes[sceneIdx];
                    // Note sceneChannel has range of channels ID->Max
                    for (let channelID = sceneChannel.Channel.ID; channelID <= sceneChannel.Channel.Max; channelID++) {
                        let sceneChannelIdx = scene.channels.findIndex(channel => { return channel.ID == channelID; });
                        let channelObj = getChannel(scene.tlcName, channelID);
                        if (channelObj) {
                            if (sceneChannelIdx >= 0) { // Found exisiting 
                                scene.channels[sceneChannelIdx].targetValue = sceneChannel.Channel.value;
                                scene.channels[sceneChannelIdx].currentValue = channelObj.value;
                            } else { // New
                                scene.channels.push({
                                    ID: channelID,
                                    targetValue: sceneChannel.Channel.value,
                                    currentValue: channelObj.value,
                                    areaName: channelObj.areaName,
                                    channelName: channelObj.name
                                });
                            }
                        } else {
                            // console.log(`No channelObj for ${JSON.stringify(scene)}, ${channelID} in ${JSON.stringify(sceneChannel)}`);
                        }
                    }
                } else {
                    console.log(`(${sceneIdx}) Scene inconsistancy tcl: ${tlcName} no scene for ${JSON.stringify(sceneChannel)}`);
                }
            } catch (ex) {
                console.log('Error in updateSceneChannels: ', ex.message)
            }
        }
    });
}

exports.getSceneAreaChannels = function (areaName, sceneName, cb) {
    const getTLcData = function (tlcName, url) {
        return new Promise((resolve, reject) => {
            rqInfo(tlcName, url, (result) => {
                if (result.error)
                    reject(result);
                else {
                    resolve(result);
                }
            });
        });
    }

    function findValue(channelValues, tlcName, channelID) {
        channelValues.forEach((tlcValues) => {
            if (tlcName == tlcValues.tlc) return tlcValues.data[channelID];
        });
        return 0;
    }

    var allTLcPromises = [];
    var channelInfo = [];
    TLcList.forEach((_tlc) => { allTLcPromises.push(getTLcData(_tlc.Name, 'channelvalues')); });

    Promise.all(allTLcPromises)
        .then((results) => {
            console.log(results);
            allScenes.forEach((scene) => {
                if (scene.Name == sceneName || sceneName == null) {
                    scene.channels.forEach((channel) => {
                        if (channel.areaName == areaName || areaName == null) {
                            channelInfo.push({
                                tlc: scene.tlcName, area: areaName, scene: scene.Name, channel: channel.channelName,
                                id: channel.ID, value: findValue(results, scene.tlcName, channel.ID),
                                target: channel.targetValue
                            });
                        }
                    });
                }
            });
            cb(channelInfo);
        })
        .catch(reason => {
            console.log(reason)
            cb(reason);
        });
}

exports.getAreaChannels = function (areaName, cb) {

    const getTLcData = function (tlcName, url) {
        return new Promise((resolve, reject) => {
            rqInfo(tlcName, url, (result) => {
                if (result.error)
                    reject(result);
                else {
                    resolve(result);
                }
            });
        });
    }

    function findValue(channelValues, tlcName, channelID) {
        var retVal = -1;
        channelValues.forEach((tlcValues) => {
            if (tlcName == tlcValues.tlc) retVal = tlcValues.data[channelID];
        });
        if (channelID == 18)
            console.log(tlcName, channelID);
        return (retVal < 0) ? 0 : retVal;
    }

    var allTLcPromises = [];
    var channelInfo = [];
    // Set up for parallel getting all (3) tlc info
    TLcList.forEach((_tlc) => { allTLcPromises.push(getTLcData(_tlc.Name, 'channelvalues')); });

    Promise.all(allTLcPromises)
        .then((results) => {
            allChannels.forEach((channel) => {
                if (channel != {}) {
                    channel.currentValue = findValue(results, channel.tlcName, channel.id);
                }
            });
            let result = allChannels.filter((chanl) => chanl.areaName == areaName);
            cb(result);
        })
        .catch(reason => {
            console.log(reason);
            cb(reason);
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

exports.isLight = isLight; // for testing

function isLight(now, cloudCover) {
    switch (controlState) {
        case "Auto":
            let cloudAdjustment = 0.5 + cloudCover / 100; // Up to 1.5 hours before/after sunset/sunrise
            let times = sunCalc.getTimes(now, config.latitude, config.longitude);
            let start = moment(times.sunrise).add(cloudAdjustment, 'hours');
            let end = moment(times.sunset).subtract(cloudAdjustment, 'hours');
            console.log(`Light: ${start.format('HH:mm')} - ${end.format('HH:mm')} cloud: ${cloudAdjustment}`);
            return now.isBetween(start, end);
        case "Dark":
            return false;
        case "Light":
            return true;
    }
    return true;
}

function trigger(tlcName, area, channel, state, filter) {
    if (filter && state == 'on') { // NB always turn OFF; conditional turn ON
        if (isLight(moment(), weather.getCloud().c[0])) return;
    }
    send(tlcName, `{"OSC":["${area}-Fader","${channel}"],"args":[${(state == 'on') ? 255 : 0}]}`);
}

function setChannel(tlcName, area, channel, val) {
    if (val < 0) val = 0;
    if (val > 255) val = 255;
    send(tlcName, `{"OSC":["${area}-Fader","${channel}"],"args":[${val}]}`);
}

function showScene(tlcName, scene) {
    send(tlcName, `{"OSC":["Area-Scene","${scene}"],"args":[1]}`);
};

function refresh(tlcName, area, channel, cb) {
    console.log("refresh: %j %s-%s", tlcName, area, channel);
    refreshCompleteCb = cb;
    send(tlcName, `{"OSC":["Refresh Fader-${area}","${channel}"],"args":[1]}`);
};

function send(tlcName, str) {
    var bfr = new Buffer.from(str);
    console.log("Send %j ===> %s", tlcName, str);
    var tlcObj = getTLc(tlcName)
    if (tlcObj) {
        var ip = tlcObj.IPaddress.replace(/\.0/g, '.').replace(/\.0/g, '.');
        console.log("%s=>%s %s", tlcName, str, ip);
        udpServer.send(bfr, 0, bfr.length, config.TLc.udp_port, ip, function (err, bytes) {
            if (err) {
                console.log("tlc send error: %j", err);
            }
        });
    } else {
        console.log("TLc %j is not online", tlcName);
    }
}

function getTLc(tlcName) {
    _tlc = TLcList.find((t) => { return t.Name == tlcName });
    if (_tlc) return _tlc;
    console.error(`*** tlcName "${tlcName}" is not defined`);
    return undefined;
}

function addTLc(tlcName, ipAddress, version) {
    var newTLc = {
        Name: tlcName,
        serNo: '',
        online: false,
        IPaddress: ipAddress,
        Version: version,
        Location: 'Not registered'
    };
    TLcList.push(newTLc);
    return newTLc;
}

function list() {
    return TLcList;
}