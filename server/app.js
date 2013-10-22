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

// -- api
require('./api')(app);

// -- routes
var core_routes = require('./routes/index');
app.get('/', core_routes.index);

app.get('/account', app.ensureAuthenticated, core_routes.account);
app.post('/account', app.ensureAuthenticated, core_routes.save_account);

app.get('/login', core_routes.login);
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true } ), core_routes.local_callback);

app.get('/logout', core_routes.logout);

app.get('/signup', core_routes.signup);
app.post('/signup', core_routes.register_user);

app.get( '/game', core_routes.mygames );

// -- exports
module.exports = app;
module.exports.conf = settings;