// -- module dependencies
var express     = require('express');
var passport  	= require('passport');

// -- create app
var app         = express(),
    env         = app.settings.env,

// -- import configuration
    conf        = require('./settings/config'),
    settings    = conf.settings;
// conf(app, express, env);

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/', function (req, res) {
	res.send('hehehe');
});

app.get('/login', function (req, res) {
	res.render('<html>tekst tekst tekst</html>');
});

// -- bootstrap config
// require('./bootstrap').boot(app);

// -- routes
// var core_routes = require('./routes/index');
// app.get('/', core_routes.index);
// app.get('/account', app.ensureAuthenticated, core_routes.account);
// app.post('/account', app.ensureAuthenticated, core_routes.save_account);
// app.get('/login', core_routes.login);
// app.get('/logout', core_routes.logout);
// app.get('/auth/google', app.passport.authenticate('google', { scope: [
//             'https://www.googleapis.com/auth/userinfo.profile',
//             'https://www.googleapis.com/auth/userinfo.email'
//         ]}), function(req, res){});
// app.get('/auth/google/callback', app.passport.authenticate('google', { failureRedirect: '/login' }), core_routes.google_callback);

// -- exports
module.exports = app;
module.exports.conf = settings;