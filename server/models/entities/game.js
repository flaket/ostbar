var Entity 	= require('../entity').Entity;
var DB 		= require('../db');
var db 		= DB.instance;
var async 	= require('async');

var Goal 	= require('./goal').Goal;
var Scene   = require('./scene').Scene;
// var util  	= require('util');

function Game(data)
{
	Entity.call(this);

	this.game_id = data.game_id;
	this.userId = data.user_id;
	this.initialScene = data.initial_scene;
	this.goal = data.goal;
	this.created = data.created;
	this.deleted = data.deleted;
}

Game.prototype = new Entity();

Game.prototype.constructor = Game;

Game.loadById = function (callback, id)
{
	db.query('SELECT * FROM game WHERE game_id = ?', id, function (error, rows, fields)
	{
  		if (error) throw error;

  		if (rows.length == 1)
  		{
  			var data = rows[0];

  			async.parallel(
  			{
				goal: function (callback)
				{
					Goal.loadById(function (goal)
					{
						callback(null, goal);
					}, rows[0].goal_id);
				},
				initial_scene: function (callback)
				{
					Scene.loadById(function (scene)
					{
						callback(null, scene);
					}, rows[0].initial_scene_id);
				}
			},
			function (error, results)
			{
				if (error)
				{
					callback(null);
				}
				else
				{
					data.goal = results.goal;
					data.initial_scene = results.initial_scene;
					callback(new Game(data));
				}
			});
  		}
  		else
  		{
  			callback(null);
  		}
	});
};

module.exports.Game = Game;
