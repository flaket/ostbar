var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function User( data )
{
    Entity.call( this );

    this.userId   = data.user_id;
    this.username = data.username;
    this.created  = data.created;
    this.deleted  = data.deleted;

}

User.prototype = new Entity();

User.prototype.constructor = User;

User.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM user WHERE user_id = ?', id, function ( error, rows, fields ){
        if ( error ) throw error;

        if ( rows.length === 1 ){
            callback( new User( rows[0] ) );
        }
        else {
            callback( null );
        }
    });
};

User.usernameExists = function ( callback, username ){
    db.query( 'SELECT username FROM user WHERE username = ?', username, function ( error, rows, fields ){   
        if ( error ) throw error;

        if ( rows.length === 1 ) callback( true );
        else callback( false );
    });
};

User.loginWithUsernameAndPassword = function ( callback, username, password ){
    db.query( 'SELECT * FROM user WHERE username = ? AND password = MD5(?)', [username, password], function ( error, rows, fields ){
        if ( error ) throw error;

        if ( rows.length === 1 ){
            callback( new User( rows[0] ) );
        } else {
            callback( null );
        }
    });
};

User.create = function ( callback, username, password ){
    if ( username.length < 6 ){
        callback( 'Username must be 6 or more characters', false );
    } else if ( password.length < 6 ){
        callback( 'Password must be 6 or more characters', false );
    } else {
        db.query( 'INSERT INTO user VALUES (NULL, ?, MD5(?), NOW(), NULL)', [ username, password ], function ( error, rows, fields){
            if ( error ){
                if ( error.code == 'ER_DUP_ENTRY' ){
                    callback( 'Username is already taken', false );
                } else {
                    throw error;
                }
            } else {
                User.loadById( function ( user ){
                    callback(null, user);
                }, rows.insertId );
            }
        });
    }
};

User.prototype.setPassword = function ( callback, password ){
    if ( password.length < 6 ){
        callback( 'Passordet må være minst 6 tegn', false);
    }

    db.query('UPDATE user SET password = MD5(?) WHERE user_id = ?', [ password, this.userId ], function ( error, rows, fields ){
        if ( error ) throw error;

        if ( rows.affectedRows == 1 ){
            callback( null, this );
        } else {
            callback( null );
        }
    });
}

User.prototype.checkPassword = function ( callback, password ){
    console.log('checking password', password, 'for user id', this.userId);

    db.query('SELECT * FROM user WHERE user_id = ? AND password = MD5(?)', [ this.userId, password ], function (error, rows, fields ){
        if ( error ) throw error;

        if (rows.length == 1) callback(true);
        else callback(false);
    });
}

module.exports.User = User;
