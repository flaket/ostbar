var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

function Avatar(data)
{
	Entity.call(this);

	this.avatarId = data.avatar_id;
	this.url = data.url;
}

Avatar.prototype = new Entity();

Avatar.prototype.constructor = Avatar;

Avatar.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM avatar WHERE avatar_id = ?', id, function(error, rows, fields)
		{
			if (error) throw error;

			if (rows.length == 1)
			{
				callback(new Avatar(rows[0]));
			}
			else
			{
				callback(null);
			}
		});
	}
}

Avatar.loadAll = function(callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM avatar', function(error, rows, fields)
		{
			if (error) throw error;

			var avatars = new Array();

			if (rows.length > 0)
			{
				for (key in rows)
				{
					var row = rows[key];
					avatars.push(new Avatar(row));
				}
			}

			callback(avatars);
		});
	}
}

module.exports = Avatar;
