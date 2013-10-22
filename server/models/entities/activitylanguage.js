var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var LanguageQuestion = require( './languagequestion' ).LanguageQuestion;

function ActivityLanguage( data ){
    Entity.call( this );

    this.activityLanguageId = data.activity_language_id;
    this.activity_id = data.activity_id;
    this.language_questions = data.language_questions;
}

ActivityLanguage.prototype = new Entity(  );

ActivityLanguage.prototype.constructor = ActivityLanguage;

ActivityLanguage.loadById = function ( id, callback ){
    db.query( 'SELECT * FROM activity_language WHERE activity_language_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityLanguage.initWithData( rows[0], callback ); 
        else callback( 'Could not load ActivityLanguage with id ' + id, false );
    });
}

ActivityLanguage.loadByActivityId = function ( activityId, callback ){
    db.query( 'SELECT * FROM activity_language WHERE activity_id = ?', activityId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActivityLanguage.initWithData( rows[0], callback );
        else callback( 'Could not load ActivityLanguage with activity_id ' + activityId, false );
    });
}

ActivityLanguage.initWithData = function ( data, callback ) {
    async.parallel({
        questions: function ( callback ){
            LanguageQuestion.loadAllInActivityLanguage( data.activity_language_id, callback );
        }
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.language_questions = results.questions;
        callback( null, new ActivityLanguage( data ) );
    });
}

module.exports.ActivityLanguage = ActivityLanguage;
