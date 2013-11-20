var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function ActivityQuiz( data ){
    Entity.call( this );

    this.activityQuizId = data.activity_quiz_id;
    this.activityId = data.activity_id;
    this.questions = data.quiz_questions;
}

ActivityQuiz.prototype = new Entity(  );

ActivityQuiz.prototype.constructor = ActivityQuiz;

ActivityQuiz.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM activity_quiz WHERE activity_quiz_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityQuiz.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityQuiz with id ' + id, false );
    });
};

ActivityQuiz.loadByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( null, false );

    db.query( 'SELECT * FROM activity_quiz WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityQuiz.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityQuiz with activity_id ' + activityId, false );
    });
};

ActivityQuiz.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var QuizQuestion = models.QuizQuestion;

    async.parallel({
        questions: QuizQuestion.loadAllInActivityQuiz.bind( QuizQuestion, data.activity_quiz_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.quiz_questions = results.questions;
        callback( null, new ActivityQuiz(  data ) );
    });
};

ActivityQuiz.create = function ( params, callback ){
    var activityId = params.activityId,
        questions = params.questions;

    if ( activityId == null || questions == null ) return callback( null, false );

    db.query( 'INSERT INTO activity_quiz VALUES (NULL, ?)', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, null );

        if ( rows.insertId ){
            ActivityQuiz.loadByActivityId( activityId, function ( error, activity ){
                if ( error ) return callback( error, false );

                activity.addQuestions( questions, callback );
            });
        } else return callback( 'Kunne ikke opprette ActivityQuiz', false );
    });
};

ActivityQuiz.prototype.addQuestions = function ( questions, callback ){
    if ( questions == null ) return callback( null, false );

    var self = this;

    for ( key in questions ){
        questions[ key ].activityQuizId = this.activityQuizId;
    }

    var QuizQuestion = models.QuizQuestion;

    async.map( questions, QuizQuestion.create, function ( error, results){
        if ( error ) return callback( error, false );
        else if ( results.indexOf( false ) != -1 ) return callback( 'Kunne ikke opprette spørsmål nr ' + ( results.indexOf( false ) + 1 ), false );

        ActivityQuiz.loadById( self.activityQuizId, callback );
    });
};

ActivityQuiz.delete = function ( activityQuizId, callback ){
    if ( activityQuizId == null ) return callback( 'Kan ikke slette ActivityQuiz der activityQuizId er null', false );

    var query = 'DELETE FROM activity_quiz WHERE activity_quiz_id = ?';

    db.query( query, activityQuizId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var QuizQuestion = models.QuizQuestion;

        QuizQuestion.deleteByActivityQuizId( activityQuizId, callback );
    });
};

ActivityQuiz.deleteByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( 'Kan ikke slette ActivityQuiz der activityId er null', false );

    ActivityQuiz.loadByActivityId( activityId, function ( error, activity ){
        if ( error ) return callback( error, false );

        if ( activity ) return ActivityQuiz.delete( activity.activityQuizId, callback );
        else return callback( null, true );
    });
};

module.exports.ActivityQuiz = ActivityQuiz;
