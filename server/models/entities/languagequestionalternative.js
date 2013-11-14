var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function LanguageQuestionAlternative( data ){
    Entity.call( this );

    this.languageQuestionAlternativeId = data.language_question_alternative_id;
    this.languageQuestionId = data.language_question_id;
    this.alternative = data.alternative;
};

LanguageQuestionAlternative.prototype = new Entity();

LanguageQuestionAlternative.prototype.constructor = LanguageQuestionAlternative;

LanguageQuestionAlternative.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM language_question_alternative WHERE language_question_alternative_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) LanguageQuestionAlternative.initWithData( rows[0], callback );
        else callback( 'Could not load LanguageQuestionAlternative with id ' + id, false );
    });
};

LanguageQuestionAlternative.loadAllInLanguageQuestion = function ( languageQuestionId, callback ){
    if ( languageQuestionId == null ) return callback( null, false );

    var query = 'SELECT * FROM language_question_alternative WHERE language_question_id = ?';
    
    db.query( query, languageQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, LanguageQuestionAlternative.initWithData, callback );     
    });
};

LanguageQuestionAlternative.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    callback( null, new LanguageQuestionAlternative( data ) );
};

LanguageQuestionAlternative.create = function ( params, callback ){
    var languageQuestionId = params.languageQuestionId,
        alternative = params.alternative,
        correct = params.correct;

    if ( languageQuestionId == null || alternative == null || correct == null ){
        return callback( false, null );
    }

    var query = 'INSERT INTO language_question_alternative VALUES (NULL, ?, ?)',
        post = [ languageQuestionId, alternative ];

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ){
            var languageQuestionAlternativeId = rows.insertId;

            if ( correct == 'true' ){
                query = 'UPDATE language_question SET correct_alternative = ?';
                db.query( query, languageQuestionAlternativeId, function ( error, rows ){
                    if ( error ) return callback( error, false );

                    LanguageQuestionAlternative.loadById( languageQuestionAlternativeId, callback );
                });
            } else {
                LanguageQuestionAlternative.loadById( languageQuestionAlternativeId, callback );
            }

        } else return callback( 'Kunne ikke opprette LanguageQuestionAlternative med data ' + params, false );
    });
};

LanguageQuestionAlternative.createAlternatives = function ( alternatives, languageQuestionId, callback ){
    if ( alternatives == null || languageQuestionId == null ) return callback( null, false );

    db.query( 'DELETE FROM language_question_alternative WHERE language_question_id = ?', languageQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( alternatives, LanguageQuestionAlternative.create, callback );    
    });
};

module.exports.LanguageQuestionAlternative = LanguageQuestionAlternative;
