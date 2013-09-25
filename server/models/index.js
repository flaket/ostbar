var ActionType  = require('./entities/actiontype');
var Avatar      = require('./entities/avatar');
var Element 	= require('./entities/element');
var Game        = require('./entities/game');
var Goal 		= require('./entities/goal');
var Scene 		= require('./entities/scene');
var Sound       = require('./entities/sound');
var SubjectType = require('./entities/subjecttype');
var World 		= require('./entities/world');

Scene.loadById(1, function(scene)
{
	var myScene = scene;
	console.log('found data', myScene);
});

// Game.loadById(1, function(game)
// {
//     firstGame = game;

//     console.log('found data ', firstGame);
// });