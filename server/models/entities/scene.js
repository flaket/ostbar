var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

var Avatar  = require('./avatar');
var World 	= require('./world');
var Element = require('./element');

function Scene(data)
{
	Entity.call(this);

	this.sceneId = data.scene_id;
	this.world = data.world;
	this.backgroundAvatar = data.backgroundAvatar;
	this.elements = data.elements;
}

Scene.prototype = new Entity();

Scene.prototype.constructor = Scene;

Scene.loadById = function(callback, id)
{
	db.query('SELECT * FROM scene WHERE scene_id = ?', id, function(error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			var data = rows[0];

			async.parallel(
			{
				backgroundAvatar: function(callback)
				{
					Avatar.loadById(function(avatar)
					{
						callback(null, avatar);
					}, data.background_avatar_id);
				},
				elements: function(callback)
				{
					Element.loadAllInScene(function(elements)
					{
						callback(null, elements);
					}, data.scene_id);
				},
				world: function(callback)
				{
					World.loadById(function(world) {
						callback(null, world);
					}, data.world_id);
				}
			},
			function(error, results)
			{
				data.backgroundAvatar = results.backgroundAvatar;
				data.elements = results.elements;
				data.world = results.world;
				callback(new Scene(data));
			});
		}
		else
		{
			callback(null);
		}
	});
}

module.exports = Scene;
