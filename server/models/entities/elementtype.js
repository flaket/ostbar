var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function ElementType(data)
{
	Entity.call(this);

	// implement more here!!
}

ElementType.prototype = new Entity();

ElementType.prototype.constructor = ElementType;

ElementType.loadById = function(callback, id)
{
	db.query('SELECT * FROM element_type WHERE element_type_id = ?', id, function(error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new ElementType(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

module.exports = ElementType;
