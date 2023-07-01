axios = require('axios');
var apiKey = '01087b9993c21f387771983e655a754f';
var url = 'https://api.openweathermap.org/data/3.0/onecall';
var lati = 50.82656702724442;
var longi = -1.340523851589267;
var data;
var u = `${url}?lat=${lati}&lon=${longi}&appid=${apiKey}&units=metric&exclude=alerts`;

var temps = {
  t: [0, 0, 0]
};
var cloud = {
  startTime: 0,
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
const avgPressure = 1013;
var pressure = [avgPressure, avgPressure, avgPressure, avgPressure, avgPressure, avgPressure, avgPressure];

var rqCloudCB = null;
exports.rqCloud = function (cb) {
  rqCloudCB = cb;
}

exports.load = load;
exports.publish = publish;

exports.currentTemperature = function () {
  return currentTemp;
}
exports.rainToday = function () {
  return rain.today;
}
exports.getCloud = function () {
  return cloud;
}
exports.avgPressure = function () {
  return avgPressure;
}
exports.getPressure = function (day) {
  if (0 <= day && day <= 6) return pressure[day];
  return 1013;
}

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
  function resetWeather() {
    temps = {
      t: [0, 0, 0]
    };
    cloud = {
      startTime: 0,
      c: [-1, -1, -1]
    };
    wind = {
      Avg: 0,
      Gust: 0
    };
    rain = {
      today: 0
    };
  }

  axios.get(u)
    .then((response) => {
      let idx;
      let currently = response.data.current;
      let hourly = response.data.hourly;
      let daily = response.data.daily;
      currentTemp = Math.round(currently.temp);

      // This will get the temperature and wind info into the database
      checkWeatherPublish('/Raw/Hollies000000/0/info', 
        `{"Type": "Temp", "Value": ${currently.temp}}`);
      checkWeatherPublish('/Raw/Hollies000000/Wind Average/info', 
        `{"Type": "Speed", "Value": ${currently.wind_speed}}`);
      checkWeatherPublish('/Raw/Hollies000000/Wind Max/info', 
        `{"Type": "Speed", "Value": ${hourly[0].wind_gust}}`);
      // checkWeatherPublish('/App/weather/daily', JSON.stringify(data.daily.data));
      temps = {
        t: [Math.round(hourly[1].temp),
        Math.round(hourly[2].temp),
        Math.round(hourly[3].temp)
        ]
      };

      let c = [];
      for (idx = 0; idx < 24; idx++) {
        c.push(Math.round(hourly[idx].clouds * 100));
      }
      cloud = {
        startTime: new Date(hourly[0].dt * 1000),
        c
      };
      if (rqCloudCB) rqCloudCB(cloud);

      wind.Avg = Math.round(currently.wind_speed);
      wind.Gust = Math.round(currently.wind_gust);
      rain.today = daily[0].rain;
      for (idx = 0; idx <= 6; idx++) {
        pressure[idx] = daily[idx].pressure;
      }

      if (callback) callback();
    })

    .catch((error) => {
      resetWeather();
      console.error(`Forecast error: ${error}`);
    });
}