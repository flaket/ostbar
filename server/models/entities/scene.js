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
    this.world = data.world;
    this.backgroundAvatar = data.backgroundAvatar;
    this.elements = data.elements;
}

Scene.prototype = new Entity();

Scene.prototype.constructor = Scene;

Scene.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM scene WHERE scene_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ){
            var data = rows[0];

            async.parallel({
                backgroundAvatar: function ( callback ){
                    Avatar.loadById( data.background_avatar_id, callback );
                },
                elements: function ( callback ){
                    Element.loadAllInScene( data.scene_id, callback );
                },
                world: function ( callback ){
                    World.loadById( data.world_id, callback );
                }
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

module.exports.Scene = Scene;
