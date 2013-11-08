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
    this.operandsCount = data.n_operands;
}

ActivityMath.prototype = new Entity(  );

ActivityMath.prototype.constructor = ActivityMath;

ActivityMath.loadById = function ( id, callback ){
    if ( id == null ) callback( null, false );

    db.query( 'SELECT * FROM activity_math WHERE activity_math_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityMath with id ' + id, false );
    });
}

ActivityMath.loadByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( null, false );

    db.query( 'SELECT * FROM activity_math WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityMath.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityMath with activity_id ' + activityId, false );
    });
}

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
}

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

                for ( key in operators ){
                    var operator = operators[key];

                }

            });
        } else return callback( 'Kunne ikke opprette MathActivity', false );
    });
}

ActivityMath.prototype.addOperator = function ( operatorId, callback ){
    if ( operatorId == null ) return callback( null, false );

    var query = 'INSERT INTO activity_math_to_math_operator_rel VALUES (?, ?)';

    var self = this;

    db.query( query, [this.activityMathId, operatorId], function ( error, rows, fields){
        if ( error ) return callback( error, false );

        if ( rows.insertId ){
            MathOperator.loadById( operatorId, function ( error, mathOperator ){
                if ( error ) callback( error, false );

                if ( !self.operators ) self.operators = [];
                self.operators.push( mathOperator );


            });
        }
    });
}

module.exports.ActivityMath = ActivityMath;
