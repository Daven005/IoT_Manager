"use strict"

exports.get = function (request, response) {
    async function asyncGet(request, response) {
        let Action = request.query.Action
        switch (Action) {
            case 'Solcast':
                response.writeHeader(200, { "Content-Type": "text/html" });
                response.write('<h2>Process Solcast</h2><div>');
                await PV.processSolcast(info, done)
                    .catch(e => console.error('ps ', e));
                break;
            default:
                response.render('commands', []);
        }
    }

    function done(s) {
        if (s) response.write(s + '<br>'); else response.write('done?.');
        response.write('</div><a href="/commands">Finished</a>')
        response.end();
    }

    function info(s) {
        if (s) response.write(s + '<br>'); else response.write('info?.');
    }

    asyncGet(request, response).catch(e => console.log(`asyncGet error: ${e}`));
}