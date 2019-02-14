var graph = {};
var utils = require('./utils');
var moment = require('moment');
var fs = require('fs');
var login = require('./login');

function checkSaveFile() {
  if (graph.saveFile && graph.filename) {
    console.log("Saving: %s", graph.fileName);
    fs.writeFile(graph.fileName, JSON.stringify(graph), function(err) {
      if (err) {
        console.log(err);
        graph.err = err;
      }
      graph.saveFile = false;
    });
  }
}

function checkGraphSettings(graph, request, response) {
  if (!request.query.date) {
    request.query.date = moment(Date.now()).format('YYYY-MM-DD');
  }
  var options = {
    sensors: graph.onlineNames, 
    settings:{selectedRows: graph.selection, 
      date:request.query.date, startHour: request.query.startHour, duration:request.query.days}
  };
  var sensorSelected = false;
  
  function getNameSelection(options) {
    if (typeof options.settings.selectedRows == 'undefined') return "FALSE";
    var s = "(";
    var idx;
    for (idx = 0; idx < options.settings.selectedRows.length; idx++) {
      if (s.length != 1) {
        s = s + " OR ";
      }
      s = s + '(DeviceID = "'  + options.settings.selectedRows[idx].DeviceID +
        '" AND SensorID = "' + options.settings.selectedRows[idx].SensorID + '")';
    }
    return s+')';
  }

  function getNames(row) {
    var d;
    for (d in options.sensors) {
      if (options.sensors[d].DeviceID == row.d && options.sensors[d].SensorID == row.s) {
        return options.sensors[d].Location+'-'+options.sensors[d].DeviceName+'-'+options.sensors[d].SensorName;
      }
    }
    return '?-?-?';
  }

  function getType(row) {
    var d;
    for (d in options.sensors) {
      if (options.sensors[d].DeviceID == row.d && options.sensors[d].SensorID == row.s) {
        return options.sensors[d].SensorType;
      }
    }
    return '?';
  }

  function getSensorID(row) {
    var d;
    for (d in options.sensors) {
      if (options.sensors[d].DeviceID == row.d && options.sensors[d].SensorID == row.s) {
        return options.sensors[d].SensorID;
      }
    }
    return 0;
  }

  function rowEql(a, b) {
    return (a.d == b.d && a.s == b.s);
  }

  function rowCpy(a, b) {
    a.d = b.d;
    a.s = b.s;
  }

  function getGraphData(error, rows, fields) {
    var errorStr;
    // console.log("getGraphData");
    if (error) {
      console.log(error);
      errorStr = error.message;
    }
    var previousRow = {d:"", s:""};
    var thisRow = {d:"", s:""};
    var _data = [];
    var graphData = [];
    var graphTypes = [];
    var graphLabels = [];
    var graphSensorIDs = [];
    var graphNumber = 0;
    var graphPoint = 0;
    var e, d;

    for (e in rows) {
      thisRow = {d:rows[e].DeviceID, s:rows[e].SensorID};
      if (!rowEql(thisRow, previousRow)) { // Next device/sensor
        if (graphData.length > 0) {
          _data[graphNumber] = graphData; // Add all of last device/sensor's data to _data
          graphLabels[graphNumber] = getNames(previousRow);
          graphTypes[graphNumber] = getType(previousRow);
          graphSensorIDs[graphNumber] = getSensorID(previousRow);
          graphNumber++;
          graphData = [];
          graphPoint = 0;
        }
        rowCpy(previousRow, thisRow);
      }
      d = [rows[e].Time, rows[e].value];
      graphData[graphPoint++] = d;
    } // for()
    _data[graphNumber] = graphData;
    graphLabels[graphNumber] = getNames(thisRow);
    graphTypes[graphNumber] = getType(thisRow);
    graphSensorIDs[graphNumber] = getSensorID(thisRow);
    options.graphLabels = JSON.stringify(graphLabels);
    options.graphTypes = JSON.stringify(graphTypes);
    options.sensorIDs = JSON.stringify(graphSensorIDs);
    options.data = JSON.stringify(_data);
    options.err = errorStr;
    checkSaveFile();
    response.render('graph', options);
  }
  
  var idx;
  var selection;

  if (request.query.Action == "Select") {
    options.settings.selectedRows = [];
    Object.keys(request.query).forEach(function(key) {
       if (key.indexOf('row-') == 0) {
        selection = key.slice(4).split('/');
        options.settings.selectedRows.push({"DeviceID": selection[0], "SensorID":selection[1]});
      }
    });
    graph.selection = options.settings.selectedRows.slice(0);
  } else {
    if (typeof graph.selection != 'undefined') {
      options.settings.selectedRows = graph.selection.slice(0);
    }
    // console.log("selRows: %j", options.settings.selectedRows);
    if (typeof options.settings.duration == 'undefined') 
      options.settings.duration = 1
  }
  if (options.settings.selectedRows)
    sensorSelected = options.settings.selectedRows.length > 0;
  else
    sensorSelected = false;
  // console.log(graph.selection, options.settings.date, options.settings.duration);
  if (sensorSelected && options.settings.date && options.settings.duration) {
    var sqlstr =
      "SELECT DeviceID, SensorID, DATE_FORMAT(time, '%Y/%m/%d %H:%i:%s') AS Time, value "+
      "FROM temperaturelog "+
      "WHERE **N** AND Time >= ? and Time < ? "+
      "ORDER BY DeviceID, SensorID, Time";
    sqlstr = sqlstr.replace('**N**', getNameSelection(options));
    sqlstr = sql.format(sqlstr,
      [moment(options.settings.date).add(options.settings.startHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      moment(options.settings.date).add(options.settings.duration, 'days').format('YYYY-MM-DD HH:mm:ss')]);
    // console.log(sqlstr)
    db.query(sqlstr, getGraphData);
  } else {
    checkSaveFile();
    response.render('graph', options);
  }
}

function emptyGraph(id) {
  // console.log("Empty graph %d", id);
  return {selection: [], filename: "temp.js", saveFile: false};
}

exports.show = function(request, response){

  function checkOnlineDevicesAndGetData(graph, request, response) {
    db.query(utils.sqlDevicesSensors(false), function(error, names, fields) {
      if (error) {
        console.log(error);
      }
      graph.onlineNames = [];
      var n, state;
      for (n in names) {
        state = deviceState.get(names[n].DeviceID);
        if (typeof state != 'undefined') {
          if (typeof state.online != 'undefined') {
            graph.onlineNames.push(names[n]);
          }
        }
      }
      checkGraphSettings(graph, request, response);
   });
  }
  
  // console.log("webGraph");
  try {
    var fileName;
  
    if (request.query.Action == "Save As") {
      if (login.check(request, response)) {
        var fn = request.query.file;
        var fileName = 'graph/'+fn+'.js';
        if (!fn.match('[A-Za-z0-9_\-]')) {
          graph.err = "Invalid file name";
        } else {
          graph.fileName = fileName;
          graph.saveFile = true;
        }
        checkOnlineDevicesAndGetData(graph, request, response);
      }
    } else if (request.query.new) {
      graph = emptyGraph(1);
      checkOnlineDevicesAndGetData(graph, request, response);
    } else if (request.query.read) {
      fileName = 'graph/'+request.query.read;
      fs.exists(fileName, function(exists) {
        if (exists) {
          fs.readFile(fileName, 'utf8', function(err, data) {
            if (err) {
              console.log(err);
              graph = emptyGraph(2);
              graph.err = err;
            } else {
              graph = JSON.parse(data);
            }
            graph.fileName = fileName;
            // console.log("G: %j", graph.selection);
            checkOnlineDevicesAndGetData(graph, request, response);
          });
        } else {
          console.log("No such file: %s", fileName);
          graph = emptyGraph(3);
          checkOnlineDevicesAndGetData(graph, request, response);
        }
      });
    } else {
      graph = emptyGraph(3);
      checkOnlineDevicesAndGetData(graph, request, response);
    }
  } catch(err) {
    console.log(err);
    checkOnlineDevicesAndGetData(graph, request, response);
  }
}
