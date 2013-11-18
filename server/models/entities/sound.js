var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function Sound( data ){
    Entity.call( this );

    this.soundId = data.sound_id;
    this.url = data.url;
}

Sound.prototype = new Entity();

Sound.prototype.constructor = Sound;

Sound.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM sound WHERE sound_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new Sound( rows[0] ) );
        else callback( 'Could not load Sound with id ' + id, false );
    });
}

Sound.loadAll = function ( callback ){
    db.query( 'SELECT * FROM sound', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var sounds = new Array();

        for ( key in rows ){
            var row = rows[key];
            sounds.push( new Sound( row ) );
        }
        
        callback( null, sounds );
    });
}

module.exports.Sound = Sound;
