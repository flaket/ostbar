var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var Goal    = require( './goal' ).Goal;
var Scene   = require( './scene' ).Scene;
// var util     = require( 'util' );

function Game( data ){
    Entity.call( this );

    this.gameId = data.game_id;
    this.userId = data.user_id;
    this.name = data.name;
    this.initialScene = data.initial_scene;
    this.goal = data.goal;
    this.created = data.created;
    this.deleted = data.deleted;
}

Game.prototype = new Entity();

Game.prototype.constructor = Game;

Game.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM game WHERE game_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Game.initWithData( rows[0], callback );
        else callback( 'Could not load game with id ' + id, false );
    });
};

Game.loadByIdForUser = function ( gameId, userId, callback ){
    db.query( 'SELECT * FROM game WHERE game_id = ? AND user_id = ?', [gameId, userId], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Game.initWithData( rows[0], callback );
        else callback( 'Could not load games for user_id ' + userId, false );
    });
}

Game.loadAllForUser = function ( userId, callback ){
    db.query( 'SELECT * FROM game WHERE user_id = ?', userId, function ( error, rows, fields ){
        if ( error ) return callback ( error, false );

        async.map( rows, Game.initWithData, callback );
    });
}

Game.initWithData = function ( data, callback ){
    async.parallel({
        goal: Goal.loadById.bind( Goal, data.goal_id ),
        initial_scene: Scene.loadById.bind( Scene, data.initial_scene_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.goal = results.goal;
        data.initial_scene = results.initial_scene;
        callback(null,  new Game( data ) );
    });
}

module.exports.Game = Game;
