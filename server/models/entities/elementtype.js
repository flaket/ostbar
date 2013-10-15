var Entity 	= require( '../entity' ).Entity;
var DB 		= require( '../db' );
var db 		= DB.instance;
var async 	= require( 'async' );
var util 	= require( 'util' );

var ActionType 	= require( './actiontype.js' ).ActionType;
var Avatar 		= require( './avatar' ).Avatar;
var Sound 		= require( './sound' ).Sound;
var World 		= require( './world' ).World;

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
		if ( error ) throw error;

		if ( rows.length == 1 ){
			var data = rows[0];

			async.parallel({
				avatar: function ( callback ){
					Avatar.loadById( function ( avatar ){
						callback( null, avatar );
					}, data.avatar_id );
				},
				sound: function ( callback ){
					Sound.loadById( function ( sound ){
						callback( null, sound );
					}, data.sound_id );
				},
				world: function ( callback ){
					World.loadById( function ( world ) {
						callback( null, world );
					}, data.world_id );
				},
				allowedActionTypes: function ( callback ){
					ActionType.loadAllInElementType( function ( actionTypes ) {
						callback( null, actionTypes );
					}, data.element_type_id );
				}
			},
			function ( error, results ){
				if ( error ) callback( null );
				else {
					data.avatar = results.avatar;
					data.sound = results.sound;
					data.world = results.world;
					data.allowed_action_types = results.allowedActionTypes;

					callback( new ElementType( data ) );
				}
			});
		}
		else callback( null );
	});
}

module.exports.ElementType = ElementType;
