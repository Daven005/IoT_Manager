var elecCosts = [];
setInterval(getRates, 1*60*1000);

getRates();

function getContent(url) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const request = http.get(url, (response) => {        
      var body = [];
      if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => {reject(err)});
  });
};

function getRates() {
    getContent(config.charge.ratesURL)
    .then ((json) => {
        var rates = JSON.parse(json);
        elecCosts = [];
        rates.sort((a, b) => a.value_inc_vat - b.value_inc_vat);
        var temp = rates.splice(0, 8);
        temp.sort((a, b) => moment(a.valid_from) - moment(b.valid_from));
        temp.forEach((r) => elecCosts.push({t: new Date(r.valid_from).getTime(), r: r.value_inc_vat}));
        client.publish('/App/elec/rates', JSON.stringify(elecCosts));
        // console.log(JSON.stringify(elecCosts));
    })
    .catch((error) => 
      console.log(error));
}

exports.test = function() {
    
}

exports.rates = function(request, response) {
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(elecCosts));
}

exports.status = function(request, response) {
    
}

exports.control = function(request, response) {
    
}
