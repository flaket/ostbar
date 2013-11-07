var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var Avatar  = require( './avatar' ).Avatar;
var World   = require( './world' ).World;

function SceneType( data ){
    Entity.call( this );

    this.scenetypeId = data.scenetype_id;
    this.world = data.world;
    this.backgroundAvatar = data.backgroundAvatar;
}

SceneType.prototype = new Entity();

SceneType.prototype.constructor = SceneType;

SceneType.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM scenetype WHERE scenetype_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length === 1 ) SceneType.initWithData( rows[0], callback );
        else callback( 'Could not load SceneType with id ' + id, false );
    });
};

SceneType.loadAll = function ( callback ){
    db.query( 'SELECT * FROM scenetype', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, SceneType.initWithData, callback );
    });
}

SceneType.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    async.parallel({
        world: World.loadById.bind( World, data.world_id ),
        backgroundAvatar: Avatar.loadById.bind( Avatar, data.background_avatar_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.world = results.world;
        data.backgroundAvatar = results.backgroundAvatar;

        callback( null, new SceneType( data ));
    });
};

module.exports.SceneType = SceneType;
