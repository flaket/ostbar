var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

var models  = require( '../../models' );

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

            var ActivityLanguage = models.ActivityLanguage,
                ActivityMath = models.ActivityMath,
                ActivityQuiz = models.ActivityQuiz;

            switch ( data.activity_type ){
                case 'LANGUAGE': subclass = ActivityLanguage; break;
                case 'MATH': subclass = ActivityMath; break;
                case 'QUIZ': subclass = ActivityQuiz; break;
            }

            var Reward = models.Reward;

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
        else callback( 'Could not load activity with id ' + id, false );
    });
}

Activity.create = function ( activityType, rewardId, elementId, params, callback ){
    if ( activityType == null || elementId == null || params == null ) callback( null, false );

    var Element = models.Element;

    Element.loadById( elementId, function ( error, element ){
        if ( error ) return callback( error, false );

        if ( element ){
            if ( !element.hasActivity() ){
                if (activityType == 'MATH' || activityType == 'LANGUAGE' || activityType == 'QUIZ' ){
                    db.query('INSERT INTO activity VALUES (NULL, ?, ?)', [activityType, rewardId], function ( error, rows, fields ){
                        if ( error ) return callback( error, false );

                        var activityId = rows.insertId;

                        if (!activityId) return callback( 'Kunne ikke opprette aktivitet', false );

                        var ActivityLanguage = models.ActivityLanguage,
                            ActivityMath = models.ActivityMath,
                            ActivityQuiz = models.ActivityQuiz;

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
                                element.addActivity( activityId, function ( error, element ){
                                    if ( error ) return callback( error, false );

                                    if ( element ) return Activity.loadById( activityId, callback );
                                    else return callback( 'Kunne ikke legge til aktivitet av type ' + activityType, false );
                                });
                            } else return callback( 'Kunne ikke opprette aktivitet av type ' + activityType, false );
                        });
                    });
                } else return callback( 'Ugyldig aktivitetstype, ' + activityType, false );
            } else return callback( 'Elementet du vil legge til en aktivitet på har allerede en aktivitet', false );
        } else return callback( 'Elementet du vil legge til en aktivitet på eksisterer ikke', false );
    });
}

Activity.update = function ( activityId, activityType, rewardId, elementId, params, callback ){
    if ( activityId == null || activityType == null || elementId == null || params == null ) callback( null, false );

    var Element = models.Element;

    Element.loadById( elementId, function ( error, element ){
        if ( error ) return callback( error, false );

        if ( element ){
            if ( element.hasActivity() ){
                if (activityType == 'MATH' || activityType == 'LANGUAGE' || activityType == 'QUIZ' ){
                    Activity.loadById( activityId, function( error, activity ){
                        if ( error ) return callback( error, false );

                        if ( activity ){

                            var ActivityLanguage = models.ActivityLanguage,
                                ActivityMath = models.ActivityMath,
                                ActivityQuiz = models.ActivityQuiz;
                            
                            var subclass,
                                subclassId;

                            switch ( activity.activityType ){
                                case 'LANGUAGE': subclass = ActivityLanguage; break;
                                case 'MATH': subclass = ActivityMath; break;
                                case 'QUIZ': subclass = ActivityQuiz; break;
                            }

                            params.activityId = activityId;
                            
                            subclass.deleteByActivityId( activityId, function ( error, success ){
                                if ( error ) return callback( error, false );

                                if ( success ){
                                    switch ( activityType ){
                                        case 'LANGUAGE': subclass = ActivityLanguage; break;
                                        case 'MATH': subclass = ActivityMath; break;
                                        case 'QUIZ': subclass = ActivityQuiz; break;
                                    }

                                    subclass.create( params, function ( error, subclassInstance ){
                                        if ( error ) return callback( error, false );

                                        if ( subclassInstance ){
                                            var query = 'UPDATE activity SET activity_type = ? WHERE activity_id = ?';
                                            
                                            db.query( query, [ activityType, activityId ], function ( error, rows, fields ){
                                                if ( error ) return callback( error, false );

                                                element.addActivity( activityId, function ( error, element ){
                                                    if ( error ) return callback( error, false );

                                                    if ( element ) return Activity.loadById( activityId, callback );
                                                    else return callback( 'Kunne ikke legge til aktivitet av type ' + activityType, false );
                                                });
                                            });
                                        } else return callback( 'Kunne ikke lagre ny data for ' + activityType );
                                    });
                                } else return callback( 'Kunne ikke oppdatere aktivitet med id ' + activityId, false );
                            });
                        } else return callback( 'Aktivitet med id ' + activityId + ' finnes ikke' );
                    });
                } else return callback( 'Ugyldig aktivitetstype, ' + activityType, false );                    
            } else return callback( 'Elementet du vil oppdatere aktiviteten til har ikke en aktivitet', false );
        } else return callback( 'Elementet du vil legge til en aktivitet på eksisterer ikke', false );
    });
}

Activity.delete = function ( activityId, elementId, callback ){
    if ( activityId == null ) return callback( 'Kan ikke slette aktivitet med id null', false );
    else if ( elementId == null ) return callback( 'Kan ikke slette aktivitet når elementId er null', false );

    Activity.loadById( activityId, function ( error, activity ){
        if ( error ) return callback( error, false );

        if ( activity ){
            var ActivityLanguage = models.ActivityLanguage,
                ActivityMath = models.ActivityMath,
                ActivityQuiz = models.ActivityQuiz;

            var subclass,
                activityType = activity.activityType;

            switch ( activityType ){
                case 'LANGUAGE': subclass = ActivityLanguage; break;
                case 'MATH': subclass = ActivityMath; break;
                case 'QUIZ': subclass = ActivityQuiz; break;
            }

            subclass.deleteByActivityId( activity.activityId, function ( error, success ){
                if ( error ) return callback( error, false );

                if ( success ){ 
                    db.query( 'DELETE FROM activity WHERE activity_id = ?', activityId, function ( error, rows, fields ){
                        if ( error ) return callback( error, false );

                        var Element = models.Element;

                        Element.loadById( elementId, function ( error, element ){
                            if ( error ) return calback( error, false );

                            element.removeActivity( callback );
                        });
                    }); 
                } else return callback( 'Kunne ikke slette aktivitet med type ' + activityType, false );
            });
        } else return callback( null, true );
    });
};

module.exports.Activity = Activity;
