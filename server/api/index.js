var util = require( 'util' );
var models = require( '../models' );
var passport = require( 'passport' );

module.exports = function ( app ){
    app.get( '/api', app.ensureAuthenticated, function ( req, res ){
        res.send('');
    });

	app.get( '/api/world/:id?', app.ensureAuthenticated, function ( req, res  ){
		var World = models.World;
		
		if ( req.params.id ){
			World.loadById( function ( error, world ){
				if ( world ) res.send( world );
				else res.send( '' );
			}, req.params.id );
		}

		World.loadAll( function ( error, worlds ){
			if ( worlds ) res.send( worlds );
			else res.send( '' );
		});
    });

    app.get( '/api/game/:id?', app.ensureAuthenticated, function ( req, res ){
    	var Game = models.Game;

    	if ( req.params.id ){
    		Game.loadByIdForUser( function ( error, game ){
    			if ( game ) res.send( game );
    			else res.send( '' );
    		}, req.params.id, req.user.userId )
    	} else {
    		Game.loadAllForUser( function ( error, games ){
    			if ( games ) res.send( games );
    			else res.send( '' );
    		}, req.user.userId );
    	}
    });

    app.get( '/api/elementtype/:id?', app.ensureAuthenticated, function ( req, res ){
        var ElementType = models.ElementType;

        if ( req.params.id ){
            ElementType.loadById( function ( error, elementType ){
                if ( elementType ) res.send( elementType );
                else res.send( '' );
            });
        } else {
            ElementType.loadAll( function ( error, elementTypes ){
                if ( elementTypes ) res.send( elementTypes );
                else res.send( '' );
            });
        }
    });

    console.log('element resource should have ensureAuthenticated');

    app.post( '/api/element/', function ( req, res ){
        var Element = models.Element;

        var elementTypeId = 1;
        var frame = {
            x: 10,
            y: 15,
            width: 20,
            height: 25
        }

        Element.create( function ( error, createdElement ){
            if ( createdElement ) res.send( createdElement );
            else res.send( '' );
        }, elementTypeId, frame);
    });
};