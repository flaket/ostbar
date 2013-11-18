var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

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
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM quiz_question WHERE quiz_question_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) QuizQuestion.initWithData( rows[0], callback);
        else callback( 'Could not load QuizQuestion with id ' + id, false );
    });
}

QuizQuestion.loadAllInActivityQuiz = function ( activityQuizId, callback ){
    if ( activityQuizId == null ) return callback( null, false );

    var query = 'SELECT * ';
        query += 'FROM quiz_question ';
        query += 'WHERE activity_quiz_id = ?';

    db.query( query, activityQuizId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, QuizQuestion.initWithData, callback );
    });
}

QuizQuestion.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var QuizQuestionAlternative = models.QuizQuestionAlternative,
        SubjectType = models.SubjectType;

    async.parallel({
        alternatives: QuizQuestionAlternative.loadAllInQuizQuestion.bind( QuizQuestionAlternative, data.quiz_question_id ),
        correctAlternatives: QuizQuestionAlternative.loadAllCorrectInQuizQuestion.bind( QuizQuestionAlternative, data.quiz_question_id ),
        subject: SubjectType.loadById.bind( SubjectType, data.subject_type_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.alternatives = results.alternatives;
        data.correct_alternatives = results.correctAlternatives;
        data.subject = results.subject;

        callback( null, new QuizQuestion( data ) );
    });
}

QuizQuestion.create = function ( params, callback ){
    var question = params.question,
        timeLimit = parseInt(params.timeLimit),
        subjectId = params.subjectId,
        alternatives = params.alternatives,
        activityQuizId = params.activityQuizId;

    if ( question == null || alternatives == null || activityQuizId == null ){
        return callback( null, false );
    }

    var query = 'INSERT INTO quiz_question VALUES (NULL, ?, ?, ?, ?)',
        post = [
            activityQuizId,
            question,
            timeLimit,
            subjectId
        ];

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) return callback ( error, false );

        if ( rows.insertId ) {

            var quizQuestionId = rows.insertId;

            QuizQuestion.loadById( quizQuestionId, function ( error, quizQuestion ){
                if ( error ) return callback( error, false );

                for ( key in alternatives ){
                    alternatives[ key ].quizQuestionId = quizQuestionId;
                }
                
                var QuizQuestionAlternative = models.QuizQuestionAlternative;

                async.parallel({
                    alternatives: QuizQuestionAlternative.createAlternatives.bind( QuizQuestionAlternative, alternatives, quizQuestionId )
                },
                function ( error, results ){
                    if ( error ) return callback( error );
                    else if ( results.alternatives.indexOf( false ) != -1) {
                        return callback ( 'Kunne ikke legge til alternativ nr ' + ( results.indexOf( false ) + 1 ) , false );
                    }

                    QuizQuestion.loadById( quizQuestionId, callback );
                });
            });
        } else return callback( 'Kunne ikke opprette QuizQuestion med data ' + params, false );
    });
}

QuizQuestion.delete = function ( quizQuestionId, callback ){
    if ( quizQuestionId == null ) return callback( 'Kan ikke slette quizQuestion der quizQuestionId er null', false );

    var query = 'DELETE FROM quiz_question WHERE quiz_question_id = ?';

    db.query( query, quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        query = 'DELETE FROM quiz_question_alternative WHERE quiz_question_id = ?';

        db.query( query, quizQuestionId, function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            query = 'DELETE FROM quiz_question_correct WHERE quiz_question_id = ?';

            db.query ( query, quizQuestionId, function ( error, rows, fields ){
                if ( error ) return callback( error, false );

                callback( null, true );
            });
        });
    });
};

QuizQuestion.deleteByActivityQuizId = function ( activityQuizId, callback ){
    if ( activityQuizId == null ) return callback( 'Kan ikke slette QuizQuestion for activityQuizId null', false );

    var query = 'SELECT * FROM quiz_question WHERE activity_quiz_id = ?';
    
    db.query( query, activityQuizId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var quizQuestionIds = new Array();

        for ( key in rows ){
            quizQuestionIds.push( rows[ key ].quiz_question_id );
        }

        async.map( quizQuestionIds, QuizQuestion.delete, callback );
    });
};

module.exports.QuizQuestion = QuizQuestion;
