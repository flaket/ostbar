var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );
var util = require( 'util' );

var models  = require( '../../models' );

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
};

LanguageQuestion.loadAllInActivityLanguage = function( activityLanguageId, callback ){
    if ( activityLanguageId == null ) return callback( null, false );

    var query = 'SELECT  * FROM language_question WHERE activity_language_id = ?';

    db.query( query, activityLanguageId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, LanguageQuestion.initWithData, callback );
    });
};

LanguageQuestion.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    var Avatar = models.Avatar,
        Sound = models.Sound;

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
};

LanguageQuestion.create = function ( params, callback ){
    var languageQuestionType = params.languageQuestionType,
        alternatives = params.alternatives,
        activityLanguageId = params.activityLanguageId,
        dataId = parseInt( params.data_id );

    if ( languageQuestionType == null || alternatives == null || activityLanguageId == null || dataId == null ){
        return callback( null, false );
    }

    var query = 'INSERT INTO language_question VALUES (NULL, ?, ?, 0, ?)',
        post = [
            activityLanguageId,
            languageQuestionType,
            dataId
        ];

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ){

            var languageQuestionId = rows.insertId;

            LanguageQuestion.loadById( languageQuestionId, function ( error, languageQuestion ){
                if ( error ) return callback( error, false );

                for ( key in alternatives ){
                    alternatives[ key ].languageQuestionId = languageQuestionId;
                }

                var LanguageQuestionAlternative = models.LanguageQuestionAlternative;

                async.parallel({
                    alternatives: LanguageQuestionAlternative.createAlternatives.bind( LanguageQuestionAlternative, alternatives, languageQuestionId )
                },
                function ( error, results ){
                    if ( error ) return callback( error, false );
                    else if ( results.alternatives.indexOf( false ) != -1) {
                        return callback ( 'Kunne ikke legge til alternativ nr ' + ( results.indexOf( false ) + 1 ) , false );
                    }

                    LanguageQuestion.loadById( languageQuestionId, callback );
                });
            });
        } else return callback( 'Kunne ikke opprette LanguageQuestion med data ' + data, false );
    });
};

LanguageQuestion.delete = function ( languageQuestionId, callback ){
    if ( languageQuestionId == null ) return callback( 'Kan ikke slette languageQuestion der languageQuestionId er null', false );

    var query = 'DELETE FROM language_question WHERE language_question_id = ?';

    db.query( query, languageQuestionId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        query = 'DELETE FROM language_question_alternative WHERE language_question_id = ?';

        db.query( query, languageQuestionId, function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            callback( null, true );
        });
    });
};

LanguageQuestion.deleteByActivityLanguageId = function ( activityLanguageId, callback ){
    if ( activityLanguageId == null ) return callback( 'Kan ikke slette LanguageQuestion for activityLanguageId null', false );

    var query = 'SELECT * FROM language_question WHERE activity_language_id = ?';
    
    db.query( query, activityLanguageId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        var languageQuestionIds = new Array();

        for ( key in rows ){
            languageQuestionIds.push( rows[ key ].language_question_id );
        }

        async.map( languageQuestionIds, LanguageQuestion.delete, callback );
    });
};

module.exports.LanguageQuestion = LanguageQuestion;
