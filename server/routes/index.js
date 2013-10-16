var User = require( '../models/entities/user' ).User;
var util = require( 'util' );
var server = require('../../server');

// core routes - base is /
module.exports.index = function( req, res ) {
    res.render('index', {
        user: req.user
    });
};

module.exports.account = function( req, res ) {
    res.render( 'account', {
        user: req.user
    });
};

module.exports.save_account = function( req, res ) {
    var everyone = require('../now').everyone;

    console.log( 'save account', req.user );

    User.loadById(function ( user ){
        if ( user == null ){
            return res.json( '200', {
                error: 'Kunne ikke finne bruker'
            });
        }

        req.checkBody( 'oldpassword', 'oldpassword is required' ).notEmpty();
        req.checkBody( 'newpassword', 'newpassword is required' ).notEmpty();
        req.checkBody( 'newpassword2', 'newpassword2 is required').notEmpty();

        req.sanitize( 'oldpassword' ).xss();
        req.sanitize( 'newpassword' ).xss();
        req.sanitize( 'newpassword2' ).xss();

        var errors = req.validationErrors();

        if ( errors ) {
            return res.render( 'account', {
                error: errors,
                user: req.user
            });
        }

        user.checkPassword (function ( correct ){
            if ( correct ){
                if (req.body.newpassword != req.body.newpassword2) {
                    return res.render( 'account', {
                        error: '\'Gjenta nytt passord\' stemmer ikke med \'Nytt passord\'',
                        user: req.user
                    });
                }
                
                user.setPassword( function ( error, user ){
                    if ( !error && user ){
                        return res.render('account', {
                            message: 'Endringene er lagret',
                            user: req.user
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
                }, req.body.newpassword);
            } else {
                return res.render('account', {
                    error: 'Galt passord',
                    user: req.user
                });
            }
        }, req.body.oldpassword);
    }, req.user.userId);


//    return User.findById(req.user._id, function(err, user){
//        if (err) {
//            return res.json('200', {
//                error: 'Could not find user'
//            });
//        }
//
//        req.assert('username', 'username is required').notEmpty();
//        req.assert('name', 'name is required').notEmpty();
//        req.assert('email', 'valid email required').notEmpty().isEmail();
//
//        req.sanitize('username').xss();
//        req.sanitize('name').xss();
//        req.sanitize('email').xss();
//
//        var errors = req.validationErrors();
//        if (errors) {
//            return res.json('200', {
//                errors: errors
//            });
//        }
//
//        user.username = req.body.username;
//        user.name = req.body.name;
//        user.email = req.body.email;
//        return user.save(function(err){
//            if (err) {
//                return res.json('200', {
//                    error: err.message
//                });
//            }
//            return res.json('200', {
//                message: 'Changes saved'
//            });
//        });
//    });
};

module.exports.login = function( req, res ) {
    res.render( 'login', {
        user: req.user
    });
};

module.exports.logout = function( req, res ) {
    req.logout();
    req.session.destroy();
    res.redirect( '/' );
};

module.exports.google_callback = function( req, res ) {
    var url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect( url );
};

module.exports.local_callback = function( req, res ) {
    var url = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect( url );
};
