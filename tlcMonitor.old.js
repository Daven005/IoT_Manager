"use strict";
var tlc_if = require('./tlcInterface');

let server = require('http').createServer(app);
let io = require('socket.io')(server);

const PORT = process.env.PORT || 5001;

var tlcConfig;
var tlc = 'none';
var browserConnectionStatus = 'open';
var serverConnectionStatus = 'closed';

// const tlc_if_list = [  
//     {"Name": "Hollies-F", "serNo": "2810eb3e040000", "online": false, IPaddress: '192.168.1.82', "Location": "Family"},
//     {"Name": "Hollies-L", "serNo": "28f34bb6040000", "online": false, IPaddress: '192.168.1.81', "Location": "Lounge"},
//     {"Name": "Hollies-G", "serNo": "28ffd928681402", "online": false, IPaddress: '192.168.1.83', "Location": "Garage"},
//     {"Name": "Hollies-Test", "serNo": "28c52d3f040000", "online": false, IPaddress: '192.168.1.214', "Location": "Office"} 
// ];

function getTLcConfig() {
    // tlcConfig = JSON.parse(tlc = JSON.stringify(tlc_if_list)); // TEST VERSION Re parse as now should have IP addresses
    return JSON.parse(tlc = JSON.stringify(tlc_if.list())); // Re parse as now should have IP addresses
}

exports.show = function(request, response) {
    response.render('tlcMonitor',  {err: "", tlcConfig: getTLcConfig()});
}

exports.open = function(request, response) {
    function browserClose(s) {
        if (browserConnectionStatus == 'open') {
            response.end(`{"result": "${s}"}`);
            browserConnectionStatus = 'closed';
        }
    }
    function connectToTLc(socket) {
        try {
            var tlcConnection = net.createConnection(config.TLc.http_port, t.IPaddress, () => {
                console.log('TLc Connected');
                tlcConnection.write(`GET /InstallationMonitor?SerialNo=${t.serNo}\n\n`);
            });

            tlcConnection.on('data', function (data) {
                browserClose('connected');
                console.log(`TLc response ${data}`);
                bfr += data;
                io.emit('text', data);
            });

            tlcConnection.on('close', function () {
                console.log('Connection closed');
                browserClose("tlcConnection Closed");
            });

            tlcConnection.on('error', (reason) => {
                console.error(`tlcConnection error ${JSON.stringify(reason)}`);
            });

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected.`);
                browserClose('Sever disconnected');
            });
            socket.on('error', (reason) => {
                console.error(`io socket error ${JSON.stringify(reason)}`);
                browserClose('Server error');
            });        
        } catch (ex) {
            console.error(`tlcConnection catch error: ${ex.message}`);
        }
    }
    var bfr = '';
    tlcConfig = getTLcConfig();
    tlc = request.query.tlc;
    t = tlcConfig.find(t => t.Name == tlc);
    try { // Set up Monitor Server
        if (serverConnectionStatus != 'closed') {
            let errMsg;
            console.error(`Server already ${serverConnectionStatus}`);
            server.close((err) => {
                if (err) {
                    console.error(errMsg = `Server Close error: ${err}`);
                    browserClose(errMsg);
                }
            });
        }

        server.on('connect', (socket) => {
            console.log(`Socket ${socket.id} connected.`);
            connectToTLc(socket);
            browserClose("Server Connected");
        });

        // server.listen(PORT, (e) => {
        //     serverConnectionStatus = 'listening';
        //     browserClose('listening');
        //     server.listeners()
        //     console.log(`Server started listening (${server.listening}) on ${PORT}`);
        //     if (e) console.error(`${e.message}`);
        // });    

    } catch (ex) {
        let errMsg;
        console.error(errMsg = `Server catch error: ${ex.message}`);
        browserClose(errMsg);
    }
}