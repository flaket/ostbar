var Entity = require('../entity');
var DB = require('../db');
var db = DB.instance;

function Game(data)
{
	Entity.call(this);

	this.game_id = data.game_id;
	this.userId = data.user_id;
	this.initialScene = 'FIKS OBJEKT, id: ' + data.initial_scene_id;
	this.goal = 'FIKS OBJEKT, id: ' + data.goal_id;
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
	  			callback(new Game(rows[0]));
	  		}
	  		else
	  		{
	  			callback(null);
	  		}
		});
	}
};

module.exports = Game;
