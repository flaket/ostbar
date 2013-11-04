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

User.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM user WHERE user_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback ( error, false );

        if ( rows.length === 1 ) callback( null, new User( rows[0] ) );
        else callback( 'Could not load user with id ' + id, false );
    });
};

User.loadByUsername = function ( username, callback ){
    if ( username == null ) return callback( null, false );

    db.query( 'SELECT * FROM user WHERE username = ?', username, function ( error, rows, fields ){   
        if ( error ) return callback( error, false );

        if ( rows.length === 1 ) callback( null, new User( rows[0] ) );
        else callback( null, false );
    });
};

User.loginWithUsernameAndPassword = function ( username, password, callback ){
    if (username == null) return callback( 'username cannot be null', false );
    if (password == null) return callback( 'password cannot be null', false );

    db.query( 'SELECT * FROM user WHERE username = ? AND password = MD5(?)', [username, password], function ( error, rows, fields ){
        if ( error ) throw error;
        if ( error ) return callback( error, false );

        if ( rows.length === 1 ) callback( null, new User( rows[0] ) );
        else callback( null, false );
    });
};

User.create = function ( username, password, callback ){
    if (username == null) return callback( 'username cannot be null', false );
    else if (password == null) return callback( 'password cannot be null', false );
    else if ( username.length < 6 ) return callback( 'Username must be 6 or more characters', false );
    else if ( password.length < 6 ) return callback( 'Password must be 6 or more characters', false );

    db.query( 'INSERT INTO user VALUES (NULL, ?, MD5(?), NOW(), NULL)', [ username, password ], function ( error, rows, fields){
        if ( error ){
            if ( error.code == 'ER_DUP_ENTRY' ) return callback( 'Brukernavnet er allerede i bruk', false );
            else return callback( error, false );
        }

        User.loadById( rows.insertId, callback );
    });
};

User.prototype.setPassword = function ( password, callback ){
    if ( password == null ) return callback( null, false );
    if ( password.length < 6 ) return callback( 'Passordet må være minst 6 tegn', false);

    db.query('UPDATE user SET password = MD5(?) WHERE user_id = ?', [ password, this.userId ], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.affectedRows == 1 ) callback( null, this );
        else callback( 'Kunne ikke oppdatere passord', null );
    });
}

User.prototype.checkPassword = function ( password, callback ){
    if ( password == null ) return callback( null, false );

    db.query('SELECT * FROM user WHERE user_id = ? AND password = MD5(?)', [ this.userId, password ], function (error, rows, fields ){
        if ( error ) return callback( error, false );

        if (rows.length == 1) callback( null, true );
        else callback( null, false );
    });
}

module.exports.User = User;
