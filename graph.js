var graph = {};
var utils = require('./utils');
var moment = require('moment');
var fs = require('fs');
var login = require('./login');

function checkSaveFile() {
    if (graph.saveFile && graph.filename) {
        console.log("Saving: %s", graph.fileName);
        fs.writeFile(graph.fileName, JSON.stringify(graph), function (err) {
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
        settings: {
            selectedRows: graph.selection,
            date: request.query.date, startHour: request.query.startHour, duration: request.query.days
        }
    };
    var sensorSelected = false;

    function getNameSelection(options) {
        if (typeof options.settings.selectedRows == 'undefined') return "FALSE";
        let s = "(";
        for (row of options.settings.selectedRows) {
            if (s.length != 1) {
                s = s + " OR ";
            }
            s = s + `(DeviceID = "${row.DeviceID}" AND SensorID = "${row.SensorID}")`;
        }
        return s + ')';
    }

    function getGraphData(error, rows) {
        var errorStr;
        // console.log("getGraphData");
        if (error) {
            console.error(err)
            errorStr = error.message;
        }
        var previousRow = { d: "", s: "" };
        var thisRow = { d: "", s: "" };
        var _data = [];
        var graphData = [];
        var graphTypes = [];
        var graphLabels = [];
        var graphSensorIDs = [];
        var graphNumber = 0;
        var graphPoint = 0;
        var row, d;

        for (row in rows) { // of db data
            thisRow = { d: rows[row].DeviceID, s: rows[row].SensorID };
            if (!rowEql(thisRow, previousRow)) { // Next device/sensor
                if (graphData.length > 0) {
                    _data[graphNumber] = checkNegate(previousRow, graphData);
                    graphLabels[graphNumber] = getNames(previousRow);
                    graphTypes[graphNumber] = getType(previousRow);
                    graphSensorIDs[graphNumber] = getSensorID(previousRow);
                    graphNumber++;
                    graphData = [];
                    graphPoint = 0;
                }
                rowCpy(previousRow, thisRow);
            }
            d = [rows[row].Time, rows[row].value];
            graphData[graphPoint++] = d;
        }
        _data[graphNumber] = checkNegate(thisRow, graphData);
        graphLabels[graphNumber] = getNames(thisRow);
        graphTypes[graphNumber] = getType(thisRow);
        graphSensorIDs[graphNumber] = getSensorID(thisRow);
        options.graphLabels = JSON.stringify(graphLabels);
        options.graphTypes = JSON.stringify(graphTypes);
        options.sensorIDs = JSON.stringify(graphSensorIDs);
        // console.log(`++++> ${JSON.stringify(options)}`); // Before data added
        // console.log('====>', _data[0][0], _data[1][0])
        options.data = JSON.stringify(_data);
        options.err = errorStr;
        checkSaveFile();
        response.render('graph', options);

        function getNames(row) {
            var d;
            for (d in options.sensors) {
                if (options.sensors[d].DeviceID == row.d && options.sensors[d].SensorID == row.s) {
                    return options.sensors[d].Location + '-' + options.sensors[d].DeviceName + '-' + options.sensors[d].SensorName;
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
    
        function getSensorNegate(row) {
            for (var d of graph.selection) {
                if (d.DeviceID == row.d && d.SensorID == row.s) {
                    console.log('///', d)
                    return d.negate;
                }
            }
            return false;
        }
    
        function rowEql(a, b) {
            return (a.d == b.d && a.s == b.s);
        }
    
        function rowCpy(a, b) {
            a.d = b.d;
            a.s = b.s;
        }
    
        function checkNegate(row, graphData) {  // graphData in form [][time, value]
            if (getSensorNegate(row)) {
                console.log('-ve')
                var g = graphData.map(d => {
                    d[1] = -d[1];
                    return d;
                });
                return g;
            } else {
                console.log('+ve')
                return graphData;
            }
        }
    }

    var idx;
    var selection;

    if (request.query.Action == "Select") {
        options.settings.selectedRows = [];
        console.log(request.query);
        Object.keys(request.query).forEach((key) => {
            if (key.match(/^row-/)) {
                if (request.query[key] != 'Off') {
                    selection = key.slice(4).split('/'); // Remove 'row-' then get deviceID and SensorID
                    let sel = {
                        DeviceID: selection[0], SensorID: selection[1],
                        smooth: (request.query[key][0] == 'Smooth'),
                        negate: (request.query[key][1] == 'Negate')
                    };
                    console.log(sel)
                    options.settings.selectedRows.push(sel);
                }
            }
        });
        graph.selection = options.settings.selectedRows.slice(0);
    } else {
        if (typeof graph.selection != 'undefined') {
            options.settings.selectedRows = graph.selection.slice(0);
        }
        console.log("selRows: %j", options.settings.selectedRows);
        if (typeof options.settings.duration == 'undefined')
            options.settings.duration = 1
    }
    if (options.settings.selectedRows)
        sensorSelected = options.settings.selectedRows.length > 0;
    else
        sensorSelected = false;
    console.log("===>", graph.selection, options.settings.date, options.settings.duration);
    if (sensorSelected && options.settings.date && options.settings.duration) {
        var sqlstr =
            "SELECT DeviceID, SensorID, DATE_FORMAT(time, '%Y/%m/%d %H:%i:%s') AS Time, value " +
            "FROM temperaturelog " +
            "WHERE **N** AND Time >= ? and Time < ? " +
            "ORDER BY DeviceID, SensorID, Time";
        sqlstr = sqlstr.replace('**N**', getNameSelection(options));
        sqlstr = sql.format(sqlstr,
            [moment(options.settings.date).add(options.settings.startHour, 'hours').format('YYYY-MM-DD HH:mm:ss'),
            moment(options.settings.date).add(options.settings.duration, 'days').format('YYYY-MM-DD HH:mm:ss')]);
        // console.log(sqlstr)
        options.sql = sqlstr;
        db.query(sqlstr, getGraphData);
    } else {
        checkSaveFile();
        response.render('graph', options);
    }
}

function emptyGraph(id) {
    // console.log("Empty graph %d", id);
    return { selection: [], filename: "temp.js", saveFile: false };
}

exports.show = function (request, response) {
    try {
        var fileName;

        if (request.query.Action == "Save As") {
            if (login.check(request, response)) {
                var fn = request.query.file;
                var fileName = 'graph/' + fn + '.js';
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
            fileName = 'graph/' + request.query.read;
            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err, fileName);
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
            console.error("No such file: %s", fileName);
            graph = emptyGraph(3);
            checkOnlineDevicesAndGetData(graph, request, response);
        }
    } catch (err) {
        console.error(err);
        checkOnlineDevicesAndGetData(graph, request, response);
    }

    function checkOnlineDevicesAndGetData(graph, request, response) {
        db.query(utils.sqlDevicesSensors(false), function (error, names, fields) {
            if (error) {
                console.error(error);
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
}
