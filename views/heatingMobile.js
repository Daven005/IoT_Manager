// javascript include

function updateZone(zoneID, name, id) {
  $('#overrides #' + id + ' #zoneID').attr('value', zoneID);
}

function updateDays(name, id, section) {
  var row = $('#Dialog').attr('userID');
  $('#' + section + ' #' + row + ' #dayName').html(name);
  $('#' + section + ' #' + row + ' #day').val(id);
}

function updateTemperatureBackground(el) {
  var bg = $(el).closest('div[tMax]');
  var max = parseInt($(bg).attr('tMax'));
  var min = parseInt($(bg).attr('tMin'));
  var val = parseInt($(el).val());
  if (val > max) val = max;
  if (val < min) val = min;
  $(el).val(val);
  var hue = 250 - 250 * (val - min) / (max - min);
  var hsvText = "hsl(" + hue + ",75%, 50%)";
  $(bg).css('background-color', hsvText);
}

function updateTimeBackground(el) {
  // var bg = $(el).closest('div');
}

// function initDuration() {
//   this.d['header Text'] = "Set";
//   this.d['headerText'] = "Set Duration";
//   var element = 'input#' + this.element[0].id;
//   var currentDt = $(element).datebox('getTheDate');
//   var dt = $(element).datebox('parseDate', '%H:%M', this.element[0].value);
//   $(element).datebox('setTheDate', this.element[0].value);
//   $(element).trigger('datebox', { 'method': 'doset' });
// }

$(document).bind("mobileinit", () => {
  ajaxEnabled = false;
});

// function durationChange(sel) {
//   sel.value = sel.value.replace('0 Days,', '');
// }

$(() => {
  // $('#Update').on('click', () => {
  //   var f = $(this).attr('form');
  //   //   $('#' + f).trigger('submit');
  //   // });
  //   // $('#TurnOff').on('click', () => {
  //   // var f = $(this).attr('form');
  //   try {
  //     if (($this).attr('#id') == 'TurnOff') {
  //       let temperature = $('#' + f).find('#temperature');
  //       $(temperature).attr(value, $(temperature).attr('min'));
  //       let duration = $('#' + f).find('#duration');
  //       $(duration).attr(value, $(duration).attr('max'));
  //       alert($(duration).attr(value));
  //       debugger;
  //     }
  //   } catch (e) { alert(e); }
  //   $('#' + f).trigger('submit',);
  // });
  // $('.zoneName').on('change', () => {
  //   var optionSelected = $("option:selected", this);
  //   var zoneID = this.value;
  //   $(this).closest('td').find('input').val(zoneID);
  // });
  // $('.dayName').on('change', () => {
  //   var optionSelected = $("option:selected", this);
  //   var dayID = this.value;
  //   $(this).closest('td').find('input').val(dayID);
  // });
  // $('input.Duration').bind('datebox', (e, passed) => {
  //   if (passed.method === 'set') {
  //     if ($(e.currentTarget).datebox('dateVisible')) {
  //       try {
  //         //$(e.currentTarget).datebox().datebox('setTheDate', passed.value.replace('0 Days,', ''));
  //         //$(e).trigger('datebox', { 'method': 'doset' });
  //       } catch (ex) { alert(ex); }
  //     }
  //   }
  // });
});