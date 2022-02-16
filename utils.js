var moment = require('moment');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

PushBullet = require('pushbullet');
pusher = new PushBullet(config.pushbullet.token);

var transporter = nodemailer.createTransport(smtpTransport({
   host: config.email.host,
   port: config.email.port,
   auth: {
       user: config.email.user,
       pass: config.email.pwd
   }
}));

transporter.verify((error, success) => {
   if (error) {
        console.error(`Nodemailer verify error: ${error}`);
   } else {
        console.log('Nodemailer Server is ready to take our messages');
   }
});

exports.notify = function(msg, notifyType, device, reason) {
  console.log(`${notifyType} Notify: ${device} ${reason} ${moment().format("dd HH:mm")} ${msg}`);
  if (notifyType == "Alarm") {
    var options = {
       from: config.alarm.from,
       to: config.alarm.to,
       subject: 'Alarm ',
       text: msg
    };
    if (device) options.subject += ", "+device;
    if (reason) options.subject += ", "+reason;
    options.subject += ' at '+moment().format("dd HH:mm");
    transporter.sendMail(options, function(error, info){
      if (error) {
          console.error(`sendMail error: ${error}`);
      }
    });
  } else if (notifyType == "Message") {
    pusher.note({}, )
  }
}

exports.setHue = function(min, max, val) {
  if (val <= min) return 250; // 250 == 'coldest' blue
  if (max <= min) return 250;
  if (val >= max) return 0;
  return (250 - 250*(val-min)/(max-min));
};

exports.sqlDevicesSensors = function(details) {
  var sql = "SELECT Location, Devices.Name AS DeviceName, Sensors.name AS SensorName, "+
        "Devices.DeviceID AS DeviceID, SensorID, Sensors.Type AS SensorType "
  if (details)
    sql += ", Sensors.Mapping, Devices.Updates AS Updates, Devices.Inputs AS Inputs, Devices.Outputs AS Outputs, Sensors.deleteAfter AS deleteAfter "
  sql += " FROM devices "+
    "LEFT JOIN sensors ON Devices.DeviceID = Sensors.deviceID "+
    "ORDER BY Location, DeviceName, DeviceID, SensorType, SensorName";
  return sql;
}

exports.sqlDeviceCounts = function() {
  return "select devices.Name, devices.Location, devices.DeviceID AS DeviceID, "+
    "count(sensors.name) as \"Log Entries\", min(temperaturelog.Time) as Earliest from devices "+
    "inner join sensors on sensors.deviceID = devices.DeviceID "+
    "inner join temperaturelog on "+
      "(temperaturelog.DeviceID = devices.DeviceID and temperaturelog.SensorID = sensors.SensorID)"+
    "group by devices.DeviceID ORDER BY devices.Name, devices.Location"
}

exports.saveTypeUrl = function(path) {
  if (!path) return false;
  return !(path == '/menu' || path == '/login' || path == '/loginResponse' || path == "/favicon.ico")
}