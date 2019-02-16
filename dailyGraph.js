var graph = {};
var utils = require('./utils');
var moment = require('moment');


function getData(graph, request, response) {

  function getGraphData(error, rows, fields) {
    var errorStr;
    var options = {};
    if (error) {
      console.log(error);
      console.log(sqlstr);
      errorStr = error.message;
    }
    options.data = "";
    var e, d;
    var graphPoint = 0;
    var graphData = [];
    var plot = [];
    for (e in rows) {
      d = [rows[e].Date, rows[e].Level];
      graphData[graphPoint++] = d;
    }
    plot[0] = graphData;
    options.data = JSON.stringify(plot);
    options.err = errorStr;
    response.render('dailyGraph', options);
  }
  
  var sqlstr =
    "SELECT FORMAT(AVG(temperaturelog.Value),1) As Level, DATE_FORMAT(temperaturelog.time, '%Y/%m/%d') AS Date FROM temperaturelog "+
    "INNER JOIN sensors ON temperaturelog.DeviceID = sensors.DeviceID AND temperaturelog.SensorID = sensors.SensorID "+
    "INNER JOIn devices ON devices.DeviceID = temperaturelog.DeviceID "+
    "WHERE devices.Name = 'level control' AND sensors.Name = 'level' "+
    "GROUP BY DATE(temperaturelog.Time)"
  db.query(sqlstr, getGraphData);
}



exports.show = function(request, response){
  getData(graph, request, response);
}
