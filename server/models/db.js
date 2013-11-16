var mysql = require( 'mysql' );

var db = mysql.createConnection({
    host : 'localhost',
    user : 'tegf',
    password : '123123'
});

function DB() {

}

DB.getInstance = function(){
    db.query('USE tegf', function ( err, rows, fields ){
        if (err) throw err;
    });

    return db;
}

module.exports.instance = DB.getInstance();