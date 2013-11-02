var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function LanguageQuestionAlternative( data ){
    Entity.call( this );

    this.languageQuestionAlternativeId = data.language_question_alternative_id;
    this.languageQuestionId = data.language_question_id;
    this.alternative = data.alternative;
}

LanguageQuestionAlternative.prototype = new Entity();

LanguageQuestionAlternative.prototype.constructor = LanguageQuestionAlternative;

LanguageQuestionAlternative.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM language_question_alternative WHERE language_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) LanguageQuestionAlternative.initWithData( rows[0], callback );
        else callback( 'Could not load LanguageQuestionAlternative with id ' + id, false );
    });
}

LanguageQuestionAlternative.loadAllInLanguageQuestion = function ( languageQuestionId, callback ){
    if ( languageQuestionId == null ) return callback( null, false );

    var query = 'SELECT * FROM language_question_alternative WHERE language_question_id = ?';
    
    db.query( query, languageQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, LanguageQuestionAlternative.initWithData, callback );     
    });
}

LanguageQuestionAlternative.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    callback( null, new LanguageQuestionAlternative( data ) );
}

module.exports.LanguageQuestionAlternative = LanguageQuestionAlternative;
