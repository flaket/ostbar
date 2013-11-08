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

MathOperator.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM math_operator WHERE math_operator_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) MathOperator.initWithData( rows[0], callback );
        else callback( 'Could not load MathOperator with id ' + id, false );
    });
}

MathOperator.loadAllInActivityMath = function ( activityMathId, callback ){
    if ( activityMathId == null ) return callback( null, false );

    var query = 'SELECT * '
        query += 'FROM activity_math_to_math_operator_rel am_to_mo_rel LEFT JOIN math_operator mo ';
        query += 'ON am_to_mo_rel.math_operator_id = mo.math_operator_id AND am_to_mo_rel.activity_math_id = ?';

    db.query( query, activityMathId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, MathOperator.initWithData, callback );
    });
}

MathOperator.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    callback( null, new MathOperator( data ) );
}

MathOperator.addToMathActivity = function ( mathActivityId, mathOperatorId ){
    if ( mathActivityId == null || mathOperatorId == null ){
        callback ( null, false );
    }

    var query = 'INSERT INTO activity_math_to_math_operator_rel VALUES (?, ?)';

    db.query(query, [mathActivityId, mathOperatorId], function ( error, rows, fields ) {
        if ( error ) callback( error, false );

        if ( rows.insertId ) {
            
        }
    });
}

module.exports.MathOperator = MathOperator;
