var util = require('util');
var models = require('../models');
var passport = require('passport');

module.exports = function (app)
{
    app.get('/api', app.ensureAuthenticated, function (req, res)
    {
        res.render('error', {
        	user: req.user
        });
    });

	app.get('/api/world/:id?', app.ensureAuthenticated, function (req, res)
	{
		var World = models.World;
		
		if (req.params.id)
		{
			World.loadById(function (world)
			{
				if (world) res.send(world);
				else res.send('');
			}, req.params.id);
		}

		World.loadAll(function (worlds) {
			if (worlds) res.send(worlds);
			else res.send('');
		});
    });

    app.get('/api/game/:id?', app.ensureAuthenticated, function (req, res)
    {
    	var Game = models.Game;

    	res.send(req.user);
    });
};