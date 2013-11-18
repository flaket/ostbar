var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function QuizQuestionAlternative( data ){
    Entity.call( this );

    this.quizQuestionAlternativeId = data.quiz_question_alternative_id;
    this.quizQuestionId = data.quiz_question_id;
    this.alternative = data.alternative;
};

QuizQuestionAlternative.prototype = new Entity();

QuizQuestionAlternative.prototype.constructor = QuizQuestionAlternative;

QuizQuestionAlternative.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM quiz_question_alternative WHERE quiz_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) QuizQuestionAlternative.initWithData( rows[0], callback );
        else callback( 'Could not load QuizQuestionAlternative with id ' + id, false );
    });
};

QuizQuestionAlternative.loadAllInQuizQuestion = function ( quizQuestionId, callback ){
    if ( quizQuestionId == null ) return callback( null, false );

    var query = 'SELECT * ';
        query += 'FROM quiz_question_alternative ';
        query += 'WHERE quiz_question_id = ?';

    db.query( query, quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, QuizQuestionAlternative.initWithData, callback );
    });
};

QuizQuestionAlternative.loadAllCorrectInQuizQuestion = function ( quizQuestionId, callback ){
    if ( quizQuestionId == null ) return callback( null, false );

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
};

QuizQuestionAlternative.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    callback( null, new QuizQuestionAlternative( data) );
};

QuizQuestionAlternative.create = function ( params, callback ){
    var quizQuestionId = params.quizQuestionId,
        alternative = params.alternative,
        correct = params.correct;

    if ( quizQuestionId == null || alternative == null || correct == null ){
        return callback( null, false );
    }

    var query = 'INSERT INTO quiz_question_alternative VALUES (NULL, ?, ?)',
        post = [ quizQuestionId, alternative ];

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ) {
            var quizQuestionAlternativeId = rows.insertId;

            if ( correct == 'true' ){
                query = 'INSERT INTO quiz_question_correct VALUES (?, ?)';
                post = [ quizQuestionId, quizQuestionAlternativeId ];

                db.query( query, post, function ( error, rows, fields ){
                    if ( error ) callback ( error, false );

                    QuizQuestionAlternative.loadById( quizQuestionAlternativeId, callback );
                });
            } else {
                QuizQuestionAlternative.loadById( quizQuestionAlternativeId, callback );
            }
        }
        else return callback( 'Kunne ikke opprette QuizQuestionAlternative med data ' + params, false );
    });
};

QuizQuestionAlternative.createAlternatives = function ( alternatives, quizQuestionId, callback ){
    if ( alternatives == null || quizQuestionId == null ) return callback( null, false );

    db.query( 'DELETE FROM quiz_question_alternative WHERE quiz_question_id = ?', quizQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( alternatives, QuizQuestionAlternative.create, callback );    
    });
};

module.exports.QuizQuestionAlternative = QuizQuestionAlternative;
