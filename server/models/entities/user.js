var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function User(data)
{
	Entity.call(this);

	this.userId   = data.user_id;
	this.username = data.username;
	this.password = data.password;
	this.created  = data.created;
	this.deleted  = data.deleted;

}

User.prototype = new Entity();

User.prototype.constructor = User;

User.loadById = function (callback, id)
{
	db.query('SELECT * FROM user WHERE user_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new User(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

User.loginWithUsernameAndPassword = function(callback, username, password)
{
	db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new User(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

module.exports.User = User;
