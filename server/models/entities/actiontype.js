var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function ActionType(data)
{
	Entity.call(this);

	this.actionTypeId = data.action_type_id;
	this.name = data.type;
}

ActionType.prototype = new Entity();

ActionType.prototype.constructor = ActionType;

ActionType.loadById = function (callback, id)
{
	db.query('SELECT * FROM action_type WHERE action_type_id = ?', id, function (error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ActionType(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

ActionType.loadAllInElement = function (callback, elementId)
{
	var query = 'SELECT * FROM element_to_action_type_rel WHERE element_id = ?';

	db.query(query, elementId, function (error, rows, fields)
	{
		if (error) throw error;

		var actionTypes = new Array();
		var currentActionType = 0;

		async.whilst(
			function ()
			{
				return actionTypes.length < rows.length;
			},
			function (callback)
			{
				ActionType.loadById(function (actionType)
				{
					var buffer = new Buffer(rows[currentActionType].data, 'binary' );

					actionTypes.push({
						actionType: actionType,
						data: buffer.toString()
					});

					currentActionType++;
					
					callback();
				}, rows[currentActionType].action_type_id)
			},
			function (error)
			{
				callback(actionTypes);
			}
		);
	});
}

ActionType.loadAllInElementType = function (callback, elementTypeId)
{
	var query = 'SELECT * FROM element_type_to_action_type_rel WHERE element_type_id = ?';

	db.query(query, elementTypeId, function (error, rows, fields)
	{
		if (error) throw error;

		var actionTypes = new Array();
		var currentActionType = 0;

		async.whilst(
			function ()
			{
				return actionTypes.length < rows.length;
			},
			function (callback)
			{
				ActionType.loadById(function (actionType)
				{
					actionTypes.push(actionType);
					currentActionType++;
					
					callback();
				}, rows[currentActionType].action_type_id)
			},
			function (error)
			{
				callback(actionTypes);
			}
		);
	});
}

module.exports.ActionType = ActionType;
