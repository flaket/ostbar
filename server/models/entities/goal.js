var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

function Goal(data)
{
	Entity.call(this);

	this.goalId = data.goal_id;
	this.nRewards = data.n_rewards;
}

Goal.prototype = new Entity();

Goal.prototype.constructor = Goal;

Goal.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM goal WHERE goal_id = ?', id, function(error, rows, fields)
		{
			if (error) throw error;

			console.log('fetched rows', rows);

			if (rows.length == 1)
			{
				callback(new Goal(rows[0]));
			}
			else
			{
				callback(null);
			}
		});
	}
}

module.exports = Goal;
