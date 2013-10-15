var Entity 	= require( '../entity' ).Entity;
var DB 		= require( '../db' );
var db 		= DB.instance;

function World( data ){
	Entity.call( this );

	this.worldId = data.world_id;
	this.world = data.world;
	this.title = data.title;
}

World.prototype = new Entity();

World.prototype.constructor = World;

World.loadById = function ( callback, id ){
	db.query( 'SELECT * FROM world WHERE world_id = ?', id, function ( error, rows, fields ){
		if ( error ) throw error;

		if ( rows.length == 1 ) callback( new World( rows[0] ) );
		else callback( null );
	});
}

World.loadAll = function ( callback ){
	db.query( 'SELECT * FROM WORLD', function ( error, rows, fields ){
		if ( error ) throw error;

		var worlds = new Array();

		for ( key in rows ){
			var row = rows[key];
			worlds.push( new World( row ) );
		}

		callback( worlds );
	});
}

module.exports.World = World;
