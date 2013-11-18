// -- module dependencies
var express     = require('express');
var passport  	= require('passport');

// -- create app
var app         = express(),
    env         = app.settings.env,

// -- import configuration
    conf        = require('./settings/config'),
    settings    = conf.settings;

conf(app, express, env);

// -- bootstrap config
require('./bootstrap').boot(app);

// -- models

require('./models');

// -- api
require('./api')(app);

// -- routes
var core_routes = require('./routes/index');
app.get('/', core_routes.index);

app.get('/account', app.ensureAuthenticated, core_routes.account);
app.post('/account', app.ensureAuthenticated, core_routes.save_account);

app.get('/login', core_routes.login);
app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true } ), core_routes.local_callback);

app.get('/logout', core_routes.logout);

app.get('/signup', core_routes.signup);
app.post('/signup', core_routes.register_user);

app.get( '/game/:id?', app.ensureAuthenticated, core_routes.mygames );
app.post( '/game', app.ensureAuthenticated, core_routes.game );
app.post( '/deletegame/:id', core_routes.game_delete );

app.get( '/play/:id', core_routes.playgame );

// -- ajax requests
app.post( '/game/:id', app.ensureAuthenticatedAjax, core_routes.game_post );

// -- exports
module.exports = app;
module.exports.conf = settings;