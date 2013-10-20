var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function SubjectType( data ){
    Entity.call( this );

    this.subjectTypeId = data.subject_type_id;
    this.subject = data.subject;
}

SubjectType.prototype = new Entity();

SubjectType.prototype.constructor = SubjectType;

SubjectType.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM subject_type WHERE subject_type_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length === 1 ) callback( null, new SubjectType( rows[0] ) );
        else callback( 'Could not load SubjectType with id ' + id, false );
    });
};

module.exports.SubjectType = SubjectType;
