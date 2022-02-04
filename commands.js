"use strict"
 exports.get = async function(request, response) {
    let action = request.query.action
    switch (Action) {
        case 'solcast':
            response.writeHeader(200, {"Content-Type": "text/html"});  
            response.write('<h1>Process Solcast</h1><div>');  
            response.write(await PV.processSolcast(info));
            response.write('</div><a href="/commands">Finished</a>')
            response.end();
        break;
        default:
            response.render('commands', []);
    }

    function info(s) {
        response.write(s + '<br>');
    }
 }