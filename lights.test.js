var lights = {};
var fs = require('fs');
var rp = require('request-promise');
var lights = require('./lights');

testfile('1');
testfile('Ab12_1');
testfile('led/123.json');
testfile('xyz/123.js');

// testPost('1.json');

function testfile(f) {
    var fn = lights.getFileName(f);
    if (fn)
        console.log(`${f} makes ${fn}`);
    else
        console.log(`${f} fails`);
}

function testPost(file) {
    var fileName =`led/${file}`;
    fs.exists(fileName, (exists) => {
        if (exists) {
            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    lights = JSON.parse(data);
                    console.log(data);
                }
            });
        }
    });
    var options = {
        method: 'POST',
        uri: 'http://192.168.1.200/pattern',
        body: {
            lights: lights
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options)
        .then(function (parsedBody) {
            console.log(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
        });
}