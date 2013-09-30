var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function Sound(data)
{
	Entity.call(this);

	this.soundId = data.sound_id;
	this.url = data.url;
}

Sound.prototype = new Entity();

Sound.prototype.constructor = Sound;

Sound.loadById = function (callback, id)
{
	db.query('SELECT * FROM sound WHERE sound_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new Sound(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

Sound.loadAll = function (callback)
{
	db.query('SELECT * FROM sound', function (error, rows, fields)
	{
		if (error) throw error;

		var sounds = new Array();

		if (rows.length > 0)
		{
			for (key in rows)
			{
				var row = rows[key];
				sounds.push(new Sound(row));
			}
		}

		callback(sounds);
	});
}

module.exports.Sound = Sound;
