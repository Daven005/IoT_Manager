var temps = {t: [0,  0,  0]};
var cloud = {c: [10, 10, 10]};
var wind  = {Avg: 0, Gust: 0};
var currentTemp = 0;
var sun = [{az: 0, alt: 0 }, {az: 0, alt: 0 }, {az: 0, alt: 0 }];
var rain = {today: 0 };
var ForecastIo = require('forecastio');
var forecastIo = new ForecastIo(config.forecastIoAPI);
var tides = require('./admiraltyTides');

exports.publish = publish;

function publish() {
  client.publish('/App/Temp/current', JSON.stringify(currentTemp));
  client.publish('/App/Temp/hourly', JSON.stringify(temps));
  client.publish('/App/Cloud/hourly', JSON.stringify(cloud));
  client.publish('/App/Sun/current', JSON.stringify(sun[0]));
  client.publish('/App/Sun/hourly', JSON.stringify(sun));
  client.publish('/App/Wind/avg', JSON.stringify(wind.Avg));
  client.publish('/App/Wind/gust', JSON.stringify(wind.Gust));
  client.publish('/App/Rain/today', JSON.stringify(rain.today));
}

exports.get = get;

exports.currentTemperature = function() {return currentTemp;}
exports.rainToday = function() {return rain.today;}

function get(){
  var options = {
    units: 'uk',
    exclude: 'minutely,flags'
  };
  function resetWeather() {
    temps = {t: [ 0,  0,  0]};
    cloud = {c: [10, 10, 10]};
    wind  = {Avg: 0, Gust: 0};
    rain = {today: 0 };
  }
  forecastIo.forecast(config.latitude, config.longitude, options, function(error, data) {
    if (!error) {
      try {
        currentTemp = Math.round(data.currently.temperature);
        
        // This will get the temperature and wind info into the database
        client.publish('/Raw/Hollies000000/0/info', '{"Type": "Temp", "Value": '+data.currently.temperature+'}');
        client.publish('/Raw/Hollies000000/Wind Average/info', '{"Type": "Speed", "Value": '+data.currently.windSpeed+'}');
        client.publish('/Raw/Hollies000000/Wind Max/info', '{"Type": "Speed", "Value": '+data.currently.windGust+'}');
        client.publish('/App/weather/daily', JSON.stringify(data.daily.data));
        temps = { t:[Math.round(data.hourly.data[1].temperature),
                Math.round(data.hourly.data[2].temperature),
                Math.round(data.hourly.data[3].temperature) ] };
        cloud = { c:[Math.round(data.hourly.data[0].cloudCover*10),
                Math.round(data.hourly.data[1].cloudCover*10),
                Math.round(data.hourly.data[2].cloudCover*10) ] };
        wind.Avg = Math.round(data.currently.windSpeed);
        wind.Gust = Math.round(data.currently.windGust);
        rain.today = data.daily.data[0].precipIntensity * data.daily.data[0].precipProbability;

        publish();
      } catch (ex) {
        resetWeather();
        console.log("Forecast data error: %j, %j", ex, data);
      }
    } else {
      resetWeather();
      console.log("Forecast error: %j", error);
    }
  });
  var idx;
  var sp;
  for (idx=0; idx<3; idx++) {
    sp = sunCalc.getPosition(moment(new Date()).add(idx, "hours"), config.latitude, config.longitude);
    sun[idx] = { az: Math.round(sp.azimuth * (180/Math.PI)-162+180), // Angle of plates = 162
            alt: Math.round(sp.altitude * (180/Math.PI)-45) }; // Angle of plates = 45
  }
  tides.load();
}
