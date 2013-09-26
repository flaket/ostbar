var ActionType  = require('./entities/actiontype');
var Avatar      = require('./entities/avatar');
var Element 	= require('./entities/element');
var Game        = require('./entities/game');
var Goal 		= require('./entities/goal');
var Scene 		= require('./entities/scene');
var Sound       = require('./entities/sound');
var SubjectType = require('./entities/subjecttype');
var World 		= require('./entities/world');

var util 		= require('util');

// Scene.loadById(function(scene)
// {
// 	var myScene = scene;
// 	console.log('found data', myScene);
// }, 1);

Game.loadById(function(game)
{
    firstGame = game;

    console.log('found game ', util.inspect(firstGame, false, null));
}, 1);
