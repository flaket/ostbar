var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );
var util    = require( 'util' );

var models  = require( '../../models' );

function Scene( data ){
    Entity.call( this );

    this.sceneId = data.scene_id;
    this.gameId = data.gameId;
    this.sceneType = data.sceneType;
    this.elements = data.elements;
}

Scene.prototype = new Entity();

Scene.prototype.constructor = Scene;

Scene.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM scene WHERE scene_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Scene.initWithData( rows[0], callback );
        else callback( 'Could not load Scene with id ' + id, false );
    });
}

Scene.loadAllInGame = function ( gameId, callback ){
    if ( gameId == null ) return callback( null, false );

    db.query('SELECT * FROM scene WHERE game_id = ?', gameId, function ( error, rows, fields ){
        if ( error ) callback( error, false );

        async.map( rows, Scene.initWithData, callback );
    });
}

Scene.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var SceneType = models.SceneType;
    var Element = models.Element;

    async.parallel({
        sceneType: SceneType.loadById.bind( SceneType, data.scenetype_id ),
        elements: Element.loadAllInScene.bind( Element, data.scene_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );
        
        data.sceneType = results.sceneType;
        data.elements = results.elements;
        callback( null, new Scene( data ) );  
    });
}

Scene.create = function ( scenetype_id, gameId, callback ){
    if ( gameId == null || scenetype_id == null ){
        return callback( null, false );
    }

    db.query( 'INSERT INTO scene VALUES (NULL, ?, ?)', [scenetype_id, gameId], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ) Scene.loadById( rows.insertId, callback );
        else callback( null, false );
    });
}

Scene.delete = function ( sceneId, callback ){
    if ( sceneId == null ) return callback( 'Kan ikke slette Scene der sceneId er null', false );

    var Element = models.Element;

    Element.deleteAllInScene( sceneId, function ( error, success){
        if ( error ) return callback( error, false );

        var query = 'DELETE FROM scene WHERE scene_id = ?';

        db.query( query, sceneId, function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            callback( null, true );
        });
    });
}

Scene.deleteAllInGame = function ( gameId, callback ){
    if ( gameId == null ) return callback( 'Kan ikke slette Scene for Game der gameId er null', false );

    db.query( 'SELECT scene_id FROM scene WHERE game_id = ?', gameId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var sceneIds = new Array();

        for ( key in rows ){
            sceneIds.push( rows[ key ].scene_id );
        }

        async.map( sceneIds, Scene.delete, callback );
    });
}

module.exports.Scene = Scene;
