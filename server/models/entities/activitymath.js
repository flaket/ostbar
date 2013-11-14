var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var MathOperator = require( './mathoperator' ).MathOperator;

function ActivityMath( data ){
    Entity.call( this );

    this.activityMathId = data.activity_math_id;
    this.activityId = data.activity_id;
    this.operators = data.operators;
    this.numbersRangeFrom = data.numbers_range_from;
    this.numbersRangeTo = data.numbers_range_to;
    this.operandsCount = data.n_operands;
};

ActivityMath.prototype = new Entity(  );

ActivityMath.prototype.constructor = ActivityMath;

ActivityMath.loadById = function ( id, callback ){
    if ( id == null ) callback( null, false );

    db.query( 'SELECT * FROM activity_math WHERE activity_math_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityMath with id ' + id, false );
    });
};

ActivityMath.loadByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( null, false );

    db.query( 'SELECT * FROM activity_math WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityMath with activity_id ' + activityId, false );
    });
};

ActivityMath.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    async.parallel({
        operators: MathOperator.loadAllInActivityMath.bind( MathOperator, data.activity_math_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.operators = results.operators;

        callback( null, new ActivityMath( data ) );
    });
};

ActivityMath.create = function ( args, callback ){
    var activityId = args.activityId, 
        numbersRangeFrom = args.numbersRangeFrom, 
        numbersRangeTo = args.numbersRangeTo, 
        operandsCount = args.operandsCount, 
        operators = args.operators;

    if ( activityId == null || numbersRangeFrom == null || numbersRangeTo == null || operandsCount == null ){
        return callback( null, false );
    }

    var post = [activityId, numbersRangeFrom, numbersRangeTo, operandsCount];

    db.query('INSERT INTO activity_math VALUES (NULL, ?, ?, ?, ?)', post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ){
            ActivityMath.loadByActivityId( activityId, function ( error, activity ){
                if ( error ) callback( error, false );

                activity.addOperators( operators, callback );
            });
        } else return callback( 'Kunne ikke opprette ActivityMath', false );
    });
};

ActivityMath.prototype.addOperators = function ( operatorIds, callback ){
    if ( operatorIds == null ) return callback( null, false );

    var posts = Array();

    for ( key in operatorIds ){
        posts.push({
            mathActivityId: this.activityMathId,
            mathOperatorId: operatorIds[key]
        });
    }

    var self = this;

    async.map( posts, MathOperator.addToMathActivity, function( error, results ){
        if ( error ) return callback( error, false );
        else if (results.indexOf( false ) != -1) return callback ( 'Kunne ikke legge til operator nr ' + (results.indexOf( false ) + 1) , false );

        ActivityMath.loadById( self.activityMathId, callback );
    });
};

ActivityMath.delete = function ( activityMathId, callback ){
    if ( activityMathId == null ) return callback( 'Kan ikke slette ActivityMath der activityMathId er null', false );

    var query = 'DELETE FROM activity_math WHERE activity_math_id = ?';

    db.query( query, activityMathId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        query = 'DELETE FROM activity_math_to_math_operator_rel WHERE activity_math_id = ?';

        db.query( query, activityMathId, function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            return callback( null, true );
        });
    });
};

ActivityMath.deleteByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( 'Kan ikke slette ActivityMath der activityId er null', false );

    ActivityMath.loadByActivityId( activityId, function ( error, activity ){
        if ( error ) return callback( error, false );

        if ( activity ) return ActivityMath.delete( activity.activityMathId, callback );
        else return callback( null, true );
    });
};

module.exports.ActivityMath = ActivityMath;
