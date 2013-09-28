var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function ActivityQuiz(data)
{
	Entity.call(this);

	this.activityQuizId = data.activity_quiz_id;
	this.activity_id = data.activity_id;
	this.questions = '[...]';
}

ActivityQuiz.prototype = new Entity();

ActivityQuiz.prototype.constructor = ActivityQuiz;

ActivityQuiz.loadById = function (callback, id)
{
	db.query('SELECT * FROM activity_quiz WHERE activity_quiz_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActivityQuiz(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

ActivityQuiz.loadByActivityId = function (callback, activityId)
{
	db.query('SELECT * FROM activity_quiz WHERE activity_id = ?', activityId, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActivityQuiz(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

module.exports.ActivityQuiz = ActivityQuiz;
