// express middleware

var User = require('../models').User;
var util = require('util');

module.exports = {
    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    ensureAuthenticated: function( req, res, next ){
        req.session.returnTo = req.url;

        if (req.isAuthenticated()) next();
        else {
            req.flash('info', 'Du må være logget inn for å gjøre dette');
            res.redirect('/login');
        }
    }
};