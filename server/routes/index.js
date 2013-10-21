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

    User.loadById(function ( error, user ){
        if ( error ) {
            return res.render( 'account', { error: error } );
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

        user.checkPassword (function ( error, correct ){
            if ( error ) return res.render( 'account', { error: error } );

            if ( correct ){
                if (req.body.newpassword != req.body.newpassword2){
                    return res.render( 'account', {
                        error: '\'Gjenta nytt passord\' stemmer ikke med \'Nytt passord\'',
                        user: req.user
                    });
                }
                
                user.setPassword( function ( error, user ){
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
                }, req.body.newpassword );
            } else {
                return res.render('account', {
                    error: 'Passordet er ikke riktig',
                    user: req.user
                });
            }
        }, req.body.oldpassword );
    }, req.user.userId );
};

module.exports.login = function( req, res ) {
    res.render( 'login', {
        user: req.user,
        message: req.flash('error')
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
