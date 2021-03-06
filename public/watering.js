$( function() {
  $("#panel").empty();
  $(document).attr('title', 'Hollies Watering System');
  $.ajax({url: "settings.json", 
	  success: function(settings){
		settings.forEach(addZone);
		},
	  error: function(x, error, txt) {
		 var idx;
		 alert(txt);
		 for (idx=0; idx<4; idx++) addZone({}, idx);
		}});
});	

function refreshTicks(s, ticks) {
    var lo = s.slider("values", 0), hi = s.slider("values", 1);
    var max = s.slider('option', 'max');
    s.find(".tick").each(function(i) {
        var i = (i + 1) * (max/ticks.length) - (max/ticks.length)/2;
        var inRange = (i >= lo && i < hi);
        $(this)
            [(inRange ? 'add' : 'remove') + 'Class']("ui-widget-header")
            [(inRange ? 'remove' : 'add') + 'Class']("ui-widget-content");
    });
}

function addZone(setting, idx) {
  var ticks = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
  
  if (!setting.name) setting.name = "-";
  if (!setting.start) setting.start = 4*4; // 4am
  if (!setting.end) setting.end = 5*4; // 5am
  if ($("#panel > div").length == 0) {
	  $("#panel").html(makeZoneString(setting, idx));
  } else {
	  $("#panel").append(makeZoneString(setting, idx));
  }
  var s = $('#s'+idx).slider({
			range: true, min: 0, max: 96,
			values: [ setting.start, setting.end ],
			slide: function(event, ui) {
				$("#t"+idx).text(time(ui.values[0]) + " - " + time(ui.values[1]));
				refreshTicks(s, ticks);
			}
		});
    $(ticks).each(function(i) {
      var tick = $('<div class="tick ui-widget-content">' + this + ':00</div>').appendTo(s);
      tick.css({
          left: (100 / ticks.length * i) + '%',
          width: (100 / ticks.length) + '%'
      });
  });

}

function changeName(id) {
	var response = prompt('Update name', $(id).html());
	$(id).html(response);
}

function makeZoneString(setting, idx) {
  var zoneNameId = '#zoneName_'+idx;
  return '<div class="zone" id="z' + idx + '">'+
    '<div class="zoneName" id="zoneName_'+idx+'">' + setting.name + '</div>'+
    '<button class="changeName"  type="button" onclick="changeName(\''+zoneNameId+'\')">Change Name</button><br>'+
    getSelect(setting.output)+'<span>  </span>'+
    '<div class="zoneTime" id="t'+idx+'">' + time(setting.start) + ' - '+time(setting.end) + '</div>'+
    '<div class="zoneSlider" id="s'+idx+'"></div>'+
  '</div><p></p>';
}

function getSelect(z) {
  var sel = '<select class="zoneID">'+
    '<option value="0">OFF</option>'
  for (var i=1; i<=3; i++) {
    if (i == z) {
      sel = sel + '<option value="'+i+'" selected>'+i+'</option>';
    } else {
      sel = sel + '<option value="'+i+'">'+i+'</option>';
    }
  }
  sel += '</select>';
  return sel;
}


function time(q) {
  return pad2(Math.floor(q/4)) + ':' + pad2((q%4)*15);
}

function pad2(n) {
  var s = "0" + n;
  return s.substr(s.length-2);
}

function updateBtn() {
  let settings = [];
  $("#panel").children("div").each(function(idx) {
    var zone = {};
    zone.name  = $(this).children(".zoneName").text();
    zone.start = $(this).children(".zoneSlider").slider("values", 0);
    zone.end   = $(this).children(".zoneSlider").slider("values", 1);
    zone.output  = $(this).children(".zoneID").val();
    settings.push(zone);
  });
  $.ajax({
		url : "http://192.168.1.77/settings",
		type: "post",
		data: JSON.stringify(settings),
		dataType: "json",
		contentType: "application/json",
		complete: function(data, status) {
      //alert(data.responseText);
    }
  });
}
