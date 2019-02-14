function setupGraph(d, graphLabels, graphTypes, sensorIDs, title) {
  graphData = JSON.parse(d);
  var plotOptions = {
    height: 1000,
    title: title,
    highlighter: {show: true, sizeAdjust: 7.5, tooltipContentEditor:tooltipContentEditor},
    legend:{show:true, placement: 'outsideGrid', location: 's'},
    cursor:{ 
      show: true,
      zoom:true
    }, 
    axes:{
      xaxis:{renderer:$.jqplot.DateAxisRenderer, 
        rendererOptions: {tickRenderer:$.jqplot.CanvasAxisTickRenderer},
        tickInterval:'1 hour', tickOptions: {formatString: '%d %H:%M', angle: 45}},
      y5axis: {min:650, max:1000, tickInterval: 10},
      y2axis: {min:0, max:10, tickInterval: 1}
    },
    series:[]            
  };
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
    } catch(ex) {
      alert(ex);
    }
  }]);
  for (var idx=0; idx < graphData.length; idx++) {
    switch (graphTypes[idx]){
    case 'Level':
     plotOptions.series[idx] = {renderer: $.jqplot.LineRenderer, disableStack : true, 
                                yaxis: 'y5axis', lineWidth:2, markerOptions: {show: false}, 
                                label: graphLabels[idx], showLabel: true};
      break;
    case 'Energy':
    case 'Power':
    case "Voltage":
     plotOptions.series[idx] = {renderer: $.jqplot.LineRenderer, disableStack : true, 
                                yaxis: 'y3axis', lineWidth:2, markerOptions: {show: false}, 
                                label: graphLabels[idx], showLabel: true};
      break;
    case 'Pressure':
    case 'Flow':
    case 'FlowMax':
     plotOptions.series[idx] = {renderer: $.jqplot.LineRenderer, disableStack : true, 
                                yaxis: 'y4axis', lineWidth:2, markerOptions: {show: false}, 
                                label: graphLabels[idx], showLabel: true};
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
      plotOptions.series[idx] = {renderer: $.jqplot.LineRenderer, disableStack : true, 
                                yaxis: 'yaxis', lineWidth:2, markerOptions: {show: false}, 
                                label: graphLabels[idx], showLabel: true};
      break;
    case 'Input':
    case 'Output':
    case 'PIR':
    case 'PIR FAN ON':
    case 'PIR LIGHT ON':
    case 'Fan':
      plotOptions.series[idx] = {renderer: $.jqplot.LineRenderer, yaxis: 'y2axis', lineWidth:2, 
                                  markerOptions: {show: false}, label: graphLabels[idx], showLabel: true};
      var offset
      if (sensorIDs[idx] >= 10)
        offset = (parseInt(sensorIDs[idx]) - 10) * 0.1;
      else
        offset = parseInt(sensorIDs[idx]) * 0.1;
      for(var i=0; i<graphData[idx].length; i++) {
        graphData[idx][i][1] += offset;
      }
      break;
    }           
  }
  var plot1 = $.jqplot('chart1', graphData, plotOptions);
}

function setupDailyGraph(d, graphLabels, graphTypes, sensorIDs, title) {
  try {
    var data = JSON.parse(d);
    var plotOptions = {
      height: 800,
      title: title,
      highlighter: {show: true, sizeAdjust: 7.5, tooltipContentEditor:tooltipContentEditor},
//      legend:{show:false, placement: 'outsideGrid', location: 's'},
      cursor:{ 
        show: true,
        zoom:true
      }, 
      axes:{
        xaxis:{renderer:$.jqplot.DateAxisRenderer, 
          rendererOptions: {tickRenderer:$.jqplot.CanvasAxisTickRenderer},
          tickInterval:'1 day', tickOptions: {formatString: '%#d %b', angle: 45}},
        y2axis: {min:660, max:1100, tickInterval: 10}},
      series:[]            
    };
    plotOptions.series[0] = 
      { renderer: $.jqplot.LineRenderer, disableStack : true, yaxis: 'y2axis', 
        lineWidth:2, markerOptions: {show: false}, label: graphLabels[0], showLabel: false};
    var plot1 = $.jqplot('chart1', data, plotOptions);
  } catch(ex) {
    alert(ex); 
  }
}

function toggleSelected(){
  $(this).find(".showSelected").each(function(idx, val) { 
    if (val.textContent == "Selected")
      val.textContent = "Not Selected";
    else
      val.textContent = "Selected"
  });
  $(this).nextUntil("tr.accordion").toggle();
}

function doSum(series, start, finish) {
  var i, sum=0;
  try {
    for (i=start; i<=finish; i++) {
      sum += graphData[series][i][1];
    }
    $('#sum').html(sum.toString());
  } catch(ex) {
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
