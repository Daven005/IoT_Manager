function clearSelect(s) {
  $(s+' option').each(function() {
    this.remove();
  });
}

function makeZoneSelect(json, s, id) {
  $.each(json, function(i, value) {
    if (id == value.ID)
      $(s).append($('<option selected>').text(value.Name).attr('value', value.ID));
    else
      $(s).append($('<option>').text(value.Name).attr('value', value.ID));
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

function setZone(rowID, id) {
  $("#Dialog").dialog({title: "Select Zone"});
  $("#Dialog").attr('userID', rowID);
  $.ajax({
    method: "GET",
    dataType: 'json',
    url: "/Heating/zone",
    success: function(json) {
      clearSelect('#select');
      makeZoneSelect(json, '#select', id);
    }
  });
  $("#Dialog").dialog("open");
}

function updateZone(name, id) {
  var zoneID = $("#Dialog").attr('userID');
  $('#zones #'+zoneID+' #zoneID').attr('value', id);
  $('#zones #'+zoneID+' #zoneName').html(name).addClass('updated');
}

function updateDays(name, id, section) {
  var row = $('#Dialog').attr('userID');
  $('#'+section+' #'+row+' #dayName').html(name);
  $('#'+section+' #'+row+' #day').val(id);
}

function dialogAction() {
  switch ($("#Dialog").dialog("option", "title")) {
  case "Select Zone":
    updateZone($('#Dialog select option:selected').html(), $('#Dialog select option:selected').attr('value')); 
    break;
  case "Days of Week":
    updateDays($('#Dialog select option:selected').html(), 
      $('#Dialog select option:selected').attr('value'),
      $('#Dialog').attr('section')
      );
    break;
  }
  $(this).dialog("close");
}

function dropdownAction() {
  var rowID = $(this).closest(".row").attr("id");
  var id = $(this).siblings("input").val();
  var sel = $(this).siblings("input").attr('id');
  setZone(rowID, id);
}

function daysDropdownAction() {
  try {
    $("#Dialog").dialog({title: "Days of Week"});
    var rowID = $(this).closest("tr").attr('id');
    $("#Dialog").attr('userID', rowID);
    var id = $(this).siblings("input").val();
    var section = $(this).closest('table').attr('id');
    $("#Dialog").attr('section', section);
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

function updateTemperatureBackground(el) {
  try {
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
  } catch(ex) { alert(ex); }
  alert(hsvText);
}

function updateTimeBackground(el) {
  var bg = $(el).closest('td');
}

function setTimeNow(el) {
	var d = new Date();
	var t = $(el).prev();
	t.val(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds());
}
 
$(function() {
  try {
    $(".dropdown").click(dropdownAction);
    $(".daysdropdown").click(daysDropdownAction);
    $('input.timepicker').timepicker({timeFormat:'HH:mm', interval:10, scrollbar:true, dynamic:true});
    $('input.durationpicker').timepicker({timeFormat:'HH:mm', interval:15, scrollbar:true, dynamic:true });
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
