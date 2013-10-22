var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function QuizQuestionAlternative( data ){
    Entity.call( this );

    this.quizQuestionAlternativeId = data.quiz_question_alternative_id;
    this.quizQuestionId = data.quiz_question_id;
    this.alternative = data.alternative;
}

QuizQuestionAlternative.prototype = new Entity();

QuizQuestionAlternative.prototype.constructor = QuizQuestionAlternative;

QuizQuestionAlternative.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM quiz_question_alternative WHERE quiz_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) QuizQuestionAlternative.initWithData( rows[0], callback );
        else callback( 'Could not load QuizQuestionAlternative with id ' + id, false );
    });
}

QuizQuestionAlternative.loadAllInQuizQuestion = function ( quizQuestionId, callback ){
    var query = 'SELECT * ';
        query += 'FROM quiz_question_alternative ';
        query += 'WHERE quiz_question_id = ?';

    db.query( query, quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, QuizQuestionAlternative.initWithData, callback );
    });
}

QuizQuestionAlternative.loadAllCorrectInQuizQuestion = function ( quizQuestionId, callback ){
    var query = 'SELECT quiz_question_alternative_id ';
        query += 'FROM quiz_question_correct ';
        query += 'WHERE quiz_question_id = ?';

    db.query( query, quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var correctAlternatives = Array();

        for ( key in rows ){
            correctAlternatives.push( rows[key]['quiz_question_alternative_id'] );
        }

        callback( null, correctAlternatives );
    });
}

QuizQuestionAlternative.initWithData = function ( data, callback ){
    callback( null, new QuizQuestionAlternative( data) );
}

module.exports.QuizQuestionAlternative = QuizQuestionAlternative;
