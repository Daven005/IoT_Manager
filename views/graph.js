function setupGraph(d, graphLabels, graphTypes, sensorIDs, settings, title) {
    graphData = JSON.parse(d);
    console.log(JSON.stringify(settings))
    var plotOptions = {
        height: 1000,
        title: title,
        highlighter: { show: true, sizeAdjust: 7.5, tooltipContentEditor: tooltipContentEditor },
        legend: { show: true, placement: 'outsideGrid', location: 's' },
        seriesDefaults: {
            rendererOptions: {
                smooth: 20
            }
        },
        cursor: {
            show: true,
            zoom: true
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.DateAxisRenderer,
                rendererOptions: { tickRenderer: $.jqplot.CanvasAxisTickRenderer },
                tickInterval: '1 hour', tickOptions: { formatString: '%d %H:%M', angle: 45 }
            },
            y5axis: { min: 0, max: 1000, tickInterval: 50 },
            y2axis: { min: 0, max: 10, tickInterval: 1 }
        },

        series: []
    };
    // alert(JSON.stringify(plotOptions));
    $.jqplot.eventListenerHooks.push(['jqplotClick', function (ev, seriesIndex, pointIndex, data) {
        try {
            if (data == null) return;
            $('#series').html(data.seriesIndex)
            if (sel == 0) {
                $('#coord1').html(data.pointIndex);
                sel = 1;
            } else {
                $('#coord2').html(data.pointIndex);
                sel = 0;
            }
        } catch (ex) {
            alert(ex);
        }
    }]);
    for (var idx = 0; idx < graphData.length; idx++) {
        plotOptions.series[idx] = { // Common settings
            renderer: $.jqplot.LineRenderer, disableStack: true,
            yaxis: 'yaxis', lineWidth: 2, markerOptions: { show: false },
            label: graphLabels[idx], showLabel: true
        };
        if (settings.selectedRows[idx].smooth) {
            plotOptions.series[idx].rendererOptions = { smooth: 10 };
        }
        switch (graphTypes[idx]) {
            case 'Level':
                plotOptions.series[idx].yaxis = 'y5axis';
                break;
            case 'Energy':
            case 'Power':
            case "Voltage":
                plotOptions.series[idx].yaxis = 'y3axis';
                break;
            case 'Pressure':
            case 'Flow':
            case 'FlowMax':
                plotOptions.series[idx].yaxis = 'y4axis';
                break;
            case 'TempDelta':
                plotOptions.series[idx].yaxis = 'y6axis';
                plotOptions.series[idx].canvasOverlay = {
                    show: true,
                    objects: [ {
                            dashedHorizontalLine: {
                                name: 'zero',
                                y: 0,
                                lineWidth: 2,
                                dashPattern: [16, 12],
                                color: 'rgb(100, 55, 255)',
                                shadow: false
                            }
                        }
                    ]
                };
                break;
            case 'Temp':
            case 'Hum':
            case 'Pump':
            case 'FlowTimes':
            case 'Vcc':
            case 'Attempts':
            case 'ConnectTime':
            case 'RSSI':
            case 'Speed':
                // Just the defaults
                break;
            case 'Input':
            case 'Output':
            case 'PIR':
            case 'PIR FAN ON':
            case 'PIR LIGHT ON':
            case 'Fan': // Shift these ones up a bit to be able to distyinguish them apart
                plotOptions.series[idx].yaxis = 'y2axis';
                var offset
                if (sensorIDs[idx] >= 10)
                    offset = (parseInt(sensorIDs[idx]) - 10) * 0.1;
                else
                    offset = parseInt(sensorIDs[idx]) * 0.1;
                for (var i = 0; i < graphData[idx].length; i++) {
                    graphData[idx][i][1] += offset;
                }
                break;
        }
    }
    console.log(">>>>>>"+JSON.stringify(plotOptions));
    var plot1 = $.jqplot('chart1', graphData, plotOptions);
}

function setupDailyGraph(d, graphLabels, graphTypes, sensorIDs, title) {
    try {
        var data = JSON.parse(d);
        var plotOptions = {
            height: 800,
            title: title,
            highlighter: { show: true, sizeAdjust: 7.5, tooltipContentEditor: tooltipContentEditor },
            //      legend:{show:false, placement: 'outsideGrid', location: 's'},
            cursor: {
                show: true,
                zoom: true
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    rendererOptions: { tickRenderer: $.jqplot.CanvasAxisTickRenderer },
                    tickInterval: '1 day', tickOptions: { formatString: '%#d %b', angle: 45 }
                },
                y2axis: { min: 0, max: 1100, tickInterval: 100 }
            },
            series: []
        };
        plotOptions.series[0] =
        {
            renderer: $.jqplot.LineRenderer, disableStack: true, yaxis: 'y2axis',
            lineWidth: 2, markerOptions: { show: false }, label: graphLabels[0], showLabel: false
        };
        var plot1 = $.jqplot('chart1', data, plotOptions);
    } catch (ex) {
        alert(ex);
    }
}

function toggleSelected() {
    $(this).find(".showSelected").each(function (idx, val) {
        if (val.textContent == "Selected")
            val.textContent = "Not Selected";
        else
            val.textContent = "Selected"
    });
    $(this).nextUntil("tr.accordion").toggle();
}

function doSum(series, start, finish) {
    var i, sum = 0;
    try {
        for (i = start; i <= finish; i++) {
            sum += graphData[series][i][1];
        }
        $('#sum').html(sum.toString());
    } catch (ex) {
        alert(ex);
    }
    return sum;
}

function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
    // display series_label, x-axis_tick, y-axis value
    try {
        var l = plot.legend._series[seriesIndex].label + ' ' + str;
        return l;
    } catch (ex) { alert(ex); }
}
