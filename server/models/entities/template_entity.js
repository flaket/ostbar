var Entity 	= require('../entity');
var DB 		= require('../db');
var db 		= DB.instance;

function TemplateEntity(data)
{
	Entity.call(this);
}

TemplateEntity.prototype = new Entity();

TemplateEntity.prototype.constructor = TemplateEntity;

module.exports = TemplateEntity;
