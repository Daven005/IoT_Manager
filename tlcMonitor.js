"use strict";
var tlc_if = require('./tlcInterface');
const net = require('net');
const io = require('socket.io')
const server = io.listen(config.TLc.IoT_Manager_port);
var tlc = 'none';
var tlcConnection;
var tlcStatus = 'unconnected';

server.on('connection', (socket) => {
    console.log(`Browser Connection`);
    
    socket.on('tlc', (data) => {
        console.log(`Connect to: ${data}`);
        connectToTLc(data, socket);
    });
    socket.on('status', () => {
        let msg = `Status rq = (${tlcStatus}`;
        if (tlcConnection) msg += `, ${tlcConnection.readyState})`;
        console.log(msg);
        socket.emit('info', msg);
    });
    socket.on('cmd', (data) => {
        console.log(`Cmd: ${data}`);
        writeTLc(data);
    });
    socket.on('close', (data) => {
        console.log(`Browser close rq`);
        closeTLc();
    });
    socket.on('disconnect', (e) => {
        console.log("Browser disconnected");
    });
    socket.emit('info', 'IoT Manager connected\n');
});

function getTLcConfig() {
    return JSON.parse(tlc = JSON.stringify(tlc_if.list())); // Re parse as now should have IP addresses
}

function writeTLc(data) {
    if (tlcConnection)
        tlcConnection.write(`${data}\n`);
}

function closeTLc(status) {
    if (tlcConnection) {
        tlcConnection.end();
    }
    tlcStatus = status;
}

function connectToTLc(tlc, socket) {
    try {
        let tlcConfig = getTLcConfig()
        let t = tlcConfig.find((t) => t.Name == tlc);
        tlcConnection = net.createConnection(config.TLc.http_port, t.IPaddress, () => {
            console.log(`TLc (${tlc}) Connected`);
            tlcStatus = 'connected';
            tlcConnection.write(`GET /InstallationMonitor?SerialNo=${t.serNo}\n\n`);
            tlcConnection.setKeepAlive(true, 2000);
            tlcConnection.on('data', (data) => {
                tlcStatus = 'talking';
                console.log(`TLc response ${data}`);
                socket.emit('text', data.toString());
            });
            tlcConnection.on('close', () => {
                console.log('Connection closed');
                closeTLc('closed');
            });
            tlcConnection.on('error', (reason) => {
                console.error(`tlcConnection error `, reason);
                closeTLc('error');
            });
        });
    } catch (e) {
        console.error(`tlcConnection catch error: ${e.message}`);
        closeTLc('error');
    }
}

exports.show = function(request, response) {
    response.render('tlcMonitor',  {err: "", tlcConfig: getTLcConfig(), port: config.TLc.IoT_Manager_port});
}
