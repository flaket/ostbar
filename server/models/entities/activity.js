var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var ActivityLanguage    = require( './activitylanguage' ).ActivityLanguage;
var ActivityMath        = require( './activitymath' ).ActivityMath;
var ActivityQuiz        = require( './activityquiz' ).ActivityQuiz;
var Element             = require( './element' ).Element;
var Reward              = require( './reward' ).Reward;

function Activity( data ){
    Entity.call( this );

    this.activityId     = data.activity_id;
    this.activityType   = data.activity_type;
    this.subclass       = data.subclass;
    this.reward         = data.reward;
}

Activity.prototype = new Entity();

Activity.prototype.constructor = Activity;

Activity.loadById = function ( id, callback ){
    if ( id == null ) callback( null, false );

    db.query( 'SELECT * FROM activity WHERE activity_id = ?', id, function ( error, rows, fields ){

        if ( error ) return callback( error, false );

        if ( rows.length == 1 ){
            var data = rows[0];
            var subclass;

            switch ( data.activity_type ){
                case 'LANGUAGE': subclass = ActivityLanguage; break;
                case 'MATH': subclass = ActivityMath; break;
                case 'QUIZ': subclass = ActivityQuiz; break;
            }

            async.parallel({
                reward: Reward.loadById.bind( Reward, data.reward_id ),
                subclass: subclass.loadByActivityId.bind( subclass, data.activity_id )
            },
            function ( error, results ){
                if ( error ) return callback ( error, false );

                data.reward = results.reward;
                data.subclass = results.subclass;

                callback( null, new Activity( data ) );
            });
        }
        else callback( 'Could not load activity', false );
    });
}

Activity.create = function ( activityType, rewardId, elementId, params, callback ){
    if ( activityType == null ) callback( null, false );

    if (activityType == 'MATH' || activityType == 'LANGUAGE' || activityType == 'QUIZ' ){
        db.query('INSERT INTO activity VALUES (NULL, ?, ?)', [activityType, rewardId], function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            var activityId = rows.insertId;

            if (!activityId) return callback( 'Kunne ikke opprette aktivitet', false );

            var subclass;

            switch ( activityType ){
                case 'LANGUAGE': subclass = ActivityLanguage; break;
                case 'MATH': subclass = ActivityMath; break;
                case 'QUIZ': subclass = ActivityQuiz; break;
            }

            params.activityId = activityId;

            subclass.create( params, function ( error, subclassInstance ){
                if ( error ) return callback( error, false );

                if ( subclassInstance ){
                    Element.loadById( elementId, function ( error, element ){
                        if ( error ) return callback( error );

                        if ( element ){
                            element.addActivity( activityId, function ( error, element ){

                                console.log('element add activity');
                                console.log(error);
                                console.log(element);

                                if ( error ) return callback( error, false );

                                if ( element ) Activity.loadById( activityId, callback );
                                else return callback( 'Kunne ikke legge til aktivitet av type ' + activityType, false );

                            });
                        } else return callback( 'Kunne ikke laste element med id ' + elementId, false );
                    });
                } else return callback( 'Kunne ikke opprette aktivitet av type ' + activityType, false );
            });
        });
    } else return callback( 'Ugyldig aktivitetstype, ' + activityType, false );
}

module.exports.Activity = Activity;
