exports.init = function (callback) {
    global.sql = require('mysql');
    var db_info = {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        port: 3306
    };
    global.db = sql.createConnection(db_info);
    db.connect(err => {
        if (err) {
            console.error(`An error occurred while connecting to the DB ${err}`)
            process.exit(1);
        }
        console.log(`DB connected`); // using ${db_info}`);
        if (callback) callback();
    });
    db.on('error', function (err) {
        console.error(`Db fatal error:: ${err.code}, ${+err.message}`); // 'ER_BAD_DB_ERROR'
        process.exit(1);
    });
}
