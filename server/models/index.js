var ActionType  = require('./entities/actiontype');
var Avatar      = require('./entities/avatar');
var Game        = require('./entities/game');
var Sound       = require('./entities/sound');

Game.loadById(1, function(game)
{
    firstGame = game;

    console.log('found data ', firstGame);
});