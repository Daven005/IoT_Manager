exports.publish = publish;

function publish() {
  try {
    var d = new Date(); 
    var t = Math.floor(Date.now() / 1000) - (d.getTimezoneOffset()*60);
    client.publish('/App/date', t.toString());
    // console.log('/App/date: %j', moment(d).format("dd HH:mm"));
  } catch(ex) {
    console.log("Time publish error: "+ex.message);
  }
}