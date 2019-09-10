var ForecastIo = require('forecastio');
var forecastIo = new ForecastIo(config.weather.forecastIoAPI);

var temps = {
  t: [0, 0, 0]
};
var cloud = {
  c: [10, 10, 10]
};
var wind = {
  Avg: 0,
  Gust: 0
};
var currentTemp = 0;
var rain = {
  today: 0
};

exports.load = load;
exports.currentTemperature = function () {
  return currentTemp;
}
exports.rainToday = function () {
  return rain.today;
}
exports.publish = publish;

function publish() {
  checkWeatherPublish('/App/Temp/current', JSON.stringify(currentTemp));
  checkWeatherPublish('/App/Temp/hourly', JSON.stringify(temps));
  checkWeatherPublish('/App/Cloud/hourly', JSON.stringify(cloud));
  checkWeatherPublish('/App/Wind/avg', JSON.stringify(wind.Avg));
  checkWeatherPublish('/App/Wind/gust', JSON.stringify(wind.Gust));
  checkWeatherPublish('/App/Rain/today', JSON.stringify(rain.today));
}

function checkWeatherPublish(topic, payload) {
  if (config.weather.publish)
    client.publish(topic, payload);
  else
    console.log(`${topic} ==> ${payload}`);
}
function load(callback) {
  var options = {
    units: 'uk',
    exclude: 'minutely,flags'
  };

  function resetWeather() {
    temps = {
      t: [0, 0, 0]
    };
    cloud = {
      c: [10, 10, 10]
    };
    wind = {
      Avg: 0,
      Gust: 0
    };
    rain = {
      today: 0
    };
  }



  forecastIo.forecast(config.latitude, config.longitude, options)
    .then((data) => {
      try {
        let idx;
        currentTemp = Math.round(data.currently.temperature);

        // This will get the temperature and wind info into the database
        checkWeatherPublish('/Raw/Hollies000000/0/info', '{"Type": "Temp", "Value": ' + data.currently.temperature + '}');
        checkWeatherPublish('/Raw/Hollies000000/Wind Average/info', '{"Type": "Speed", "Value": ' + data.currently.windSpeed + '}');
        checkWeatherPublish('/Raw/Hollies000000/Wind Max/info', '{"Type": "Speed", "Value": ' + data.currently.windGust + '}');
        checkWeatherPublish('/App/weather/daily', JSON.stringify(data.daily.data));
        temps = {
          t: [Math.round(data.hourly.data[1].temperature),
          Math.round(data.hourly.data[2].temperature),
          Math.round(data.hourly.data[3].temperature)
          ]
        };
        let c = [];
        for (idx = 0; idx < 24; idx++) {
          c.push(Math.round(data.hourly.data[idx].cloudCover * 10));
        }
        cloud = {
          c
        };
        wind.Avg = Math.round(data.currently.windSpeed);
        wind.Gust = Math.round(data.currently.windGust);
        rain.today = data.daily.data[0].precipIntensity * data.daily.data[0].precipProbability;
        if (callback) callback();
      } catch (ex) {
        resetWeather();
        console.log(`Forecast data error: ${ex}`);
      }
    })
    .catch((error) => {
      resetWeather();
      console.log(`Forecast error: ${error}`);
    });
}