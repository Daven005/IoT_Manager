f = require('fs');
var cfg = { loaded: false };

function read(cb) {
  try {
    var str = f.readFileSync(process.env.CONFIG).toString();
    cfg = JSON.parse(str);
    cfg.loaded = true;
  } catch (ex) {
    console.log("Error reading %s %j", process.env.CONFIG, ex.message);
  }
  if (cb) cb(cfg);
}

exports.read = read;
