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
	this.language_questions = data.language_questions;
}

ActivityLanguage.prototype = new Entity();

ActivityLanguage.prototype.constructor = ActivityLanguage;

ActivityLanguage.loadById = function (callback, id)
{
	db.query('SELECT * FROM activity_language WHERE activity_language_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1) ActivityLanguage.initWithData(callback, rows[0]); 
		else callback(null);
	});
}

ActivityLanguage.loadByActivityId = function (callback, activityId)
{
	db.query('SELECT * FROM activity_language WHERE activity_id = ?', activityId, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1) ActivityLanguage.initWithData(callback, rows[0]);
		else callback(null);
	});
}

ActivityLanguage.initWithData = function (callback, data) 
{
	async.parallel(
	{
		questions: function (callback)
		{
			LanguageQuestion.loadAllInActivityLanguage(function (languageQuestions)
			{
				callback(null, languageQuestions);
			}, data.activity_language_id);
		}
	},
	function (error, results)
	{
		data.language_questions = results.questions;
		callback(new ActivityLanguage(data));
	});
}

module.exports.ActivityLanguage = ActivityLanguage;
