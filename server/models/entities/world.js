var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;

function World(data)
{
	Entity.call(this);

	this.worldId = data.world_id;
	this.world = data.world;
	this.title = data.title;
}

World.prototype = new Entity();

World.prototype.constructor = World;

World.loadById = function (callback, id)
{
	db.query('SELECT * FROM world WHERE world_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1) callback(new World(rows[0]));
		else callback(null);
	});
}

module.exports.World = World;
