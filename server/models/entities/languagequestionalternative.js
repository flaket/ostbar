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

LanguageQuestionAlternative.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM language_question_alternative WHERE language_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) callback( null, new LanguageQuestionAlternative( rows[0] ) );
        else callback( 'Could not load LanguageQuestionAlternative with id ' + id, false );
    });
}

LanguageQuestionAlternative.loadAllInLanguageQuestion = function ( callback, languageQuestionId ){
    var query = 'SELECT * FROM language_question_alternative WHERE language_question_id = ?';
    
    db.query( query, languageQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var languageQuestionAlternatives = new Array();
        var currentAlternative = 0;

        async.whilst( 
            function (){
                return languageQuestionAlternatives.length < rows.length;
            },
            function ( callback ){
                var data = rows[currentAlternative];
                languageQuestionAlternatives.push( new LanguageQuestionAlternative( data ) );
                currentAlternative++;
                callback();
            },
            function ( error ){
                callback( error, languageQuestionAlternatives );
            }
         );     
    });
}

module.exports.LanguageQuestionAlternative = LanguageQuestionAlternative;
