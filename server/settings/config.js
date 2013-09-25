var localsettings = require('../settings.js');

// -- global settings
var settings = {
    siteName        : 'TEGF',
    sessionSecret   : localsettings.sessionSecret,
    uri             : 'http://localhost',
    port            : process.env.PORT || 8888,
    db_name         : process.env.DB_NAME || 'test',
    debug           : 0,
    profile         : 0,
    auth            : localsettings.auth,
    redis           : {
        host        : '127.0.0.1',
        port        : 8888
    }
};

module.exports = function(app, express, env){
    app.conf = settings;

    if (env === 'development') {
        require('./development')(app, express);
    }
    else if (env === 'production') {
        require('./production')(app, express);
    }
    else if (env === 'test') {
        require('./test')(app, express);
    }
};

module.exports.settings = settings;

// secret key gen: cat /dev/urandom| base64 | fold -w 64
