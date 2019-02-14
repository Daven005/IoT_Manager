var lastMessage = "";

exports.get = function(request, response) {
  var errorStr = "";
  var colours = [0,"ffffff","ffffff","ffffff","ffffff"];
  if (request.query.Action == 'Send') {
    lastMessage = request.query.message;
    colours = request.query.map;
    if (request.query.device == "All") {
      client.publish("/App/message", request.query.message);
    } else {
      client.publish("/Raw/"+request.query.device+"/message", request.query.message);
    }
  }
  try {
    var sqlstr = "SELECT devices.Location, devices.Name, devices.deviceID FROM devices "
                  +"INNER JOIN sensors ON devices.deviceID = sensors.deviceID WHERE sensors.type = 'Message'";
    db.query(sqlstr, function(err, result) {
      if (err) {
        console.log(err);
        errorStr = err.message;
      }
      response.render('message', {devices: result, selectedDevice: request.query.device, lastMessage, colours, err: errorStr});
    });
  } catch (ex) {
    console.log(ex);
  }
}
