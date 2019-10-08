const OnvifManager = require('onvif-nvt');
const fs = require('fs');

var camera;
var vel = 0.1;
var moveTime = 100;

exports.load = function (request, response) {

    checkForCamera((status, err) => {
        if (status) {
            response.render('camera');
            console.log('Camera OK');
        } else {
            console.log(`Camera error ${err}`);
            response.render('camera', {
                error: err
            });
        }
    });
}

function checkForCamera(callback) {
    if (camera) {
        if (callback) callback(true);
     } else {
       OnvifManager.connect('192.168.1.110', 8999, 'admin', 'josh16zz')
            .then(results => {
                //console.log(results);
                camera = results;
                if (camera.ptz) {
                    camera.ptz.getPresets('MainStream')
                        .then((p) => {
                            console.log('-------------------- Presets: %j', p.data);
                            if (callback) callback(true);
                        })
                        .catch(e => {
                            if (callback) callback(false, `GetPresets Fail ${e}`)
                        });
                } else {
                    camera = null;
                    if (callback) callback(false, 'No PTZ');
                }
            })
            .catch(e => {
                if (callback) callback(false, `Connect Fail ${e}`)
            });
    }
}

exports.action = function (request, response) {

    function finishError(msg, e) {
        console.log(`***** ${msg} ${e}`);
        response.json({
            status: 'Fail',
            error: e
        });
    }

    function finishOK() {
        response.json({
            status: 'OK'
        });
    }

    function finishImage(image) {
        response.render('image', image);
    }

    var id = request.query.id;
    var action = request.query.action;
    if (!camera || !action || !id) {
        finishError(`No camera ${request.query}`);
        return;
    }

    switch (action) {
        case 'set':
            console.log('Set %j', id);
            if (id == 'im') { // Image snapshot
                camera.add('snapshot')
                camera.snapshot.getSnapshot()
                    .then(results => {
                        fs.writeFile('image.jpg', results.image, 'binary', function (err) {
                            if (err) finishError('Cant save image', err);
                        })
                        let mimeType = results.mimeType
                        let rawImage = results.image
                        let prefix = 'data:' + mimeType + ';base64,'
                        let base64Image = Buffer.from(rawImage, 'binary').toString('base64')
                        let image = prefix + base64Image
                        // 'image' is now ready to be displayed on a web page
                        console.log(image);
                    })
                    .catch(e => console.log(e));
            } else {
                camera.ptz.setPreset('MainStream', id.charAt(1), id.charAt(1))
                    .then(e => {
                        console.log("Set Preset done %j", e);
                    })
                    .catch(e => console.log(e));
            }
            case 'move':
                if (id.charAt(0) == 'p') { // Move to preset
                    console.log('Goto preset %j', id);
                    camera.ptz.gotoPreset('MainStream', id.charAt(1), {
                            x: 1,
                            y: 1,
                            z: 1
                        })
                        .then(e => {
                            console.log("Moved to Preset %j", e);
                            finishOK();
                        })
                        .catch(e => finishError("Can't GoTo Preset", e));
                } else {
                    console.log('move %j', id);
                    let move = {
                        x: 0.0,
                        y: 0.0,
                        z: 0.0
                    };
                    switch (id) {
                        case 'ul':
                            move.x = -vel;
                            move.y = vel;
                            break;
                        case 'u':
                            move.y = vel;
                            break;
                        case 'ur':
                            move.x = vel;
                            move.y = vel;
                            break;
                        case 'l':
                            move.x = -vel;
                            break;
                        case 'zi':
                            move.z = vel;
                            break;
                        case 'zo':
                            move.z = -vel;
                            break;
                        case 'r':
                            move.x = vel;
                            break;
                        case 'dl':
                            move.x = -vel;
                            move.y = -vel;
                            break;
                        case 'd':
                            move.y = -vel;
                            break;
                        case 'dr':
                            move.x = vel;
                            move.y = -vel;
                            break;
                        case 's1':
                            moveTime = 100;
                            break;
                        case 's2':
                            moveTime = 500;
                            break;
                    }
                    camera.ptz.continuousMove('MainStream', move)
                        .then(() => {
                            setTimeout(() => camera.ptz.stop(), moveTime);
                            finishOK();
                        })
                        .catch(e => finishError('Continuous move error', e));
                }
    }
    finishOK(); // In case of bug
}