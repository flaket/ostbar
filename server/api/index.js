var util = require( 'util' );
var models = require( '../models' );
var passport = require( 'passport' );

var emptyResponse = function ( res ){
    res.send( 204, ' ' );
}

var requestError = function ( res, error ){
    res.send( 400, { error: error } );
}

var standardGETResponse = function ( req, res, Entity ){
    req.sanitize( 'id' ).toInt();

    if ( req.params.id ){
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

    app.get( '/api/', auth, function ( req, res ){
        emptyResponse( res );
    });

    app.get( '/api/world/:id?', auth, function ( req, res  ){
        standardGETResponse( req, res, models.World );
    });

    app.get( '/api/element/:id?', function ( req, res ){
        standardGETResponse( req, res, models.Element );
    });

    app.get( '/api/elementtype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.ElementType );
    });

    app.get( '/api/game/:id?', auth, function ( req, res ){
        var Game = models.Game;

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

    app.get( '/api/scene/:id?', auth, function ( req, res ){
        if (!req.params.id) return emptyResponse( res );

        standardGETResponse( req, res, models.Scene );
    });

    app.get( '/api/scenetype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.SceneType );
    });

    app.post( '/api/scene/:id?', auth, function ( req, res ){
        var Scene = models.Scene;
        var Game = models.Game;

        if ( req.params.id ) return res.send( { error: 'not implemented' } );

        req.checkBody( 'game_id', 'game_id (int) is required' ).isInt();
        req.checkBody( 'scenetype_id', 'scenetype_id (int) is required' ).isInt();
        
        req.sanitize( 'game_id' ).toInt();
        req.sanitize( 'scenetype_id' ).toInt();
        req.sanitize( 'is_initial_scene').toBoolean();

        var errors = req.validationErrors();

        if ( errors ) return res.send( { error: errors } );

        var game_id                 = req.body.game_id,
            scenetype_id            = req.body.scenetype_id;

        Scene.create( scenetype_id, game_id, function ( error, scene ){
            if ( error ) res.send( { error: error } );

            if ( scene ){
                if ( req.body.is_initial_scene ){
                    Game.loadById( game_id, function ( error, game ){
                        if ( error ) return res.send( { error: error } );

                        if ( game ){
                            game.setInitialSceneId( scene.sceneId, function ( error, success ){
                                if ( error ) return res.send( { error: error } );

                                if ( success ) return res.send( scene );
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

    app.post( '/api/element/:id?/:method?', auth, function ( req, res ){
        var Element = models.Element,
            Scene = models.Scene;

        req.sanitize( 'id' ).toInt();

        if ( req.params.id && req.params.method == 'actiontype' ){
            req.checkBody( 'actiontype_id', 'actiontype_id (int) is required' ).isInt();

            req.sanitize( 'actiontype_id' ).toInt();

            var errors = req.validationErrors();

            if ( errors ) return res.send( { error: errors } );

            Element.loadById( req.params.id, function ( error, element ){
                if ( error ) return requestError( res, error );

                if ( element ){
                    var actionTypeId = req.body.actiontype_id;
                    var data = req.body.data || '';
                    element.addActionType( actionTypeId, data, function ( error, element ){
                        console.log( 'added action type', error, element );
                        if ( error ) return requestError( res, error );

                        if ( element ) return res.send( { element: element } );
                        else return emptyResponse( res );
                    });
                } else return emptyResponse( res );
            });

        } else {
            req.checkBody( 'element_type_id', 'element_type_id (int) is required' ).isInt();
            req.checkBody( 'frame_x', 'frame_x (float) is required' ).isFloat();
            req.checkBody( 'frame_y', 'frame_y (float) is required' ).isFloat();
            req.checkBody( 'frame_width', 'frame_width (float) is required' ).isFloat();
            req.checkBody( 'frame_height', 'frame_height (float) is required' ).isFloat();
            
            req.sanitize( 'element_type_id' ).toInt();
            req.sanitize( 'frame_x' ).xss();
            req.sanitize( 'frame_y' ).xss();
            req.sanitize( 'frame_width' ).xss();
            req.sanitize( 'frame_height' ).xss();
            
            if ( !req.params.id ){
                req.checkBody( 'scene_id', 'scene_id (int) is required' ).isInt();
                req.sanitize( 'scene_id').toInt();
            }

            var errors = req.validationErrors();

            if ( errors ) return res.send( { error: errors } );

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
        }
    });

    app.get( '/api/activitylanguage/:id', auth, function ( req, res ){
        var ActivityLanguage = models.ActivityLanguage;

        req.sanitize( 'id' ).toInt();

        ActivityLanguage.loadById( req.params.id, function ( error, activityLanguage ){
            if ( error ) return requestError( res, error );

            if ( activityLanguage ) res.send( activityLanguage );
            else emptyResponse( res );
        })
    });

    app.get( '/api/activitymath/:id', auth, function ( req, res ){
        var ActivityMath = models.ActivityMath;

        req.sanitize( 'id' ).toInt();

        ActivityMath.loadById( req.params.id, function ( error, activityMath ){
            if ( error ) return requestError( res, error );

            if ( activityMath ) res.send( activityMath );
            else emptyResponse( res );
        });
    });

    app.post( '/api/activitymath/:id?', auth, function ( req, res ){
        var ActivityMath = models.ActivityMath;

        req.sanitize( 'id' ).toInt();

        if ( req.params.id ){

        } else {

            req.checkBody('numbers_range_from', 'numbers_range_from (int) is required').isInt();
            req.checkBody('numbers_range_to', 'numbers_range_to (int) is required').isInt();
            req.checkBody('n_operands', 'n_operands (int) is required').isInt();

            req.sanitize('numbers_range_from').toInt();
            req.sanitize('numbers_range_to').toInt();
            req.sanitize('n_operands').toInt();

            var errors = req.validationErrors();

            if ( errors ) return res.send( {error: errors } );

            // ActivityMath.create()
        }
    });

    app.get( '/api/activityquiz/:id', auth, function ( req, res ){
        var ActivityQuiz = models.ActivityQuiz;

        req.sanitize( 'id' ).toInt();

        ActivityQuiz.loadById( req.params.id, function ( error, activityQuiz ){
            if ( error ) return requestError( res, error );

            if ( activityQuiz ) res.send( activityQuiz );
            else emptyResponse( res );
        });
    });

    app.get( '/api/activity/:id', auth, function ( req, res ){
        var Activity = models.Activity;

        req.sanitize( 'id' ).toInt();

        Activity.loadById( req.params.id, function ( error, activity ){
            if ( error ) return requestError( res, error );

            if ( activity ) res.send( activity );
            else emptyResponse( res );
        });
    });
};
