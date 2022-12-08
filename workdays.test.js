"use strict"
global.config;
require('./config').read(configLoaded);

function configLoaded(cfg) {
  global.config = cfg;
  config.database.host = "192.168.1.100"; // Need to be able to read Devices
  var dbs = require('./dbSetup');
  try {
    dbs.init(() => {
      try {
        var w = require('./workdays');
        w.init(() => done(w));
      } catch (e) {
        console.log(e.stack);
      }
    });
  } catch (e) {
    console.log(e.stack)
  }
}

function printZones(cb) {
  let sqlstr = `select ID, Name, Enabled from heatingZones where name like "Guest%"`;
  db.query(sqlstr, (err, result) => {
    result.forEach((r) => console.log(JSON.parse(JSON.stringify(r))));
    if (cb) cb();
  });
}

function done(w) {
  var wd = w.obj();
  console.log("Done", wd);
  wd.Su = !wd.Su;
  console.log(w.obj());
  wd.We = true;
  w.save(() => {
    w.checkZones('We', () => {
      printZones(() => {
        w.checkZones('Tu', () => {
          printZones(() => {
            process.exit(0);
          });
        });
      });
    });
  });
}