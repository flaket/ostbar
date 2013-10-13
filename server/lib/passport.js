var User = require('../models/').User,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(app)
{
    passport.serializeUser(function (user, done)
    {
        done(null, user.userId);
    });

    passport.deserializeUser(function (id, done)
    {
        User.loadById(function (user)
        {
            if (user) done(null, user);
            else done(null, false);
        }, id);
    });
    
    passport.use(new LocalStrategy(
        function (username, password, done)
        {
            process.nextTick(function ()
            {
                User.usernameExists(function (exists)
                {
                    if (exists)
                    {
                        User.loginWithUsernameAndPassword(function (user)
                        {
                            if (user) done(null, user);
                            else done(null, false, { message: 'Incorrect password.'});
                        }, username, password);
                    }
                    else
                    {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                }, username);
            });
        }
    ));

    return passport;
};
