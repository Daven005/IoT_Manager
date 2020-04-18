var ds = require('./DeviceState.js').DeviceState;
var assert = require('assert');
var x;

ds.setLatestTemperature('a', 'x1', 10.2);
assert((x=ds.getLatestTemperature('a', 'x1')) == 10.2, `${x} is wrong latest`);

ds.setLatestTemperature('a', 'x1', 10.3);
ds.setLatestTemperature('a', 'x1', 10.4);
ds.setLatestTemperature('a', 'x1', 10.5);
ds.setLatestTemperature('a', 'x1', 10.6);
console.log(ds.getAverageTemperature('a', 'x1'));
console.log(ds.getTemperatureChange('a', 'x1'));
