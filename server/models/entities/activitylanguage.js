var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

var LanguageQuestion = require('./languagequestion').LanguageQuestion;

function ActivityLanguage(data)
{
	Entity.call(this);

	this.activityLanguageId = data.activity_language_id;
	this.activity_id = data.activity_id;
	this.questions = '[...]';
}

ActivityLanguage.prototype = new Entity();

ActivityLanguage.prototype.constructor = ActivityLanguage;

ActivityLanguage.loadById = function (callback, id)
{
	db.query('SELECT * FROM activity_language WHERE activity_language_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActivityLanguage(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

ActivityLanguage.loadByActivityId = function (callback, activityId)
{
	console.log('load by activity id', activityId);

	db.query('SELECT * FROM activity_language WHERE activity_id = ?', activityId, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			var data = rows[0];

			async.parallel(
			{
				questions: function (callback)
				{
					LanguageQuestion.loadAllInActivityLanguage(function (languageQuestions)
					{
						callback(null, languageQuestions);
					}, data.)
				}
			},
			function (error, results)
			{
				data.languageQuestions = results.languageQuestions;
			});

			callback(new ActivityLanguage(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

module.exports.ActivityLanguage = ActivityLanguage;
