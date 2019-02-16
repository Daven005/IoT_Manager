function clearSelect(s) {
  $(s+' option').each(function() {
    this.remove();
  });
}

function makeDeviceSelect(json, s, id) {
  $.each(json, function(i, value) {
    if (id == value.DeviceID)
      $(s).append($('<option selected>').text(value.Location+'-'+value.name).attr('value', value.DeviceID));
    else
      $(s).append($('<option>').text(value.Location+'-'+value.name).attr('value', value.DeviceID));
  });  
}

function makeSensorSelect(json, s, id) {
  $.each(json, function(i, value) {
    if (id == value.DeviceID)
      $(s).append($('<option selected>').text(value.name).attr('value', value.sensorID));
    else
      $(s).append($('<option>').text(value.name).attr('value', value.sensorID));
  });  
}

function makeDaysSelect(json, s, id) {
  $.each(json, function(i, value) {
    if (id == value.ID)
      $(s).append($('<option selected>').text(value.Name).attr('value', value.ID));
    else
      $(s).append($('<option>').text(value.Name).attr('value', value.ID));
  });  
}

function setTemperatureDevice(zoneID, id) {
  $("#Dialog").dialog({title: "Select Temperature Device"});
  $("#Dialog").attr('userID', zoneID);
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: "/Heating/temperatureDevice",
    success: function(json) {
      clearSelect('#select');
      makeDeviceSelect(json, '#select', id);
    }
  });
  $("#Dialog").dialog("open");
}

function updateTemperatureDevice(name, id) {
  var zoneID = $("#Dialog").attr('userID');
  $('#zones #'+zoneID+' #TemperatureDeviceID').attr('value', id);
  $('#zones #'+zoneID+' #TDname').html(name).addClass('updated');
}

function setTemperatureSensor(zoneID, id, deviceID) {
  $("#Dialog").dialog({title: "Select Temperature Sensor"});
  $("#Dialog").attr('userID', zoneID);
  $.ajax({
    method: "GET",
    data: {device: deviceID},
    dataType: 'json',
    url: "/Heating/temperatureSensor",
    success: function(json) {
      clearSelect('#select');
      makeSensorSelect(json, '#select', id);
    }
  });
  $("#Dialog").dialog("open");
}

function updateTemperatureSensor(name, id) {
  var zoneID = $("#Dialog").attr('userID');
  $('#zones #'+zoneID+' #TemperatureSensorID').attr('value', id);
  $('#zones #'+zoneID+' #TSname').html(name).addClass('updated');
}

function setControlDevice(zoneID, id) {
  $("#Dialog").dialog({title: "Select Control Device"});
  $("#Dialog").attr('userID', zoneID);
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: "/Heating/controlDevice",
    success: function(json) {
      clearSelect('#select');
      makeDeviceSelect(json, '#select', id);
    }
  });
  $("#Dialog").dialog("open");
}

function updateControlDevice(name, id) {
  var zoneID = $("#Dialog").attr('userID');
  $('#zones #'+zoneID+' #ControlDeviceID').attr('value', id);
  $('#zones #'+zoneID+' #CDname').html(name).addClass('updated');
}

function setControlSensor(zoneID, id, deviceID) {
  $("#Dialog").dialog({title: "Select Control Sensor"});
  $("#Dialog").attr('userID', zoneID);
  $.ajax({
    method: "GET",
    data: {device: deviceID},
    dataType: 'json',
    url: "/Heating/controlSensor",
    success: function(json) {
      clearSelect('#select');
      makeSensorSelect(json, '#select', id);
    }
  });
  $("#Dialog").dialog("open");
}

function updateControlSensor(name, id) {
  var zoneID = $("#Dialog").attr('userID');
  $('#zones #'+zoneID+' #ControlSensorID').attr('value', id);
  $('#zones #'+zoneID+' #CSname').html(name).addClass('updated');
}

function updateDays(name, id) {
  var row = $('#Dialog').attr('userID');
  $('#Programmes #'+row+' #dayName').html(name);
  $('#Programmes #'+row+' #days').val(id);
}

function dialogAction() {
  switch ($("#Dialog").dialog("option", "title")) {
  case "Select Temperature Device": 
    updateTemperatureDevice($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value')); 
    break;
  case "Select Temperature Sensor": 
    updateTemperatureSensor($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value')); 
    break;
  case "Select Control Device":
    updateControlDevice($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value')); 
    break;
  case "Select Control Sensor":
    updateControlSensor($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value')); 
    break;
  case "Days of Week":
    updateDays($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value'));
    break;
  }
  $(this).dialog("close");
}

function dropdownAction() {
  var zoneID = $(this).closest(".row").attr("id");
  var id = $(this).siblings("input").val();
  var sel = $(this).siblings("input").attr('id');
  var temperatureDeviceID = $('#zones #'+zoneID+' #TDname_td #TemperatureDeviceID').val();
  var controlDeviceID = $('#zones #'+zoneID+' #CDname_td #ControlDeviceID').val();
  switch (sel) {
  case "TemperatureDeviceID": setTemperatureDevice(zoneID, id); break;
  case "TemperatureSensorID": setTemperatureSensor(zoneID, id, temperatureDeviceID); break;
  case "ControlDeviceID": setControlDevice(zoneID, id); break;
  case "ControlSensorID": setControlSensor(zoneID, id, controlDeviceID); break;
  }
}

function daysDropdownAction() {
  try {
    $("#Dialog").dialog({title: "Days of Week"});
    var rowID = $(this).closest("tr").attr('id');
    $("#Dialog").attr('userID', rowID);
    var id = $(this).siblings("input").val();
    $.ajax({
      method: "GET",
      dataType: 'json',
      url: "/Heating/days",
      success: function(json) {
      try {
        clearSelect('#select');
        makeDaysSelect(json, '#select', id);
        $("#Dialog").dialog("open");
      } catch(ex) {alert(ex);}
      }
    });
  } catch(ex) {alert(ex);}
}

function updateBackground(el) {
  var bg = $(el).closest('td');
  var max = parseInt($(bg).attr('tMax'));
  var min= parseInt($(bg).attr('tMin'));
  var val = parseInt($(el).val());
  if (val > max) val = max;
  if (val < min) val = min;
  $(el).val(val);
  var hue = 250 - 250*(val-min)/(max-min);
  var hsvText = "hsl("+hue+",75%, 50%)";
  $(bg).css('background-color', hsvText);
}
 
$(function() {
  try {
    $(".dropdown").click(dropdownAction);
    $(".daysdropdown").click(daysDropdownAction);
    $('input.timepicker').timepicker({timeFormat:'HH:mm', interval:5, scrollbar:true, dynamic:true});
    $("#Dialog").dialog({
        width: 400, height: 200, title: 'Select Device', autoOpen: false,
        buttons: [ {
            text: "Update",
            click: dialogAction
          }, {
            text: "Cancel",
            click: function() { $(this).dialog("close"); }
          }
        ]
      });
  } catch(ex) {alert(ex);}
});