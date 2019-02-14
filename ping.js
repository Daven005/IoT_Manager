var sys = require('util');
var cp = require('child_process');
var os = require('os');


exports.ping = function ping(address, callback) {
  // Determine the host OS; set up ping arguments and vars accordingly.
  var platform = os.platform();
  var process = null;
  var result_line = 1; // Default for POSIX-based systems.
  var time_param = 6; // Default for POSIX-based systems.
  var response = "";
  
  function examineData(data) {    
    var status = null;
    var latency = null;

    try {
      // Split the returned output by line.
      var lines = data.toString().replace('\r', '').split('\n');
      // Split the result line into an array.
      var array = lines[result_line].split(' ');
      // If the time parameter is not present, or the second line of output
      // contains 'Unreachable' or 'exceeded', mark as failure.
      if (data.toString().indexOf('timed out') > -1) {
          status = false;
          latency = 9999;
      } else if (!array[time_param] || array.indexOf('Unreachable') > -1 || array.indexOf('exceeded') > -1) {
          status = false;
          latency = 0;
      } else { // If it is present, find the latency value in ms.
          status = true;
          // Remove 'time=' from latency stat.
          latency = array[time_param].replace('time=', '', array[time_param]);
          if (platform == 'windows') { // If on a windows machine, also remove the 'ms'.
            latency = latency.replace('ms,', '', latency);
          }

          // Sanity check.
          if (isNaN(latency)) {
            console.log(lines);
            latency = 0;
            status = false;
          }

          // Round latency to nearest ms value.
          latency = Math.round(latency);
      }
    } catch(ex) {
      console.log("error: %j", ex);
      console.log(lines);
      latency = 0;
      status = false;
    }
    callback && callback(latency, status);
  }  
  if (platform == 'linux') { // Linux.
      process = cp.spawn('/bin/ping', ['-n', '-w 2', '-c 1', address]);
  } else if (platform == 'darwin') { // Mac OS X.
      process = cp.spawn('/sbin/ping', ['-n', '-t 2', '-c 1', address]);
  } else if (platform.match(/^win/)) { // Windows.
      process = cp.spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', address]);
      result_line = 8;
      time_param = 6;
      platform = 'windows'; // Set explicitly to prevent further regex.
  } else { // Platform not recognized.
      throw new Error('ping.ping: Operating system could not be identified.');
  }

  // If ping returned stdout output the host was valid. Find the latency for
  // the ping if there is one (if not, the host was unreachable).
  process.stdout.on('data', function (data) {
    response = response + data;
  });
  process.on('error', function(e) {  // Handle errors.
      throw new Error('ping.ping: There was an error while executing the ping program. check your path or filesystem permissions.');
  });
  process.stderr.on('data', function (data) {
    console.log("stderr %j", data);
    callback && callback(999, false);
  });
  process.on('exit', function(code) {
    examineData(response);
  });     
}
