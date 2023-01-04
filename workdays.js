var czTimer = null;
var state = {};
var moment = require('moment');

exports.init = function (cb) {
  let sqlstr = "select * from heatingWorkdays"
  db.query(sqlstr, (err, result) => {
    let r = JSON.parse(JSON.stringify(result[0]));
    state = r;
    checkZones();
    if (cb) cb();
  });
}

exports.checkZones = checkZones;

function checkZones(d = 'now', cb) {
  if (!czTimer) {
    czTimer = setInterval(checkZones, 60 * 60 * 1000); // Then Every hour
  }
  let day = moment().format("dddd").slice(0, 2);
  if (d != 'now') day = d;
  console.log("CheckZones (work): ", day, JSON.stringify(state));
  if (state[day]) { // Is a Work day
    let sqlstr = "update heatingzones set enabled=1 where ID=?"
    sqlstr = sql.format(sqlstr, [state.workZoneID]);
    db.query(sqlstr, (err, result) => {
      if (err) {
        console.err("Zone Workday update error: ", err.description)
      } else {
        let sqlstr = "update heatingzones set enabled=0 where ID=?"
        sqlstr = sql.format(sqlstr, [state.offZoneID]);
        db.query(sqlstr, (err, result) => {
          if (err) {
            console.err("Zone Off day update error: ", err.description)
          }
          if (cb) cb();
        });
      }
    });
  } else {
    let sqlstr = "update heatingzones set enabled=1 where ID=?"
    sqlstr = sql.format(sqlstr, [state.offZoneID]);
    db.query(sqlstr, (err, result) => {
      if (err) {
        console.err("Zone Workday update error: ", err.description)
      } else {
        let sqlstr = "update heatingzones set enabled=0 where ID=?"
        sqlstr = sql.format(sqlstr, [state.workZoneID]);
        db.query(sqlstr, (err, result) => {
          if (err) {
            console.err("Zone Workday update error: ", err.description)
          }
          if (cb) cb();
        });
      }
    });
  }
}

exports.save = function (cb) {
  let sqlstr = "UPDATE heatingWorkdays SET "
    + `ID = ${state.ID},`
    + `SU = ${state.Su},`
    + `Mo = ${state.Mo},`
    + `Tu = ${state.Tu},`
    + `We = ${state.We},`
    + `Th = ${state.Th},`
    + `Fr = ${state.Fr},`
    + `Sa = ${state.Sa},`
    + `workZoneID = ${state.workZoneID},`
    + `offZoneID = ${state.offZoneID}`
  db.query(sqlstr, function (err, result) {
    if (err) {
      console.err("Workday update error: ", err.description)
    }
    checkZones('now', () => { if (cb) cb() });
  });
}

exports.obj = function () {
  return state;
}
