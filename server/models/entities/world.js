var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;

function World( data ){
    Entity.call( this );

    this.worldId = data.world_id;
    this.world = data.world;
    this.title = data.title;
}

World.prototype = new Entity();

World.prototype.constructor = World;

World.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM world WHERE world_id = ?', id, function ( error, rows, fields ){
        if ( error ) callback( error, false );

        if ( rows.length == 1 ) callback( null, new World( rows[0] ) );
        else callback( 'Could not load World with id ' + id, false );
    });
}

World.loadAll = function ( callback ){
    db.query( 'SELECT * FROM WORLD', function ( error, rows, fields ){
        if ( error ) callback( error, false );

        var worlds = new Array();

        for ( key in rows ){
            var row = rows[key];
            worlds.push( new World( row ) );
        }

        callback( null, worlds );
    });
}

module.exports.World = World;
