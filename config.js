f = require('fs');
var cfg = {loaded:false};

function read(cb) {
  try {
	var str = f.readFileSync(process.env.CONFIG).toString();
	cfg = JSON.parse(str);
	cfg.loaded = true;
	if (cb) cb(cfg);
  } catch (ex) {
    console.log("Error reading %s %j", process.env.CONFIG, ex.message);
  }
}

exports.read = read;
