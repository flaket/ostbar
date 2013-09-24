var mysql = require('mysql');
 
var connection = mysql.createConnection(
    {
      host     : 'www.iselinlabs.com',
      user     : 'tegf',
      password : 'TiU7X&qbnLM',
      database : 'tegf',
    }
);
 
connection.connect();
 
var queryString = 'SELECT * FROM game';
 
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i].post_title);
    }
});
 
connection.end();