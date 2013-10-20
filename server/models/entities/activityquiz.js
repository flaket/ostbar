var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var QuizQuestion = require( './quizquestion' ).QuizQuestion;

function ActivityQuiz( data ){
    Entity.call( this );

    this.activityQuizId = data.activity_quiz_id;
    this.activity_id = data.activity_id;
    this.questions = data.quiz_questions;
}

ActivityQuiz.prototype = new Entity(  );

ActivityQuiz.prototype.constructor = ActivityQuiz;

ActivityQuiz.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM activity_quiz WHERE activity_quiz_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityQuiz.initWithData( callback, rows[0] );
        else callback( 'Could not load ActivityQuiz with id ' + id, false );
    });
}

ActivityQuiz.loadByActivityId = function ( callback, activityId ){
    db.query( 'SELECT * FROM activity_quiz WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityQuiz.initWithData( callback, rows[0] );
        else callback( 'Could not load ActivityQuiz with activity_id ' + activityId, false );
    });
}

ActivityQuiz.initWithData = function ( callback, data ){
    async.parallel({
        questions: function ( callback ){
            QuizQuestion.loadAllInActivityQuiz( callback, data.activity_quiz_id )
        }
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.quiz_questions = results.questions;
        callback( null, new ActivityQuiz(  data ) );
    });
}

module.exports.ActivityQuiz = ActivityQuiz;
