var util = require( 'util' );
var server = require('../../server');

var models = require( '../models' );

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
    var User = models.User;

    User.loadById( req.user.userId, function ( error, user ){
        if ( error ){
            return res.render( 'account', { error: error } );
        }

        error = null;

        if ( !req.body.oldpassword ){
            error = 'Du må skrive inn gammelt passord';
        } else if ( req.body.oldpassword.length < 6 ){
            error = 'Gammelt passord består av 6 eller flere tegn';
        } else if ( !req.body.newpassword || !req.body.newpassword2 ){  
            error = 'Nytt passord må skrives inn to ganger';
        } else if ( req.body.newpassword != req.body.newpassword2 ){
            error = 'Nytt passord må skrives likt begge gangene';
        } else if ( req.body.newpassword.length < 6 || req.body.newpassword2.length < 6 ){
            error = 'Nytt passord må bestå av 6 eller flere tegn';
        }

        if ( error ){
            return res.render( 'account', {
                error: error,
                user: req.user
            });
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

    var User = models.User;

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
    var Game = models.Game;

    if ( req.params.id ){
        Game.loadByIdForUser( req.params.id, req.user.userId, function ( error, game ){
            if ( error ){
                return res.render( 'error', { error: error } );
            }

            res.render( 'game', {
                user: req.user,
                game: game,
                admin: 'true'
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
    var Game = models.Game;

    Game.loadByIdForUser( req.params.id, req.user.userId, function ( error, game ){
        if ( error ){
            return res.send( { error: error });
        }

        req.checkBody('name', 'name (string) is required').notEmpty();

        game.setName( req.body.name, function ( error, success ){
            res.redirect( '/game' );
        });
    });
};

module.exports.game_delete = function ( req, res ){
    req.assert( 'id', 'urlparam id (int) is required' ).isInt();
    req.sanitize( 'id' ).toInt();
    var errors = req.validationErrors();
    if ( errors ) return res.send( { error: errors } );

    var Game = models.Game;

    Game.delete( req.params.id, function( error, success ){
        res.redirect( '/game' );        
    });
};

module.exports.game = function ( req, res ){
    req.checkBody('name', 'name (string) is required').notEmpty();
    req.sanitize('name').xss();

    var errors = req.validationErrors();

    var Game = models.Game;

    if ( errors ) {
        Game.loadAllForUser( req.user.userId, function ( error, games ){
            return res.render('/game', {
                user: req.user,
                games: games,
                error: errors
            });
        });
    }
    

    Game.create( req.user.userId, req.body.name, function ( error, game ){
        if ( error ) {
            return res.render( 'games', {
                error: error,
                game: null
            });
        }

        res.redirect( '/game/' + game.gameId );
    });
};

module.exports.playgame = function ( req, res ){
    req.assert( 'id', 'urlparam id (int) is required' ).isInt();
    req.sanitize( 'id' ).toInt();
    var errors = req.validationErrors();
    if ( errors ) return res.send( { error: errors } );

    var Game = models.Game;

    Game.loadById( req.params.id, function ( error, game ){
        if ( error ) return res.render( '404', { error: 'Spillet finnes ikke' } );

        res.render( 'game', {
            user: req.user,
            game: game,
        });
    });
};
