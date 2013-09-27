var ActionType  = require('./entities/actiontype').ActionType;
var Avatar      = require('./entities/avatar').Avatar;
var Element 	= require('./entities/element').Element;
var Game        = require('./entities/game').Game;
var Goal 		= require('./entities/goal').Game;
var Scene 		= require('./entities/scene').Scene;
var Sound       = require('./entities/sound').Sound;
var SubjectType = require('./entities/subjecttype').SubjectType;
var World 		= require('./entities/world').World;

var util 		= require('util');

// Scene.loadById(function(scene)
// {
// 	var myScene = scene;
// 	console.log('found data', util.inspect(myScene, false, null));
// }, 1);

Game.loadById(function(game)
{
    
    firstGame = game;
    console.log('found game ', util.inspect(firstGame, false, null));

}, 1);
