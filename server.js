#!/usr/bin/env node
var app = require('./server/app'),
    http = require('http');

// -- database
var mysql = require('mysql');
app.db = mysql.createConnection({
  host     : 'localhost',
  user     : 'peterringset',
});

// -- handle node exceptions
process.on('uncaughtException', function(err){
    console.error('uncaughtException', err.message);
    console.error(err.stack);
    process.exit(1);
});

// -- start server
var server = http.createServer(app).listen(app.conf.port, function()
{
    console.log("Express server listening on port %d in %s mode", app.conf.port, app.settings.env);
});

// -- exports
module.exports.server = server;

// -- now
var now = require('./server/now');
