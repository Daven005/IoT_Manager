"use strict"
var fs = require('fs');
var version = require("./version");
console.log(`+++Menu ${JSON.stringify(version)}`)
function getfiles(fileType) {
    var fileList = fs.readdirSync(fileType).filter(function (file) {
        return (file.substr(-3) === '.js' || file.substr(-5) === '.json');
    });
    return fileList;
}

function makeMenuItem(r, n, m1) {
    if (typeof m1 == 'undefined') {
        return {
            ref: r,
            name: n
        };
    }
    return {
        ref: r,
        name: n,
        subMenu: m1
    };
}

exports.get = function (request, response) {
    var menu = [];
    var othersMenu = [];
    var subMenu = [];
    var html;

    subMenu = [];
    subMenu.push(makeMenuItem('/graph?new=1', 'New'));
    getfiles('graph').forEach(function (entry) {
        subMenu.push(makeMenuItem('/graph?read=' + entry, 'Read: ' + entry));
    });
    subMenu.push(makeMenuItem('/dailyGraph', 'Daily Graph'));
    menu.push(makeMenuItem('/graph?new=1', 'Graph', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/Manage/Sensors', 'Sensors'));
    subMenu.push(makeMenuItem('/Manage/Settings', 'Settings'));
    subMenu.push(makeMenuItem('/Manage/Devices', 'Device List'));
    subMenu.push(makeMenuItem('/Manage/Mapping', 'Update mapping'));
    menu.push(makeMenuItem('/Manage/Sensors', 'Manage', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/Heating', 'Zones'));
    subMenu.push(makeMenuItem('/Heating/Override', 'Overrides'));
    subMenu.push(makeMenuItem('/Heating/mobileOverrides', 'Mobile Overrides'));
    subMenu.push(makeMenuItem('/Heating/boost', 'Boost'));
    menu.push(makeMenuItem('/heating', 'Heating', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/Override/Output', 'Output'));
    subMenu.push(makeMenuItem('/Override/Device', 'Device'));
    subMenu.push(makeMenuItem('/Override/Input', 'Input'));
    subMenu.push(makeMenuItem('/Override/Flow', 'Flow'));
    subMenu.push(makeMenuItem('/Override/Pressure', 'Pressure'));
    subMenu.push(makeMenuItem('/Override/Temperature', 'Temperature'));
    menu.push(makeMenuItem('/Override/Output', 'Override', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/Signal/Gate', 'Gate'));
    subMenu.push(makeMenuItem('/Signal/Socket', 'Socket'));
    subMenu.push(makeMenuItem('/WiFiGate/Monitor', 'Monitor'));
    menu.push(makeMenuItem('/Signal/Gate', 'Signal', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/tlc/scenes', 'Show Scenes'));
    subMenu.push(makeMenuItem('/tlc/areas', 'Update Areas'));
    subMenu.push(makeMenuItem('/tlc/info', 'Info'));
    subMenu.push(makeMenuItem('/tlc/Edit', 'Edit'));
    subMenu.push(makeMenuItem('/tlc/Monitor', 'Monitor'));
    menu.push(makeMenuItem('/tlc/info', 'TLc', subMenu));

    subMenu = [];
    subMenu.push(makeMenuItem('/lights?new=1', 'New'));
    getfiles('led').forEach(function (entry) {
        subMenu.push(makeMenuItem('/lights?read=' + entry, 'Read ' + entry));
    });
    othersMenu.push(makeMenuItem('/lights', 'Lights', subMenu));
    othersMenu.push(makeMenuItem('/message', 'Message'));
    othersMenu.push(makeMenuItem('/alarms', 'Alarms'));
    othersMenu.push(makeMenuItem('/errors', 'Errors'));
    othersMenu.push(makeMenuItem('/Pond/schedule', 'Pond'));
    othersMenu.push(makeMenuItem('/tides', 'Tides'));
    othersMenu.push(makeMenuItem('/Watering/schedule', 'Watering'));
    othersMenu.push(makeMenuItem('/public/weather.html', 'Weather'));
    var ip = request.connection.localAddress.replace('::ffff:', '');
    othersMenu.push(makeMenuItem('http://' + ip + ':' + config.browser.mobilePort + '/', 'Mobile View'));

    menu.push(makeMenuItem('/errors', 'Other', othersMenu));

    if (request.loggedIn)
        menu.push(makeMenuItem('/login?logout=1', 'Log Out'));
    else
        menu.push(makeMenuItem('/login', 'Log In'));
    let v = version.version;
    var str = `V: ${v.major}.${v.minor}.${v.patch}+${v.build}`;
    html = response.render('makeMenu', {
            m: menu,
            loggedIn: request.loggedIn
        },
        function (err, html) {
            if (err) {
                console.error(`Menu error ${err}`);
            }
            html += `<div>${str}</div>`
            response.end(html);
        });
}