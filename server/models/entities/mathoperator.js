var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function MathOperator( data ){
    Entity.call( this );

    this.mathOperatorId = data.math_operator_id;
    this.operator = data.operator;
}

MathOperator.prototype = new Entity();

MathOperator.prototype.constructor = MathOperator;

MathOperator.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM math_operator WHERE math_operator_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) MathOperator.initWithData( callback, rows[0] );
        else callback( 'Could not load MathOperator with id ' + id, false );
    });
}

MathOperator.loadAllInActivityMath = function ( callback, activityMathId ){
    var query = 'SELECT * '
        query += 'FROM activity_math_to_math_operator_rel am_to_mo_rel LEFT JOIN math_operator mo ';
        query += 'ON am_to_mo_rel.math_operator_id = mo.math_operator_id AND am_to_mo_rel.activity_math_id = ?';

    db.query( query, activityMathId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var operators = new Array();
        var currentOperator = 0;

        async.whilst( 
            function (){
                return operators.length < rows.length;
            },
            function ( callback ){
                MathOperator.initWithData( function ( error, mathOperator ){
                    if ( error ) callback( error );

                    operators.push( mathOperator );
                    currentOperator++;
                    callback();
                }, rows[currentOperator] )
            },
            function ( error ){
                callback( error, operators );
            }
         );
    });
}

MathOperator.initWithData = function ( callback, data ){
    callback( null, new MathOperator( data ) );
}

module.exports.MathOperator = MathOperator;
