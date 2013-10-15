var Entity 	= require( '../entity' ).Entity;
var DB 		= require( '../db' );
var db 		= DB.instance;
var async 	= require( 'async' );

var Goal 	= require( './goal' ).Goal;
var Scene   = require( './scene' ).Scene;
// var util  	= require( 'util' );

function Game( data ){
	Entity.call( this );

	this.game_id = data.game_id;
	this.userId = data.user_id;
	this.initialScene = data.initial_scene;
	this.goal = data.goal;
	this.created = data.created;
	this.deleted = data.deleted;
}

Game.prototype = new Entity();

Game.prototype.constructor = Game;

Game.loadById = function ( callback, id ){
	db.query( 'SELECT * FROM game WHERE game_id = ?', id, function ( error, rows, fields ){
  		if ( error ) throw error;

  		if ( rows.length == 1 ){
  			Game.initWithData( callback, rows[0] );
  		}
  		else callback( null );
	});
};

Game.loadByIdForUser = function ( callback, gameId, userId ){
	db.query( 'SELECT * FROM game WHERE game_id = ? AND user_id = ?', [gameId, userId], function ( error, rows, fields ){
		if ( error ) throw error;

		if ( rows.length == 1 ) Game.initWithData( callback, rows[0] );
		else callback( null );
	});
}

Game.loadAllForUser = function ( callback, userId ){
	db.query( 'SELECT * FROM game WHERE user_id = ?', userId, function ( error, rows, fields ){
		if ( error ) throw error;

		var games = new Array();
		var currentGame = 0;

		async.whilst( 
			function (){
				return games.length < rows.length;
			},
			function ( callback ){
				Game.initWithData( function ( game ){
					games.push( game );
					currentGame++;
					callback();
				}, rows[currentGame] );
			},
			function ( error ){
				if ( error ) callback( null );
				else callback( games );
			}
		 );
	});
}

Game.initWithData = function ( callback, data ){
	async.parallel({
		goal: function ( callback ){
			Goal.loadById( function ( goal ){
				callback( null, goal );
			}, data.goal_id );
		},
		initial_scene: function ( callback ){
			Scene.loadById( function ( scene ){
				callback( null, scene );
			}, data.initial_scene_id );
		}
	},
	function ( error, results ){
		if ( error ) callback( null );
		else {
			data.goal = results.goal;
			data.initial_scene = results.initial_scene;
			callback( new Game( data ) );
		}
	});
}

module.exports.Game = Game;
