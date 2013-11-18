var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );
var util    = require( 'util' );

var models  = require( '../../models' );

function ElementType( data ){
    Entity.call( this );

    this.elementTypeId = data.element_type_id;
    this.avatar = data.avatar;
    this.sound = data.sound;
    this.world = data.world;
    this.allowedActionTypes = data.allowed_action_types;
}

ElementType.prototype = new Entity();

ElementType.prototype.constructor = ElementType;

ElementType.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM element_type WHERE element_type_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ElementType.initWithData( rows[0], callback);
        else callback( 'Could not load ElementType with id ' + id, false );
    });
};

ElementType.loadAll = function ( callback ){
    db.query( 'SELECT * FROM element_type', function ( error, rows, fields ){
        if (error) return callback( error, false );

        async.map( rows, ElementType.initWithData, callback );
    });
};

ElementType.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var Avatar = models.Avatar,
        Sound = models.Sound,
        World = models.World,
        ActionType = models.ActionType;

    async.parallel({
        avatar: Avatar.loadById.bind( Avatar, data.avatar_id ),
        sound: Sound.loadById.bind( Sound, data.sound_id ),
        world: World.loadById.bind( World, data.world_id ),
        allowedActionTypes: ActionType.loadAllInElementType.bind( ActionType, data.element_type_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, null );

        data.avatar = results.avatar;
        data.sound = results.sound;
        data.world = results.world;
        data.allowed_action_types = results.allowedActionTypes;

        callback( null, new ElementType( data ) );
    });
};

module.exports.ElementType = ElementType;
