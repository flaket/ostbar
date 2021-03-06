var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

function ActivityLanguage( data ){
    Entity.call( this );

    this.activityLanguageId = data.activity_language_id;
    this.activity_id = data.activity_id;
    this.language_questions = data.language_questions;
};

ActivityLanguage.prototype = new Entity(  );

ActivityLanguage.prototype.constructor = ActivityLanguage;

ActivityLanguage.loadById = function ( id, callback ){
    if ( id == null ) callback( null, false );

    db.query( 'SELECT * FROM activity_language WHERE activity_language_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityLanguage.initWithData( rows[0], callback ); 
        else callback( 'Could not load ActivityLanguage with id ' + id, false );
    });
};

ActivityLanguage.loadByActivityId = function ( activityId, callback ){
    if ( activityId == null ) callback( null, false );

    db.query( 'SELECT * FROM activity_language WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityLanguage.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityLanguage with activity_id ' + activityId, false );
    });
};

ActivityLanguage.initWithData = function ( data, callback ){
    if ( data == null ) callback( null, false );

    var LanguageQuestion = models.LanguageQuestion;

    async.parallel({
        questions: LanguageQuestion.loadAllInActivityLanguage.bind( LanguageQuestion, data.activity_language_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.language_questions = results.questions;
        callback( null, new ActivityLanguage( data ) );
    });
};

ActivityLanguage.create = function ( params, callback ){
    var activityId = params.activityId,
        questions = params.questions;

    if ( questions == null || activityId == null ) return callback( null, false );

    db.query( 'INSERT INTO activity_language VALUES (NULL, ?)', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ){
            ActivityLanguage.loadByActivityId( activityId, function ( error, activity ){
                if ( error ) return callback( error, false );

                activity.addQuestions( questions, callback );
            });
        } else return callback( 'Kunne ikke opprette ActivityLanguage', false );
    });
};

ActivityLanguage.prototype.addQuestions = function ( questions, callback ){
    if ( questions == null ) return callback( null, false );

    var self = this;

    for ( key in questions ){
        questions[ key ].activityLanguageId = this.activityLanguageId;
    }

    var LanguageQuestion = models.LanguageQuestion;

    async.map( questions, LanguageQuestion.create, function ( error, results ){
        if ( error ) return callback( error, false );
        else if ( results.indexOf( false ) != -1 ) return callback( 'Kunne ikke opprette spørsmål nr ' + ( results.indexOf( false ) + 1 ), false );

        ActivityLanguage.loadById( self.activityLanguageId, callback );
    });
};


ActivityLanguage.delete = function ( activityLanguageId, callback ){
    if ( activityLanguageId == null ) return callback( 'Kan ikke slette ActivityLanguage der activityLanguageId er null', false );

    var query = 'DELETE FROM activity_language WHERE activity_language_id = ?';

    db.query( query, activityLanguageId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var LanguageQuestion = models.LanguageQuestion;

        LanguageQuestion.deleteByActivityLanguageId( activityLanguageId, callback );
    });
};

ActivityLanguage.deleteByActivityId = function ( activityId, callback ){
    if ( activityId == null ) return callback( 'Kan ikke slette ActivityLanguage der activityId er null', false );

    ActivityLanguage.loadByActivityId( activityId, function ( error, activity ){
        if ( error ) return callback( error, false );

        if ( activity ) return ActivityLanguage.delete( activity.activityLanguageId, callback );
        else return callback( null, true );
    });
}

module.exports.ActivityLanguage = ActivityLanguage;
