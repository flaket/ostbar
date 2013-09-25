var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

var Goal 	= require('./goal');
var Scene   = require('./scene');

function Game(data)
{
	Entity.call(this);

	this.game_id = data.game_id;
	this.userId = data.user_id;
	this.initialScene = data.initial_scene;
	this.goal = data.goal;
	this.created = data.created;
	this.deleted = data.deleted;
}

Game.prototype = new Entity();

Game.prototype.constructor = Game;

Game.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM game WHERE game_id = ?', id, function(error, rows, fields)
		{
	  		if (error) throw error;
	  		
	  		if (rows.length == 1)
	  		{
				Goal.loadById(rows[0].goal_id, function(goal)
				{
					rows[0].goal = goal;

					Scene.loadById(rows[0].initial_scene_id, function(scene)
					{
						rows[0].initial_scene = scene;

						callback(new Game(rows[0]));
					});
					
				});
	  			
	  		}
	  		else
	  		{
	  			callback(null);
	  		}
		});
	}
};

module.exports = Game;
