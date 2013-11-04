var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var Avatar  = require( './avatar' ).Avatar;
var World   = require( './world' ).World;
var Element = require( './element' ).Element;

function Scene( data ){
    Entity.call( this );

    this.sceneId = data.scene_id;
    this.gameId = data.gameId;
    this.world = data.world;
    this.backgroundAvatar = data.backgroundAvatar;
    this.elements = data.elements;
}

Scene.prototype = new Entity();

Scene.prototype.constructor = Scene;

Scene.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM scene WHERE scene_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ){
            var data = rows[0];

            async.parallel({
                backgroundAvatar: Avatar.loadById.bind( Avatar, data.background_avatar_id ),
                elements: Element.loadAllInScene.bind( Element, data.scene_id ),
                world: World.loadById.bind( World, data.world_id )
            },
            function ( error, results ){
                if ( error ) return callback( error, false );
                
                data.backgroundAvatar = results.backgroundAvatar;
                data.elements = results.elements;
                data.world = results.world;
                callback( null, new Scene( data ) );  
            });
        }
        else callback( 'Could not load Scene with id ' + id, false );
    });
}

Scene.create = function ( gameId, worldId, backgroundAvatarId, callback ){
    if ( gameId == null || worldId == null || backgroundAvatarId == null ){
        return callback( null, false );
    }

    db.query( 'INSERT INTO scene VALUES (NULL, ?, ?, ?)', [gameId, worldId, backgroundAvatarId], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ) Scene.loadById( rows.insertId, callback );
        else callback( null, false );
    });
}

module.exports.Scene = Scene;
