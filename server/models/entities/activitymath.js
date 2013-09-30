var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function ActivityMath(data)
{
	Entity.call(this);

	this.activityMathId = data.activity_math_id;
	this.activity_id = data.activity_id;
	this.questions = '[...]';
}

ActivityMath.prototype = new Entity();

ActivityMath.prototype.constructor = ActivityMath;

ActivityMath.loadById = function (callback, id)
{
	db.query('SELECT * FROM activity_math WHERE activity_math_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActivityMath(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

ActivityMath.loadByActivityId = function (callback, activityId)
{
	db.query('SELECT * FROM activity_math WHERE activity_id = ?', activityId, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActivityMath(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

module.exports.ActivityMath = ActivityMath;
