var User = require( '../models/' ).User,
    passport = require( 'passport' ),
    LocalStrategy = require( 'passport-local' ).Strategy;

module.exports = function( app ){
    passport.serializeUser( function ( user, done ){
        done( null, user.userId );
    });

    passport.deserializeUser( function ( id, done ){
        User.loadById( function ( error, user ){
            if ( error ) return done( error, false );

            if ( user ) done( null, user );
            else done( null, false );
        }, id );
    });
    
    passport.use( new LocalStrategy( 
        function ( username, password, done ){
            process.nextTick( function (  ){
                User.usernameExists( function ( error, exists ){
                    if ( error ) return done( error, false );

                    if ( exists ){
                        User.loginWithUsernameAndPassword( function ( error, user ){
                            if ( error ) return done( error, false );

                            if ( user ) done( null, user );
                            else done( null, false, { message: 'Passordet er ikke riktig'});
                        }, username, password );
                    } else {
                        return done( null, false, { message: 'Brukernavnet finnes ikke' });
                    }
                }, username );
            });
        }
    ));

    return passport;
};
