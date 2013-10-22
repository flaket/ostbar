var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function Goal( data ){
    Entity.call( this );

    this.goalId = data.goal_id;
    this.nRewards = data.n_rewards;
}

Goal.prototype = new Entity();

Goal.prototype.constructor = Goal;

Goal.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM goal WHERE goal_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new Goal( rows[0] ) );
        else callback( 'Could not load Goal with id ' + id, false );
    });
}

module.exports.Goal = Goal;
