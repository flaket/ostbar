// -- development config
module.exports = function(app, express){
    var RedisStore = require('connect-redis')(express);

    app.use(express.logger('dev'));

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    app.use(express.cookieParser());

    app.use(express.session({
        store: new RedisStore({
            host: app.conf.redis.host,
            port: app.conf.redis.port
        }),
        secret: app.conf.sessionSecret
    }));
};
