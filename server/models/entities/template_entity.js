var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function TemplateEntity( data ){
    Entity.call( this );
}

TemplateEntity.prototype = new Entity();

TemplateEntity.prototype.constructor = TemplateEntity;

TemplateEntity.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM ... WHERE ... = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length === 1 ) callback( null, new TemplateEntity( rows[0] ) );
        else callback( 'Could not load TemplateEntity with id ' + id, false );
    });
};

module.exports.TemplateEntity = TemplateEntity;
