var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function Goal( data ){
    Entity.call( this );

    this.goalId = data.goal_id;
    this.nRewards = data.n_rewards;
}

Goal.prototype = new Entity();

Goal.prototype.constructor = Goal;

Goal.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM goal WHERE goal_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new Goal( rows[0] ) );
        else callback( 'Could not load Goal with id ' + id, false );
    });
}


Goal.delete = function ( goalId, callback ){
    if ( goalId ) return callback( 'Kan ikke slette Goal der goalId er null', false );

    db.query( 'DELETE FROM goal WHERE goal_id = ?', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        callback( null, true );
    });
}

module.exports.Goal = Goal;
