var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );

function ActionType( data ){
    Entity.call( this );

    this.actionTypeId = data.action_type_id;
    this.name = data.type;
    if ( 'data' in data ){
        this.data = data.data;
    }
}

ActionType.prototype = new Entity();

ActionType.prototype.constructor = ActionType;

ActionType.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    db.query( 'SELECT * FROM action_type WHERE action_type_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) ActionType.initWithData( rows[0], callback );
        else callback( 'No objects', false );
    });
}

ActionType.loadAllInElement = function ( elementId, callback ){
    if ( elementId == null ) return callback( null, false );

    var query = 'SELECT * '
        query += 'FROM element_to_action_type_rel e_to_at_rel LEFT JOIN action_type at ';
        query += 'ON e_to_at_rel.action_type_id = at.action_type_id AND e_to_at_rel.element_id = ? ';
        query += 'WHERE at.action_type_id IS NOT NULL';

    db.query( query, elementId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, ActionType.initWithData, callback);
    });
}

ActionType.loadAllInElementType = function ( elementTypeId, callback ){
    if ( elementTypeId == null ) return callback( null, false );

    var query = 'SELECT * ';
        query += 'FROM element_type_to_action_type_rel et_to_at_rel LEFT JOIN action_type at ';
        query += 'ON et_to_at_rel.action_type_id = at.action_type_id AND et_to_at_rel.element_type_id = ? ';
        query += 'WHERE at.action_type_id IS NOT NULL';

    db.query( query, elementTypeId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map( rows, ActionType.initWithData, callback);
    });
}

ActionType.initWithData = function ( data, callback ){
    if ( data == null ) callback( null, false );

    if ( 'data' in data ){
        var buffer = new Buffer( data.data, 'binary' );
        data.data = buffer.toString();
    }

    var actionType = new ActionType( data );

    callback( null, actionType );
}

module.exports.ActionType = ActionType;
