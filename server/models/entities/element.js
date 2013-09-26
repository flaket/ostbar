var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

function Element(data)
{
	Entity.call(this);

	this.elementId 		= data.element_id;
	this.elementType 	= 'FIKS OBJEKT, id: ' + data.element_type_id;
	this.frameX 		= data.frame_x;
	this.frameY 		= data.frame_y;
	this.frameWidth 	= data.frame_width;
	this.frameHeight 	= data.frame_height;
	this.actionTypes 	= '[...]';
}

Element.prototype = new Entity();

Element.prototype.constructor = Element;

Element.loadById = function(callback, id)
{
	db.query('SELECT * FROM element WHERE element_id = ?', id, function(error, rows, fields)
	{
		if (error) throw error;

		if (rows.length == 1)
		{
			callback(new Element(rows[0]));
		}
		else
		{
			callback(null);
		}
	});
}

Element.loadAllInScene = function(callback, id)
{
	var query;
	query  = 'SELECT * ';
	query += 'FROM scene_to_element_rel se_rel LEFT JOIN element e ON se_rel.element_id = e.element_id ';
	query += 'WHERE se_rel.scene_id = ?';

	db.query(query, id, function(error, rows, fields)
	{
		if (error) throw error;

		var elements = new Array();

		if (rows.length > 0)
		{
			for (key in rows)
			{
				var row = rows[key];
				elements.push(new Element(row));
			}
		}

		callback(elements);
	});
}

module.exports = Element;
