var User = require( '../models/entities/user' ).User;
var Game = require( '../models/entities/game').Game;
var util = require( 'util' );
var server = require('../../server');

// core routes - base is /
module.exports.index = function( req, res ){
    res.render('index', {
        user: req.user
    });
};

module.exports.account = function( req, res ){
    res.render( 'account', {
        user: req.user
    });
};

module.exports.save_account = function( req, res ){
    User.loadById( req.user.userId, function ( error, user ){
        if ( error ){
            return res.render( 'account', { error: error } );
        }

        req.checkBody( 'oldpassword', 'oldpassword is required' ).notEmpty();
        req.checkBody( 'newpassword', 'newpassword is required' ).notEmpty();
        req.checkBody( 'newpassword2', 'newpassword2 is required').notEmpty();

        req.sanitize( 'oldpassword' ).xss();
        req.sanitize( 'newpassword' ).xss();
        req.sanitize( 'newpassword2' ).xss();

        var errors = req.validationErrors();

        if ( errors ){
            return res.render( 'account', {
                error: errors,
                user: req.user
            });
        }

        user.checkPassword( req.body.oldpassword, function ( error, correct ){
            if ( error ) return res.render( 'account', { error: error } );

            if ( correct ){
                if (req.body.newpassword != req.body.newpassword2){
                    return res.render( 'account', {
                        error: '\'Gjenta nytt passord\' stemmer ikke med \'Nytt passord\'',
                        user: req.user
                    });
                }
                
                user.setPassword( req.body.newpassword, function ( error, user ){
                    if ( !error && user ){
                        return res.render('account', {
                            message: 'Endringene er lagret',
                            user: user
                        })
                    } else if ( error ){
                        return res.render('account', {
                            error: error,
                            user: req.user
                        });
                    } else {
                        return res.render('account', {
                            error: 'Noe gikk galt... :(',
                            user: req.user
                        });
                    }
                });
            } else {
                return res.render('account', {
                    error: 'Passordet er ikke riktig',
                    user: req.user
                });
            }
        });
    });
};

module.exports.login = function( req, res ){
    if ( req.isAuthenticated() ) res.redirect('/account');

    res.render( 'login', {
        user: req.user,
        error: req.flash('error')
    });
};

module.exports.login_failed = function ( err, user, info ){
    res.render('login', info);
}

module.exports.logout = function( req, res ){
    req.logout();
    req.session.destroy();
    res.redirect( '/' );
};

module.exports.google_callback = function( req, res ){
    var url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect( url );
};

module.exports.local_callback = function( req, res ){
    var url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect( url );
};

module.exports.signup = function ( req, res ){
    if ( req.isAuthenticated() ) res.redirect('/account');

    res.render('signup');
}

module.exports.register_user = function ( req, res ){
    req.checkBody( 'username', 'username is required' ).notEmpty();
    req.checkBody( 'password', 'password is required' ).notEmpty();
    
    req.sanitize( 'username' ).xss();
    req.sanitize( 'password' ).xss();
    
    var errors = req.validationErrors();

    if ( errors ){
        return res.render( 'signup', {
            error: errors,
            user: req.user
        });
    }

    User.create( req.body.username, req.body.password, function ( error, user ){
        if ( error ) return res.render( 'signup', { error: error } );

        if ( !user ) return res.render( 'signup', { error: 'Kunne ikke opprette bruker' } );
        else { 
            var passport = require( 'passport' );
            return passport.authenticate( 'local' )( req, res, function (){
                res.redirect( '/account' );
            });
        }
    });
}

module.exports.mygames = function ( req, res ){
    if ( req.params.id ){
        Game.loadByIdForUser( req.params.id, req.user.userId, function ( error, game ){
            if ( error ){
                return res.render( 'error', { error: error } );
            }

            res.render( 'game', {
                user: req.user,
                game: game
            });
        });
    } else {
        Game.loadAllForUser( req.user.userId, function ( error, games ){
            if ( error ){
                return res.render( 'error', { error: error } );
            }

            res.render( 'games', { 
                user: req.user, 
                games: games
            }); 
        });
    }
}

module.exports.game_post = function ( req, res ){
    console.log('post game');
    console.log('received data', req.body.someData);

    Game.loadByIdForUser( req.params.id, req.user.userId, function ( error, game ){
        if ( error ){
            return res.send( { error: error });
        }

        console.log('loaded game, sending response');

        res.send( { game: game } );
    });
}
