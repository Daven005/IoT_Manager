"use strict"

exports.get = function (request, response) {
    function _info(s) { info(s, response) }
    function _done(s) { done(s, response) }
    async function asyncGet(request, response) {
        let Action = request.query.Action
        switch (Action) {
            case 'Solcast':
                writeHeader('Solcast', response);
                await PV.processSolcast(_info, _done)
                    .catch(e => console.error('ps ', e));
                break;
            case 'PassiveL':
            case 'SolarEdge':
                // Covered by POST in processPV
                return;
            default:
                response.render('commands', []);
        }
    }
    asyncGet(request, response).catch(e => console.log(`asyncGet error: ${e}`));
}

exports.done = done;
function done(s, response) {
    if (s) response.write(s + '<br>'); else response.write('done?.');
    response.write('</div><a href="/commands">Finished</a></body>')
    response.end();
}

exports.info = info
function info(s, response) {
    if (s) response.write(s + '<br>'); else response.write('info?.');
}

exports.writeHeader = writeHeader
function writeHeader(system, response) {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write('<title>Command Results</title>');
    response.write(`<body><h2>Process ${system}</h2><div>`);
}