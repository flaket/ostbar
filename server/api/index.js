var util = require( 'util' );
var models = require( '../models' );
var passport = require( 'passport' );
var jsonschema = require( 'jsonschema' );
var DB      = require( '../models/db' );
var db      = DB.instance;

var emptyResponse = function ( res ){
    res.send( 204, ' ' );
}

var requestError = function ( res, error ){
    res.send( 400, { error: error } );
}

var standardGETResponse = function ( req, res, Entity ){
    if ( req.params.id ){
        req.assert( 'id', 'urlparam id (int) is required' ).isInt();
        var errors = req.validationErrors();
        if ( errors ) return requestError( res, errors );
    }

    req.sanitize( 'id' ).toInt();

    if ( req.params.id ){

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();

        var errors = req.validationErrors();

        if ( errors ) return requestError( res, errors );

        Entity.loadById( req.params.id, function ( error, entity ){
            if ( error ) return requestError( res, error );

            if ( entity ) res.send( entity );
            else emptyResponse( res );
        } );
    } else {
        Entity.loadAll( function ( error, entities){
            if ( error ) return requestError( res, error );

            if ( entities) res.send( entities );
            else emptyResponse( res );
        });
    }
}

module.exports = function ( app ){
    var auth = app.ensureAuthenticatedAjax;

    // -- API ROOT ----------------------------------------------------------------------

    app.get( '/api/', auth, function ( req, res ){
        emptyResponse( res );
    });

    // -- WORLD -------------------------------------------------------------------------

    app.get( '/api/world/:id?', auth, function ( req, res  ){
        standardGETResponse( req, res, models.World );
    });

    // -- ACTION TYPE ------------------------------------------------------------------

    app.get( '/api/actiontype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.ActionType );
    });

    // -- GAME --------------------------------------------------------------------------

    app.get( '/api/game/:id?', auth, function ( req, res ){
        var Game = models.Game;

        if ( req.params.id ){
            req.assert( 'id', 'urlparam id (int) is required' ).isInt();
            var errors = req.validationErrors();
            if ( errors ) return requestError( res, errors );
        }
        
        req.sanitize( 'id' ).toInt();

        if ( req.params.id ){
            Game.loadByIdForUser( req.params.id, req.user.userId, function ( error, game ){
                if ( error ) return requestError( res, error );

                if ( game ) res.send( game );
                else emptyResponse( res );
            });
        } else {
            Game.loadAllForUser( req.user.userId, function ( error, games ){
                if ( error ) return requestError( res, error );

                if ( games ) res.send( games );
                else emptyResponse( res );
            });
        }
    });

    // -- SCENETYPE ---------------------------------------------------------------------

    app.get( '/api/scenetype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.SceneType );
    });

    // -- SCENE -------------------------------------------------------------------------

    app.get( '/api/scene/:id?', auth, function ( req, res ){
        if (!req.params.id) return emptyResponse( res );

        standardGETResponse( req, res, models.Scene );
    });

    app.post( '/api/scene', auth, function ( req, res ){
        var Scene = models.Scene;
        var Game = models.Game;

        req.checkBody( 'game_id', 'game_id (int) is required' ).isInt();
        req.checkBody( 'scenetype_id', 'scenetype_id (int) is required' ).isInt();
        
        req.sanitize( 'game_id' ).toInt();
        req.sanitize( 'scenetype_id' ).toInt();
        req.sanitize( 'is_initial_scene').toBoolean();

        var errors = req.validationErrors();

        if ( errors ) return requestError( res, errors );

        var game_id                 = req.body.game_id,
            scenetype_id            = req.body.scenetype_id;

        Scene.create( scenetype_id, game_id, function ( error, scene ){
            if ( error ) requestError( res, error );

            if ( scene ){
                if ( req.body.is_initial_scene ){
                    Game.loadById( game_id, function ( error, game ){
                        if ( error ) return requestError( res, error );

                        if ( game ){
                            game.setInitialSceneId( scene.sceneId, function ( error, success ){
                                if ( error ) return requestError( res, error );

                                if ( success ) return res.send( 201, scene );
                                else return requestError( res, 'Kunne ikke sette initialSceneId på game' + game_id);
                            });
                        } else return requestError( res, 'Kunne ikke sette initialSceneId, fordi det ikke eksisterer' );
                    });
                } else {
                    res.send( scene );
                }
            }
            else emptyResponse( res );
        });
    });

    // -- ELEMENT TYPE ------------------------------------------------------------------

    app.get( '/api/elementtype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.ElementType );
    });

    // -- ELEMENT -----------------------------------------------------------------------

    app.get( '/api/element/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.Element );
    });

    app.post( '/api/element/:id?', auth, function ( req, res ){
        var Element = models.Element,
            Scene = models.Scene;

        req.checkBody( 'element_type_id', 'element_type_id (int) is required' ).isInt();
        req.checkBody( 'frame_x', 'frame_x (float) is required' ).isFloat();
        req.checkBody( 'frame_y', 'frame_y (float) is required' ).isFloat();
        req.checkBody( 'frame_width', 'frame_width (float) is required' ).isFloat();
        req.checkBody( 'frame_height', 'frame_height (float) is required' ).isFloat();
        
        req.sanitize( 'id' ).toInt();
        req.sanitize( 'element_type_id' ).toInt();
        req.sanitize( 'frame_x' ).xss();
        req.sanitize( 'frame_y' ).xss();
        req.sanitize( 'frame_width' ).xss();
        req.sanitize( 'frame_height' ).xss();
        
        if ( !req.params.id ){
            req.checkBody( 'scene_id', 'scene_id (int) is required' ).isInt();
            req.sanitize( 'scene_id').toInt();
        } else {
            req.assert( 'id', 'urlparam id (int) is required' ).isInt();
        }

        var errors = req.validationErrors();

        if ( errors ) return requestError( res, errors );

        var elementTypeId = req.body.element_type_id,
            frame = {
                x: req.body.frame_x,
                y: req.body.frame_y,
                width: req.body.frame_width,
                height: req.body.frame_height
            }

        if ( req.params.id ){
            Element.loadById( req.params.id, function ( error, element ){
                if ( error ) return requestError( res, error );

                if ( element ){
                    element.elementTypeId = elementTypeId;

                    element.frameX = frame.x;
                    element.frameY = frame.y;
                    element.frameWidth = frame.width;
                    element.frameHeight = frame.height;

                    element.update( function ( error, element ){
                        if ( error ) return requestError( res, error );

                        if ( element ) return res.send( element );
                        else return emptyResponse( res );
                    });
                } else return emptyResponse( res );
            });
        } else {
            var sceneId = req.body.scene_id;

            Element.create( elementTypeId, frame, sceneId, function ( error, createdElement ){
                if ( error ) return requestError( res, error );

                if ( createdElement ) return res.send( 201, createdElement );
                else return emptyResponse( res );
            });
        }
    });
    
    app.post( '/api/element/:id/:method', auth, function ( req, res ){
        var Element = models.Element;

        if ( req.params.id && req.params.method == 'actiontype' ){
            req.checkBody( 'actiontype_id', 'actiontype_id (int) is required' ).isInt();

            req.sanitize( 'actiontype_id' ).toInt();

            var errors = req.validationErrors();

            if ( errors ) return requestError( res, errors );

            Element.loadById( req.params.id, function ( error, element ){
                if ( error ) return requestError( res, error );

                if ( element ){
                    var actionTypeId = req.body.actiontype_id;
                    var data = req.body.data || '';
                    element.addActionType( actionTypeId, data, function ( error, element ){
                        if ( error ) return requestError( res, error );

                        if ( element ) return res.send( element );
                        else return emptyResponse( res );
                    });
                } else return emptyResponse( res );
            });
        } else {
            emptyResponse( res );
        }
    });

    app.del( '/api/element/:id', auth, function ( req, res ){
        console.log("del elem");
        var Element = models.Element;

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();
        req.sanitize( 'id' );
        var errors = req.validationErrors();
        if ( errors ) return requestError( res, errors );

        Element.delete( req.params.id, function ( error, success ){
            if ( error ) return requestError( res, error );

            return res.send( { success: success } );
        });
    });

    app.del( '/api/element/:id/:method', auth, function ( req, res ){
        console.log("del elem/type");
        var Element = models.Element;

        if ( req.params.method == 'actiontype' ){
            req.assert( 'id', 'urlparam id (int) is required' ).isInt();
            req.checkBody( 'actiontype_id', 'actiontype_id (int) is required' ).isInt();

            req.sanitize( 'id' );
            req.sanitize( 'actiontype_id' ).toInt();
            var errors = req.validationErrors();
            if ( errors ) return requestError( res, errors );

            Element.loadById( req.params.id, function ( error, element ){
                if ( error ) return requestError( res, error );

                if ( element ){
                    var actionTypeId = req.body.actiontype_id;
                    
                    element.removeActionType( actionTypeId, function ( error, element ){
                        if ( error ) return requestError( res, error );

                        if ( element ) return res.send( element );
                        else return emptyResponse( res );
                    });
                } else return emptyResponse( res );
            });
        } else {
            emptyResponse( res );
        }
    });

    // -- MATHOPERATOR ------------------------------------------------------------------

    app.get( '/api/mathoperator/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.MathOperator );
    });

    // -- ACTIVITY ----------------------------------------------------------------------
    
    app.get( '/api/activity/:id', auth, function ( req, res ){
        var Activity = models.Activity;
        
        if ( req.params.id ){
            req.assert( 'id', 'urlparam id (int) is required' ).isInt();
            var errors = req.validationErrors();
            if ( errors ) return requestError( res, errors );
        }
        req.sanitize( 'id' ).toInt();

        Activity.loadById( req.params.id, function ( error, activity ){
            if ( error ) return requestError( res, error );

            if ( activity ) res.send( activity );
            else emptyResponse( res );
        });
    });
    
    app.post( '/api/activity/:id?', auth, function ( req, res ){
        var Activity            = models.Activity,
            ActivityMath        = models.ActivityMath,
            ActivityLanguage    = models.ActivityLanguage,
            ActivityQuiz        = models.ActivityQuiz;

        req.sanitize( 'id' ).toInt();
        
        if ( req.params.id ) {
            req.assert( 'id', 'urlparam id (int) is required' ).isInt();
        }

        req.checkBody( 'activity_type', 'activity_type (string) is required' ).notEmpty();
        req.checkBody( 'element_id', 'element_id (int) is required' ).isInt();
        
        req.sanitize( 'activity_type' ).xss();
        req.sanitize( 'element_id' ).toInt();

        var errors = req.validationErrors();

        if ( errors ) return requestError( res, errors );

        var activityType = req.body.activity_type,
            elementId = req.body.element_id,
            rewardId = null,
            params = null;

        if ( req.body.rewardId ){
            req.sanitize( 'rewardId' ).toInt();
            rewardId = req.body.rewardId;
        }

        var validator = new jsonschema.Validator(),
            questions = req.body.questions,
            questionsSchema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string',
                            required: true
                        },
                        alternatives: {
                            type: 'array',
                            required: true,
                            items: {
                                type: 'object',
                                required: true,
                                properties: {
                                    alternative: {
                                        type: 'string',
                                        required: true
                                    },
                                    correct: {
                                        booleanString: 'yes',
                                        required: true
                                    }                                        
                                }
                            }
                        }
                    }
                }
            };

        validator.attributes.booleanString = function validateBooleanString ( instance, schema, options, ctx ){
            var result = new jsonschema.ValidatorResult( instance, schema, options, ctx );

            if ( typeof instance == 'string' && instance == 'true' || instance == 'false') return result;
            else if ( typeof instance == 'boolean' ) return result;
            else {
                result.addError( 'is not of a type(s) boolean string' );
                return result;
            }
        };

        switch ( activityType ){
            case 'MATH':
                req.checkBody( 'numbers_range_from', 'numbers_range_from (int) is required' ).isInt();
                req.checkBody( 'numbers_range_to', 'numbers_range_to (int) is required' ).isInt();
                req.checkBody( 'n_operands', 'n_operands (int) is required' ).isInt();
                
                req.sanitize( 'numbers_range_from' ).toInt();
                req.sanitize( 'numbers_range_to' ).toInt();
                req.sanitize( 'n_operands' ).toInt();

                var errors = req.validationErrors();

                if ( errors ) return requestError( res, errors );

                var operators = req.body.operators,
                    operatorsSchema = {
                        type: 'array',
                        items: {
                            type: 'string',
                            intString: 'yes'
                        }
                    };

                if ( operators == null ) return requestError( res, 'operators (array of ints) is required' );

                validator.attributes.intString = function validateIntString( instance, schema, options, ctx ){
                    var result = new jsonschema.ValidatorResult( instance, schema, options, ctx );
                    var intValue = parseInt( instance );

                    if ( typeof instance == 'string' && !isNaN( intValue ) ) return result;
                    else if ( typeof instance == 'number' ) return result;
                    else {
                        result.addError( 'is not of a type(s) int string' );
                        return result;
                    }
                };

                var result = validator.validate( operators, operatorsSchema );

                if ( result.errors.length ) return requestError( res, { msg: result.errors, param: 'operators' } );

                params = {
                    numbersRangeFrom: req.body.numbers_range_from,
                    numbersRangeTo: req.body.numbers_range_to,
                    operandsCount: req.body.n_operands,
                    operators: operators
                }

                break;
            case 'LANGUAGE':
                questionsSchema.items.properties.languageQuestionType = {
                    type: 'string',
                    required: true
                };

                questionsSchema.items.properties.data_id = {
                    type: 'string',
                    required: true
                }
            
            case 'QUIZ':
                var result = validator.validate( questions, questionsSchema );
                
                if ( result.errors.length ) return requestError( res, { msg: result.errors, param: 'questions' } );

                params = {
                    questions: questions
                };

                break;
            default:
                requestError( res, 'Ugyldig aktivitetstype, ' + activityType );
                break;
        }

        if ( req.params.id ){
            Activity.update( req.params.id, activityType, rewardId, elementId, params, function ( error, activity ){
                console.log( 'activity update', error, activity );

                if ( error ) return requestError( res, error );

                if ( activity ) return res.send( activity );
                else return requestError( res, 'Kunne ikke oppdatere aktivitet' );
            });
        } else {
            Activity.create( activityType, rewardId, elementId, params, function ( error, activity ){            
                console.log( 'activity create', error, activity );
                if ( error ) return requestError( res, error );

                if ( activity ) return res.send( 201, activity );
                else return requestError( res, 'Kunne ikke opprette aktivitet' );
            });
        }
    });

    app.del( '/api/activity/:id', auth, function ( req, res ){
        var Activity = models.Activity;

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();    
        req.checkBody( 'element_id', 'element_id (int) is required' ).isInt();

        req.sanitize( 'id' );
        req.sanitize( 'element_id' ).toInt();

        var errors = req.validationErrors();

        if ( errors ) return requestError( res, errors );

        Activity.delete( req.params.id, req.body.element_id, function( error, success ){
            if ( error ) return requestError( res, error );

            return res.send( { success: success } );
        });
    });

    // -- ACTIVITYQUIZ ------------------------------------------------------------------

    app.get( '/api/activityquiz/:id', auth, function ( req, res ){
        var ActivityQuiz = models.ActivityQuiz;

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();

        req.sanitize( 'id' ).toInt();

        ActivityQuiz.loadById( req.params.id, function ( error, activityQuiz ){
            if ( error ) return requestError( res, error );

            if ( activityQuiz ) res.send( activityQuiz );
            else emptyResponse( res );
        });
    });

    // -- ACTIVITYLANGUAGE --------------------------------------------------------------

    app.get( '/api/activitylanguage/:id', auth, function ( req, res ){
        var ActivityLanguage = models.ActivityLanguage;

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();
        
        req.sanitize( 'id' ).toInt();

        ActivityLanguage.loadById( req.params.id, function ( error, activityLanguage ){
            if ( error ) return requestError( res, error );

            if ( activityLanguage ) res.send( activityLanguage );
            else emptyResponse( res );
        })
    });

    // -- ACTIVITYMATH ------------------------------------------------------------------

    app.get( '/api/activitymath/:id', auth, function ( req, res ){
        var ActivityMath = models.ActivityMath;

        req.assert( 'id', 'urlparam id (int) is required' ).isInt();

        req.sanitize( 'id' ).toInt();

        ActivityMath.loadById( req.params.id, function ( error, activityMath ){
            if ( error ) return requestError( res, error );

            if ( activityMath ) res.send( activityMath );
            else emptyResponse( res );
        });
    });
};
