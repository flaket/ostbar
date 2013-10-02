var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

var SubjectType 			= require('./subjecttype').SubjectType;
var QuizQuestionAlternative = require('./quizquestionalternative').QuizQuestionAlternative;

function QuizQuestion(data)
{
	Entity.call(this);

	this.quizQuestionId = data.quiz_question_id;
	this.question = data.question;
	this.timeLimit = data.time_limit;
	this.subject = data.subject;
	this.alternatives = data.alternatives;
	this.correctAlternatives = data.correct_alternatives;
}

QuizQuestion.prototype = new Entity();

QuizQuestion.prototype.constructor = QuizQuestion;

QuizQuestion.loadById = function (callback, id)
{
	db.query('SELECT * FROM quiz_question WHERE quiz_question_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1) callback(new QuizQuestion(rows[0]));
		else callback(null);
	});
}

QuizQuestion.loadAllInActivityQuiz = function (callback, activityQuizId)
{
	var query = 'SELECT * ';
		query += 'FROM quiz_question ';
		query += 'WHERE activity_quiz_id = ?';

	db.query(query, activityQuizId, function (error, rows, fields)
	{
		if (error) throw error;

		var quizQuestions = new Array();
		var currentQuizQuestion = 0;

		async.whilst(
			function ()
			{
				return quizQuestions.length < rows.length;
			},
			function (callback) 
			{
				QuizQuestion.initWithData(function (quizQuestion)
				{
					quizQuestions.push(quizQuestion);
					currentQuizQuestion++;
					callback();
				}, rows[currentQuizQuestion]);
			},
			function (error)
			{
				if (error) callback(null);
				else callback(quizQuestions);
			}
		);
	});
}

QuizQuestion.initWithData = function (callback, data)
{
	async.parallel(
	{
		alternatives: function (callback)
		{
			QuizQuestionAlternative.loadAllInQuizQuestion(function (alternatives)
			{
				callback(null, alternatives);
			}, data.quiz_question_id);
		},
		correctAlternatives: function (callback)
		{
			QuizQuestionAlternative.loadAllCorrectInQuizQuestion(function (correctAlternatives)
			{
				callback(null, correctAlternatives);
			}, data.quiz_question_id);
		},
		subject: function (callback)
		{
			SubjectType.loadById(function (subject)
			{
				callback(null, subject);
			}, data.subject_type_id);
		}
	},
	function (error, results)
	{
		data.alternatives = results.alternatives;
		data.correct_alternatives = results.correctAlternatives;
		data.subject = results.subject;

		callback(new QuizQuestion(data));
	});
}

module.exports.QuizQuestion = QuizQuestion;
