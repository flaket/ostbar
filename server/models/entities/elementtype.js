var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );
var util    = require( 'util' );

var ActionType  = require( './actiontype.js' ).ActionType;
var Avatar      = require( './avatar' ).Avatar;
var Sound       = require( './sound' ).Sound;
var World       = require( './world' ).World;

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
    db.query( 'SELECT * FROM element_type WHERE element_type_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ElementType.initWithData( rows[0], callback);
        else callback( 'Could not load ElementType with id ' + id, false );
    });
};

ElementType.loadAll = function ( callback ){
    db.query( 'SELECT * FROM element_type', function ( error, rows, fields ){
        if (error) return callback( error, false );

        var elementTypes = new Array();
        var currentElementType = 0;

        async.map( rows, ElementType.initWithData, callback );
    });
};

ElementType.initWithData = function ( data, callback ){
    async.parallel({
        avatar: function ( callback ){
            Avatar.loadById( data.avatar_id, callback );
        },
        sound: function ( callback ){
            Sound.loadById( data.sound_id, callback );
        },
        world: function ( callback ){
            World.loadById( data.world_id, callback );
        },
        allowedActionTypes: function ( callback ){
            ActionType.loadAllInElementType( data.element_type_id, callback );
        }
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
