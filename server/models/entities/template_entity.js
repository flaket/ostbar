var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

function TemplateEntity(data)
{
	Entity.call(this);
}

TemplateEntity.prototype = new Entity();

TemplateEntity.prototype.constructor = TemplateEntity;

TemplateEntity.loadById = function(id, callback)
{
	if (Entity.validateDBAndCallback(db, callback))
	{
		db.query('SELECT * FROM ... WHERE ... = ?', id, function(error, rows, fields)
		{
			if (error) throw error;

			if (rows.length == 1)
			{
				callback(new TemplateEntity(rows[0]));
			}
			else
			{
				callback(null);
			}
		});
	}
}

module.exports = TemplateEntity;
