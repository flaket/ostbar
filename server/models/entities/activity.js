var Entity 	= require( '../entity' ).Entity;
var DB 		= require( '../db' );
var db 		= DB.instance;
var async 	= require( 'async' );

var ActivityLanguage 	= require( './activitylanguage' ).ActivityLanguage;
var ActivityMath 		= require( './activitymath' ).ActivityMath;
var ActivityQuiz 		= require( './activityquiz' ).ActivityQuiz;
var Reward 				= require( './reward' ).Reward;

function Activity( data ){
	Entity.call( this );

	this.activityId 	= data.activity_id;
	this.activityType 	= data.activity_type;
	this.subclass 		= data.subclass;
	this.reward 		= data.reward;
}

Activity.prototype = new Entity();

Activity.prototype.constructor = Activity;

Activity.loadById = function ( callback, id ){
	db.query( 'SELECT * FROM activity WHERE activity_id = ?', id, function ( error, rows, fields ){
		if ( error ) throw error;

		if ( rows.length == 1 ){
			var data = rows[0];
			var subclass;

			switch ( data.activity_type ){
				case 'LANGUAGE': subclass = ActivityLanguage; break;
				case 'MATH': subclass = ActivityMath; break;
				case 'QUIZ': subclass = ActivityQuiz; break;
			}

			async.parallel({
				reward: function ( callback ){
					Reward.loadById( function ( reward ){
						callback( null, reward );
					}, rows[0].reward_id );
				},
				subclass: function ( callback ){
					subclass.loadByActivityId( function ( subclass ){
						callback( null, subclass );
					}, data.activity_id );
				}
			},
			function ( error, results ){
				data.reward = results.reward;
				data.subclass = results.subclass;

				callback( new Activity( data ) );
			});
		}
		else callback( null );
	});
}

module.exports.Activity = Activity;
