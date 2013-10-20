var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var MathOperator = require( './mathoperator' ).MathOperator;

function ActivityMath( data ){
    Entity.call( this );

    this.activityMathId = data.activity_math_id;
    this.activity_id = data.activity_id;
    this.operators = data.operators;
    this.numbersRangeFrom = data.numbers_range_from;
    this.numbersRangeTo = data.numbers_range_to;
}

ActivityMath.prototype = new Entity(  );

ActivityMath.prototype.constructor = ActivityMath;

ActivityMath.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM activity_math WHERE activity_math_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( callback, rows[0] );
        else callback( 'Could not load ActivityMath with id ' + id, false );
    });
}

ActivityMath.loadByActivityId = function ( callback, activityId ){
    db.query( 'SELECT * FROM activity_math WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( callback, rows[0] );
        else callback( 'Could not load ActivityMath with activity_id ' + activityId, false );
    });
}

ActivityMath.initWithData = function ( callback, data ){
    async.parallel({
        operators: function ( callback ){
            MathOperator.loadAllInActivityMath( callback, data.activity_math_id );
        }
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.operators = results.operators;
        callback( null, new ActivityMath( data ) );
    });
}

module.exports.ActivityMath = ActivityMath;
