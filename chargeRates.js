var elecCosts = [];
setInterval(getRates, 1*60*1000);
getRates();

const getContent = function(url) {
    return new Promise((resolve, reject) => {
      const http= require('http');
      const request = http.get(url, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
           reject(new Error('Failed to load page, status code: ' + response.statusCode));
         }
        const body = [];
        response.on('data', (chunk) => body.push(chunk));
        response.on('end', () => resolve(body.join('')));
      });
      request.on('error', (err) => reject(err));
    });
};

function getRates() {
    getContent(config.charge.ratesURL)
    .then ((json) => {
        var rates = JSON.parse(json);
        elecCosts = [];
        rates.sort((a, b) => {
            return a.value_inc_vat - b.value_inc_vat;
        });
        var temp = rates.splice(0, 7);
        temp.forEach((r) => elecCosts.push({t: r.valid_from, r: value_inc_vat}));
        console.log(elecCosts);
    })
    .catch((error) => console.log(error));
}

exports.test = function() {
    console.log(elecCosts);
}

exports.rates = function(request, response) {
    
}

exports.status = function(request, response) {
    
}

exports.control = function(request, response) {
    
}
