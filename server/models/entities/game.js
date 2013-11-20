var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function Game( data ){
    Entity.call( this );

    this.gameId = data.game_id;
    this.userId = data.user_id;
    this.name = data.name;
    this.initialSceneId = data.initial_scene_id;
    this.scenes = data.scenes;
    this.goal = data.goal;
    this.created = data.created;
    this.deleted = data.deleted;
    if ( data.user ){
        this.createdBy = data.user.username;
    }
}

Game.prototype = new Entity();

Game.prototype.constructor = Game;

Game.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM game WHERE game_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Game.initWithData( rows[0], callback );
        else callback( 'Could not load game with id ' + id, false );
    });
};

Game.loadByIdForUser = function ( gameId, userId, callback ){
    if ( gameId == null || userId == null ) return callback( null, false );

    db.query( 'SELECT * FROM game WHERE game_id = ? AND user_id = ?', [gameId, userId], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Game.initWithData( rows[0], callback );
        else callback( 'Could not load games for user_id ' + userId, false );
    });
}

Game.loadAllForUser = function ( userId, callback ){
    if ( userId == null ) return callback( null, false );

    db.query( 'SELECT * FROM game WHERE user_id = ?', userId, function ( error, rows, fields ){
        if ( error ) return callback ( error, false );

        async.map( rows, Game.initWithData, callback );
    });
}

Game.loadAllForUserSparse = function ( userId, callback ){
    if ( userId == null ) return callback( null, false );

    db.query( 'SELECT * FROM game WHERE user_id = ?', userId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, Game.initWithDataSparse, callback );
    });
}

Game.loadAllForOtherUsersSparse = function ( userId, callback ){
    if ( userId == null ) return callback( null, false );

    db.query( 'SELECT * FROM game WHERE NOT user_id = ? ORDER BY created DESC LIMIT 50', userId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, Game.initWithDataSparse, callback );
    });
}

Game.loadAllForUserAndOtherUsers = function ( userId, callback ){
    if ( userId == null ) return callback( null, false );

    async.parallel({
        games: Game.loadAllForUserSparse.bind( Game, userId ),
        otherGames: Game.loadAllForOtherUsersSparse.bind( Game, userId )
    },
    function ( error, results ){
        if ( error ) callback( error, false );

        callback( null, results );
    });
}

Game.loadAll = function ( callback ){
    db.query( 'SELECT * FROM game', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, Game.initWithData, callback );
    });
}

Game.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var Goal = models.Goal;
    var Scene = models.Scene;

    async.parallel({
        goal: Goal.loadById.bind( Goal, data.goal_id ),
        scenes: Scene.loadAllInGame.bind( Scene, data.game_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.goal = results.goal;
        data.scenes = results.scenes;
        
        callback(null,  new Game( data ) );
    });
}

Game.initWithDataSparse = function ( data, callback ){

    var User = models.User;

    async.parallel({
        user: User.loadById.bind( User, data.user_id )
    },
    function ( error, results ){
        data.user = results.user;

        callback( null, new Game( data ) );
    });
};

Game.create = function ( userId, name, callback ){
    if ( userId == null || name == null ) return callback( null, false );

    db.query( 'INSERT INTO game VALUES (NULL, ?, ?, NULL, NULL, CURRENT_TIMESTAMP, NULL)', [userId, name], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ) Game.loadById( rows.insertId, callback );
        else callback( 'Kunne ikke opprette nytt spill', false );
    });
}

Game.delete = function ( gameId, callback ){
    if ( gameId == null ) return callback( 'Kan ikke slette Game der gameId er null', false );

    Game.loadById( gameId, function ( error, game ){
        if ( error ) return callback( error, false );

        var Goal = models.Goal,
            Scene = models.Scene;

        var parallelOperations = {
            scenes: Scene.deleteAllInGame.bind( Scene, gameId )
        }

        if ( game.goal ){
            parallelOperations.goal = Goal.delete.bind( Goal, game.goal.goalId );
        }

        async.parallel( parallelOperations, function ( error, results ){
            if ( error ) return callback( error, false );

            var query = 'DELETE FROM game WHERE game_id = ?';

            db.query( query, gameId, function ( error, rows, fields){
                if ( error ) return callback( error, false );

                return callback( error, true );
            });
        });
    });
}

Game.prototype.setName = function ( name, callback ){
    if ( name == null ){
        return callback( 'Noe gikk galt, kan ikke sette navn = null', false );
    } else if ( name.length < 3 ){
        return callback( 'Spillet\'s navn må bestå av tre eller flere bokstaver', false );
    }

    if ( name == this.name ) return callback( null, true );

    db.query( 'UPDATE game SET name = ? WHERE game_id = ?', [name, this.gameId], function ( error, rows, fields ){
        if ( error ) callback( error, false );

        if ( rows.affectedRows == 1 ){
            callback( null, true );    
        } else {
            callback( null, false );
        } 
    });
}

Game.prototype.setInitialSceneId = function( initialSceneId, callback ){
    if ( initialSceneId == null) return callback( null, false );

    if ( initialSceneId == this.initialSceneId ) callback( null, true );

    db.query('UPDATE game SET initial_scene_id = ? WHERE game_id = ?', [initialSceneId, this.gameId], function ( error, rows, fields ){
        if ( error ) callback( error, false );

        if ( rows.affectedRows == 1 ){
            callback( null, true );    
        } else {
            callback( null, false );
        } 
    }); 
};

module.exports.Game = Game;
