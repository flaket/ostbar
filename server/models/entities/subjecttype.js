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
        if ( error ) throw error;

        if ( rows.length === 1 ) callback( new SubjectType( rows[0] ) );
        else callback( null );
    });
};

module.exports.SubjectType = SubjectType;
