var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function MathOperator(data)
{
	Entity.call(this);

	this.mathOperatorId = data.math_operator_id;
	this.operator = data.operator;
}

MathOperator.prototype = new Entity();

MathOperator.prototype.constructor = MathOperator;

MathOperator.loadById = function (callback, id)
{
	db.query('SELECT * FROM math_operator WHERE math_operator_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1) MathOperator.initWithData(callback, rows[0]);
		else callback(null);
	});
}

MathOperator.loadAllInActivityMath = function (callback, activityMathId)
{
	var query = 'SELECT * '
		query += 'FROM activity_math_to_math_operator_rel am_to_mo_rel LEFT JOIN math_operator mo ';
		query += 'ON am_to_mo_rel.math_operator_id = mo.math_operator_id AND am_to_mo_rel.activity_math_id = ?';

	db.query(query, activityMathId, function (error, rows, fields)
	{
		if (error) throw error;

		var operators = new Array();
		var currentOperator = 0;

		async.whilst(
			function ()
			{
				return operators.length < rows.length;
			},
			function (callback)
			{
				MathOperator.initWithData(function (mathOperator)
				{
					operators.push(mathOperator);
					currentOperator++;
					callback();
				}, rows[currentOperator])
			},
			function (error)
			{
				if (error) callback(null);
				else callback(operators);
			}
		);
	});
}

MathOperator.initWithData = function (callback, data)
{
	callback(new MathOperator(data));
}

module.exports.MathOperator = MathOperator;
