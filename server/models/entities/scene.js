var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

var Avatar  = require('./avatar');
var World 	= require('./world');

function Scene(data)
{
	Entity.call(this);

	this.sceneId = data.scene_id;
	this.world = data.world;
	this.backgroundAvatar = data.backgroundAvatar;
	this.elements = '[...]';
}

Scene.prototype = new Entity();

Scene.prototype.constructor = Scene;

Scene.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM scene WHERE scene_id = ?', id, function(error, rows, fields)
		{
			if (error) throw error;

			if (rows.length == 1)
			{
				Avatar.loadById(rows[0].background_avatar_id, function(avatar)
				{
					rows[0].backgroundAvatar = avatar;

					World.loadById(rows[0].world_id, function(world)
					{
						rows[0].world = world;

						callback(new Scene(rows[0]));
					});
				});
			}
			else
			{
				callback(null);
			}
		});
	}
}

module.exports = Scene;
