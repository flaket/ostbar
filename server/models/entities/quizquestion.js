var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var SubjectType             = require( './subjecttype' ).SubjectType;
var QuizQuestionAlternative = require( './quizquestionalternative' ).QuizQuestionAlternative;

function QuizQuestion( data ){
    Entity.call( this );

    this.quizQuestionId = data.quiz_question_id;
    this.question = data.question;
    this.timeLimit = data.time_limit;
    this.subject = data.subject;
    this.alternatives = data.alternatives;
    this.correctAlternatives = data.correct_alternatives;
}

QuizQuestion.prototype = new Entity();

QuizQuestion.prototype.constructor = QuizQuestion;

QuizQuestion.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM quiz_question WHERE quiz_question_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) QuizQuestion.initWithData( rows[0], callback);
        else callback( 'Could not load QuizQuestion with id ' + id, false );
    });
}

QuizQuestion.loadAllInActivityQuiz = function ( activityQuizId, callback ){
    var query = 'SELECT * ';
        query += 'FROM quiz_question ';
        query += 'WHERE activity_quiz_id = ?';

    db.query( query, activityQuizId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, QuizQuestion.initWithData, callback );
    });
}

QuizQuestion.initWithData = function ( data, callback ){
    async.parallel({
        alternatives: function ( callback ){
            QuizQuestionAlternative.loadAllInQuizQuestion( data.quiz_question_id, callback );
        },
        correctAlternatives: function ( callback ){
            QuizQuestionAlternative.loadAllCorrectInQuizQuestion( data.quiz_question_id, callback );
        },
        subject: function ( callback ){
            SubjectType.loadById( data.subject_type_id, callback );
        }
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.alternatives = results.alternatives;
        data.correct_alternatives = results.correctAlternatives;
        data.subject = results.subject;

        callback( null, new QuizQuestion( data ) );
    });
}

module.exports.QuizQuestion = QuizQuestion;
