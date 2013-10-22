var User = require( '../models/' ).User,
    passport = require( 'passport' ),
    LocalStrategy = require( 'passport-local' ).Strategy;

module.exports = function( app ){
    passport.serializeUser( function ( user, done ){
        done( null, user.userId );
    });

    passport.deserializeUser( function ( id, done ){
        User.loadById( id, function ( error, user ){
            if ( error ) return done( error, false );

            if ( user ) done( null, user );
            else done( null, false );
        });
    });
    
    passport.use( new LocalStrategy( 
        function ( username, password, done ){
            process.nextTick( function (){
                User.loadByUsername( username, function ( error, user ){
                    if ( error ) return done( error );
                    
                    if ( user ){
                        user.checkPassword( password, function ( error, correct ){
                            if ( error ) return done( error );

                            if (!correct) return done( null, false, { message: 'Passordet er ikke riktig' } );
                            else return done( null, user );
                        });
                    } else {
                        done( null, false, { message: 'Brukernavnet finnes ikke' });
                    }
                });
            });
        }
    ));

    return passport;
};
