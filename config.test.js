cfg = require('./config').read(done);
var config
function done(c) {
	if (c.loaded) {
	  console.log(c);
	} else {
	  console.log('No config');
	}
}