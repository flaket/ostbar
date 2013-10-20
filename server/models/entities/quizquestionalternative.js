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

QuizQuestionAlternative.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM quiz_question_alternative WHERE quiz_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new QuizQuestionAlternative( rows[0] ) );
        else callback( 'Could not load QuizQuestionAlternative with id ' + id, false );
    });
}

QuizQuestionAlternative.loadAllInQuizQuestion = function ( callback, quizQuestionId ){
    var query = 'SELECT * ';
        query += 'FROM quiz_question_alternative ';
        query += 'WHERE quiz_question_id = ?';

    db.query( query, quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var quizQuestionAlternatives = new Array();
        var currentAlternative = 0;

        async.whilst( 
            function (){
                return quizQuestionAlternatives.length < rows.length;
            },
            function ( callback ){
                var data = rows[currentAlternative];
                quizQuestionAlternatives.push( new QuizQuestionAlternative( data ) );
                currentAlternative++;
                callback();
            },
            function ( error ){
                callback( error, quizQuestionAlternatives );
            }
         );
    });
}

QuizQuestionAlternative.loadAllCorrectInQuizQuestion = function ( callback, quizQuestionId ){
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

module.exports.QuizQuestionAlternative = QuizQuestionAlternative;
