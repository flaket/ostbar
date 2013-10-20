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

ElementType.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM element_type WHERE element_type_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ElementType.initWithData( callback, rows[0]);
        else callback( 'Could not load ElementType with id ' + id, false );
    });
};

ElementType.loadAll = function ( callback ){
    db.query( 'SELECT * FROM element_type', function ( error, rows, fields ){
        if (error) return callback( error, false );

        var elementTypes = new Array();
        var currentElementType = 0;

        async.whilst(
            function (){
                return elementTypes.length < rows.length;
            },
            function ( callback ){
                ElementType.initWithData( function ( error, elementType ){
                    if ( error ) return callback( error );

                    currentElementType++;
                    elementTypes.push( elementType );
                    callback();
                }, rows[currentElementType]);
            },
            function ( error ){
                callback( error, elementTypes );
            }
        );
    });
};

ElementType.initWithData = function ( callback, data ){
    async.parallel({
        avatar: function ( callback ){
            Avatar.loadById( callback, data.avatar_id );
        },
        sound: function ( callback ){
            Sound.loadById( callback, data.sound_id );
        },
        world: function ( callback ){
            World.loadById( callback, data.world_id );
        },
        allowedActionTypes: function ( callback ){
            ActionType.loadAllInElementType( callback, data.element_type_id );
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
