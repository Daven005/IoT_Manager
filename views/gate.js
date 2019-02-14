var gate, hinge, opening_arrow, closing_arrow;
const STOPPED = 0;
const OPENING = 1;
const CLOSING = 2;
SVG.on(document, 'DOMContentLoaded', function() {
  var draw = SVG('drawing').viewbox(0, 0, 400, 400);
  var gp = draw.group();
  var post1 = gp.rect(25, 25).move(50, 70).attr({ fill: 'maroon' });
  var post2 = gp.rect(25, 25).move(350, 70).attr({ fill: 'maroon' });
  gate  = gp.rect(300, 10).move(50, 100).attr({ fill: 'maroon' });
  hinge = gp.circle(10).move(352, 100).attr({ fill: 'gray' });
  opening_arrow = gp.path("M-4.833579628906115, 32.99051703353658l-1.5625000000000018, -1.25h1.2500000000000009a8, 8, 0, 0, 1, 6, -6.25a2, 2, 0, 0, 0, 0.6249999999999998, 3.125a4.6, 4.6, 0, 0, 0, -5.875, 3.125h1.2499999999999982Z").move(130, 280).scale(5, 5).rotate(-45).attr({fill:"red"}).hide();
  closing_arrow = gp.path("M-4.833579628906115, 32.99051703353658l-1.5625000000000018, -1.25h1.2500000000000009a8, 8, 0, 0, 1, 6, -6.25a2, 2, 0, 0, 0, 0.6249999999999998, 3.125a4.6, 4.6, 0, 0, 0, -5.875, 3.125h1.2499999999999982Z").move(170, 320).flip('x').scale(5, 5).rotate(-135).attr({fill:"green"}).hide();
  //gp.scale(0.5, 0.5);
  var es = new EventSource("/WiFiGate/sse");
  es.onmessage = function(ev) {
    var btn = document.getElementById("action");
    switch (ev.data) {
    case "open": rot(-90, STOPPED); btn.innerHTML = "Close"; break;
    case "closed": rot(0, STOPPED); btn.innerHTML = "Open"; break;
    case "opening": rot(-45, OPENING); btn.innerHTML = "Stop"; break;
    case "closing": rot(-45, CLOSING); btn.innerHTML = "Stop"; break;
    case "error": rot(-25, STOPPED); btn.innerHTML = "Stop"; break;
    }
  };
  $(window).unload(function() {
    es.close();
    return "Bye now!";
  });
  $("#action").click(function(){
    $.ajax({url: "/WiFiGate/operate", success: function(result){
        $("#action").css("background-color", "yellow");
        setTimeout(()=>{$("#action").css("background-color", "LightGreen");}, 1000);
    }});
});
});

function arrows(ar) {
  switch (ar) {
  case STOPPED: opening_arrow.hide().pause(); closing_arrow.hide().pause(); break;
  case OPENING: closing_arrow.hide().pause(); opening_arrow.show().animate(1000).attr('fill-opacity', 0.1).loop(); break;
  case CLOSING: opening_arrow.hide().pause(); closing_arrow.show().animate(1000).attr('fill-opacity', 0.1).loop(); break;
  }
}

function rot(angle, ar) {
  gate.rotate(angle, hinge.cx(), hinge.cy());
  arrows(ar);
}
