var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function Avatar( data ){
    Entity.call( this );

    this.avatarId = data.avatar_id;
    this.url = data.url;
}

Avatar.prototype = new Entity(  );

Avatar.prototype.constructor = Avatar;

Avatar.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM avatar WHERE avatar_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new Avatar( rows[0] ) );
        else callback( 'Could not load Avatar with id ' + id, false );
    });
}

Avatar.loadAll = function ( callback ){
    db.query( 'SELECT * FROM avatar', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var avatars = new Array();

        if ( rows.length > 0 ){
            for ( key in rows ){
                var row = rows[key];
                avatars.push( new Avatar( row ) );
            }
        }

        callback( null, avatars );
    });
}

module.exports.Avatar = Avatar;
