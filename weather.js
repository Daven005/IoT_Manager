var temps = {t: [0,  0,  0]};
var cloud = {c: [10, 10, 10]};
var wind  = {Avg: 0, Gust: 0};
var currentTemp = 0;
var sunNow = {az: 0, alt: 0 };
var sunHouse = [];
var sunGarage = [];
var rain = {today: 0 };
var ForecastIo = require('forecastio');
var forecastIo = new ForecastIo(config.forecastIoAPI);
var tides = require('./admiraltyTides');
var idx;
for (idx=0; idx<24; idx++) {
  sunHouse.push({az: 0, alt: 0 });
  sunGarage.push({az: 0, alt: 0 });
}
exports.publish = publish;
exports.publishSun = publishSun;

function publish() {
  client.publish('/App/Temp/current', JSON.stringify(currentTemp));
  client.publish('/App/Temp/hourly', JSON.stringify(temps));
  client.publish('/App/Cloud/hourly', JSON.stringify(cloud));
  client.publish('/App/Wind/avg', JSON.stringify(wind.Avg));
  client.publish('/App/Wind/gust', JSON.stringify(wind.Gust));
  client.publish('/App/Rain/today', JSON.stringify(rain.today));
}

function publishSun() {
  let s = '';
  client.publish('/App/Sun/current', JSON.stringify(sunNow));
  client.publish('/App/Sun/house/hourly', JSON.stringify(sunHouse.slice(0,3)));
  client.publish('/App/Sun/garage/hourly', s=JSON.stringify(sunGarage.slice(0,3)));
  console.log(s);
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

  forecastIo.forecast(config.latitude, config.longitude, options, (error, data) => {
    if (!error) {
      try {
        let idx;
        currentTemp = Math.round(data.currently.temperature);
        
        // This will get the temperature and wind info into the database
        client.publish('/Raw/Hollies000000/0/info', '{"Type": "Temp", "Value": '+data.currently.temperature+'}');
        client.publish('/Raw/Hollies000000/Wind Average/info', '{"Type": "Speed", "Value": '+data.currently.windSpeed+'}');
        client.publish('/Raw/Hollies000000/Wind Max/info', '{"Type": "Speed", "Value": '+data.currently.windGust+'}');
        client.publish('/App/weather/daily', JSON.stringify(data.daily.data));
        temps = { t:[Math.round(data.hourly.data[1].temperature),
                Math.round(data.hourly.data[2].temperature),
                Math.round(data.hourly.data[3].temperature) ] };
        let c = [];
        for (idx=0; idx<24; idx++) {
          c.push(Math.round(data.hourly.data[idx].cloudCover*10));
        }
        cloud = { c };
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
  sp = sunCalc.getPosition(moment(new Date()), config.latitude, config.longitude);
  sunNow = {az: Math.round(sp.azimuth * (180/Math.PI)), alt: Math.round(sp.altitude * (180/Math.PI))};
  sunHouse = [];
  sunGarage = [];
  for (idx=0; idx<12; idx++) {
    let tm;
    sp = sunCalc.getPosition(tm=moment(new Date()).add(idx, "hours"), config.latitude, config.longitude);
    let h = tm.add(30, 'minutes').format('H')
    sunHouse.push({ tm: h, az: Math.round(sp.azimuth * (180/Math.PI)-250+180), // Angle of plates = 250
      alt: Math.round(sp.altitude * (180/Math.PI)-40) }); // Angle of plates = 40
    sunGarage.push({ tm: h, az: Math.round(sp.azimuth * (180/Math.PI)-160+180), // Angle of plates = 160
        alt: Math.round(sp.altitude * (180/Math.PI)-30) }); // Angle of plates = 30
  }

  publishSun();
  tides.load();
}
