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

    app.get( '/api/elementtype/:id?', auth, function ( req, res ){
        standardGETResponse( req, res, models.ElementType );
    });

    app.get( '/api/game/:id?', auth, function ( req, res ){
        var Game = models.Game;

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

    app.get( '/api/activitylanguage/:id', auth, function ( req, res ){
        var ActivityLanguage = models.ActivityLanguage;

        ActivityLanguage.loadById( req.params.id, function ( error, activityLanguage ){
            if ( error ) return requestError( res, error );

            if ( activityLanguage ) res.send( activityLanguage );
            else emptyResponse( res );
        })
    });

    app.get( '/api/activitymath/:id', auth, function ( req, res ){
        var ActivityMath = models.ActivityMath;

        ActivityMath.loadById( req.params.id, function ( error, activityMath ){
            if ( error ) return requestError( res, error );

            if ( activityMath ) res.send( activityMath );
            else emptyResponse( res );
        });
    });

    app.get( '/api/activityquiz/:id', auth, function ( req, res ){
        var ActivityQuiz = models.ActivityQuiz;

        ActivityQuiz.loadById( req.params.id, function ( error, activityQuiz ){
            if ( error ) return requestError( res, error );

            if ( activityQuiz ) res.send( activityQuiz );
            else emptyResponse( res );
        });
    });

    app.get( '/api/activity/:id', auth, function ( req, res ){
        var Activity = models.Activity;

        Activity.loadById( req.params.id, function ( error, activity ){
            if ( error ) return requestError( res, error );

            if ( activity ) res.send( activity );
            else emptyResponse( res );
        });
    });

    app.get( '/api/scene/:id?', auth, function ( req, res ){
        if (!req.params.id) return emptyResponse( res );

        standardGETResponse( req, res, models.Scene );
    });

    app.post( '/api/scene/:id?', auth, function ( req, res ){
        var Scene = models.Scene;

        if ( req.params.id ) return res.send( { error: 'not implemented' } );

        req.assert( 'game_id', 'game_id (int) is required' ).isInt();
        req.assert( 'world_id', 'world_id (int) is required' ).isInt();
        req.assert( 'background_avatar_id', 'background_avatar_id (int) is required' ).isInt();

        req.sanitize( 'game_id' ).toInt();
        req.sanitize( 'world_id' ).toInt();
        req.sanitize( 'background_avatar_id' ).toInt();

        var errors = req.validationErrors();

        if ( errors ) return res.send( { error: errors } );

        var game_id                 = req.query.game_id,
            world_id                = req.query.world_id,
            background_avatar_id    = req.query.background_avatar_id;

        Scene.create( game_id, world_id, background_avatar_id, function ( error, scene ){
            if ( error ) res.send( { error: error } );

            if ( scene ) res.send( { scene: scene } );
            else emptyResponse( res );
        });
    });

    app.post( '/api/element/:id?', auth, function ( req, res ){
        var Element = models.Element,
            Scene = models.Scene;

        req.assert( 'element_type_id', 'element_type_id (int) is required' ).isInt();
        req.assert( 'frame_x', 'frame_x (float) is required' ).isFloat();
        req.assert( 'frame_y', 'frame_y (float) is required' ).isFloat();
        req.assert( 'frame_width', 'frame_width (float) is required' ).isFloat();
        req.assert( 'frame_height', 'frame_height (float) is required' ).isFloat();
        
        req.sanitize( 'element_type_id' ).toInt();
        req.sanitize( 'frame_x' ).xss();
        req.sanitize( 'frame_y' ).xss();
        req.sanitize( 'frame_width' ).xss();
        req.sanitize( 'frame_height' ).xss();
        
        if ( !req.params.id ){
            req.assert( 'scene_id', 'scene_id (int) is required' ).isInt();
            req.sanitize( 'scene_id').toInt();
        }

        var errors = req.validationErrors();

        if ( errors ) return res.send( { error: errors } );

        var elementTypeId = req.query.element_type_id,
            frame = {
                x: req.query.frame_x,
                y: req.query.frame_y,
                width: req.query.frame_width,
                height: req.query.frame_height
            }

        if ( req.params.id ){
            Element.loadById( req.params.id, function ( error, element ){
                if ( error ) requestError( res, error );

                if ( element ){
                    element.elementTypeId = elementTypeId;

                    element.frameX = frame.x;
                    element.frameY = frame.y;
                    element.frameWidth = frame.width;
                    element.frameHeight = frame.height;

                    element.update( function ( error, element ){
                        if ( error ) requestError( res, error );

                        if ( element ) res.send( element );
                        else emptyResponse( res );
                    });
                }
            });
        } else {
            var sceneId = req.query.scene_id;

            Element.create( elementTypeId, frame, sceneId, function ( error, createdElement ){
                if ( error ) return requestError( res, error );

                if ( createdElement ) res.send( 201, createdElement );
                else emptyResponse( res );
            });
        }
    });
};
