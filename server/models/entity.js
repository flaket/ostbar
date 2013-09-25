function Entity()
{

}

Entity.validateDBAndCallback = function(db, callback)
{
	if (db == null || callback == null)
	{
		if (callback)
		{
			callback(null);	
		}

		return false;
	}

	return true;
}

module.exports = Entity;
