var util = require('util');
var models = require('../models')


module.exports = function (app) {
    // set up the routes themselves
    app.get('/api', function (req, res)
    {
        res.render('error', {
        	user: req.user
        });
    });

	app.get('/api/world/:id?', function (req, res)
	{
		var World = models.World;
		
		if (req.params.id)
		{
			World.loadById(function (world)
			{
				if (world != null)
				{
					res.send(world);
				}
				else
				{
					res.send('');
				}
			}, req.params.id);
		}

		World.loadAll(function (worlds) {
			if (worlds != null)
			{
				res.send(worlds);
			}
			else
			{
				res.send('');
			}
		});
    });
};