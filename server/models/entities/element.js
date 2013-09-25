var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

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

Element.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
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
}

Element.loadAllInScene = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
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
}

module.exports = Element;
