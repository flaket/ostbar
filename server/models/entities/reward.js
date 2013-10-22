var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function Reward( data ){
    Entity.call( this );

    this.rewardId = data.reward_id;
    this.elementId = data.element_id;
}

Reward.prototype = new Entity();

Reward.prototype.constructor = Reward;

Reward.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM reward WHERE reward_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new Reward( rows[0] ) );
        else callback( 'Could not load Reward with id ' + id, false );
    });
}

module.exports.Reward = Reward;
