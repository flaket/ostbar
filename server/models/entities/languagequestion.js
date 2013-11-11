var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var Avatar                      = require( './avatar' ).Avatar;
var Sound                       = require( './sound' ).Sound;
var LanguageQuestionAlternative = require( './languagequestionalternative' ).LanguageQuestionAlternative;

function LanguageQuestion( data ){
    Entity.call( this );

    this.languageQuestionId = data.language_question_id;
    this.activityLanguageId = data.activity_language_id;
    this.languageQuestionType = data.language_question_type;
    this.correctAlternative = data.correct_alternative;
    this.data = data.data;
    this.alternatives = data.alternatives;
}

LanguageQuestion.prototype = new Entity();

LanguageQuestion.prototype.constructor = LanguageQuestion;

LanguageQuestion.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM language_question WHERE language_question_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) LanguageQuestion.initWithData( rows[0], callback );
        else callback( 'Could not load LanguageQuestion with id ' + id, false );
    });
}

LanguageQuestion.loadAllInActivityLanguage = function( activityLanguageId, callback ){
    if ( activityLanguageId == null ) return callback( null, false );

    var query = 'SELECT  * FROM language_question WHERE activity_language_id = ?';

    db.query( query, activityLanguageId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, LanguageQuestion.initWithData, callback );
    });
}

LanguageQuestion.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    switch ( data.language_question_type ){
        case 'PICTURE_RECOGNIZE': dataClass = Avatar;
        case 'SOUND_RECOGNIZE': dataClass = Sound;
    }

    async.parallel({
        dataClass: dataClass.loadById.bind( dataClass, data.data_id ),
        alternatives: LanguageQuestionAlternative.loadAllInLanguageQuestion.bind( LanguageQuestionAlternative, data.language_question_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );
        
        data.data = results.dataClass;
        data.alternatives = results.alternatives;

        callback( null, new LanguageQuestion( data ) );   
    });
}

module.exports.LanguageQuestion = LanguageQuestion;
