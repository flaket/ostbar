var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

var Avatar 	= require('./avatar').Avatar;
var Sound 	= require('./sound').Sound;

function LanguageQuestion(data)
{
	Entity.call(this);

	this.languageQuestionId = data.language_question_id;
	this.activityLanguageId = data.activity_language_id;
	this.languageQuestionType = data.language_question_type;
	this.correctAlternative = data.correct_alternative;
	this.data = data.dataObj;
	this.alternatives = '[...]';
}

LanguageQuestion.prototype = new Entity();

LanguageQuestion.prototype.constructor = LanguageQuestion;

LanguageQuestion.loadById = function (callback, id)
{
	db.query('SELECT * FROM language_question WHERE language_question_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			LanguageQuestion.initWithData(rows[0], callback);
		}
		else
		{
			callback(null);
		}
	});
}

LanguageQuestion.loadAllInActivityLanguage = function(callback, activityLanguageId)
{
	var query = 'SELECT  * FROM language_question WHERE activity_language_id = ?';

	db.query(query, activityLanguageId, function (error, rows, fields)
	{
		if (error) throw error;

		var languageQuestions = new Array();
		var currentLanguageQuestion = 0;

		async.whilst(
			function ()
			{
				return languageQuestions.length < rows.length;
			},
			function (callback)
			{
				LanguageQuestion.initWithData(rows[currentLanguageQuestion], callback);
				currentLanguageQuestion++;
			},
			function (error)
			{
				if (error)
				{
					callback(null);
				}
				else
				{
					callback(languageQuestions);
				}
			}
		);
	});
}

LanguageQuestion.initWithData = function (data, callback)
{
	var dataClass = null;

	switch (data.language_question_type)
	{
		case 'PICTURE_RECOGNIZE': dataClass = LanguageQuestionPicture;
		case 'SOUND_RECOGNIZE': dataClass = LanguageQuestionSound;
	}

	async.parallel(
	{
		dataClass: function (callback)
		{
			subclass.loadById(function (dataObj)
			{
				callback(null, dataObj);
			}, data.data_id);
		}
	},
	function (error, results)
	{
		data.data = results.dataObj;

		callback(new LanguageQuestion(data));
	});
}

module.exports.LanguageQuestion = LanguageQuestion;
