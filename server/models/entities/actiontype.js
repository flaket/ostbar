var Entity 	= require( '../entity' ).Entity;
var DB 		= require( '../db' );
var db 		= DB.instance;
var async 	= require( 'async' );

function ActionType( data ){
	Entity.call( this );

	this.actionTypeId = data.action_type_id;
	this.name = data.type;
}

ActionType.prototype = new Entity();

ActionType.prototype.constructor = ActionType;

ActionType.loadById = function ( callback, id ){
	db.query( 'SELECT * FROM action_type WHERE action_type_id = ?', id, function ( error, rows, fields ){
		if ( error ) throw error;

		if ( rows.length == 1 ) ActionType.initWithData( callback, rows[0] );
		else callback( null );
	});
}

ActionType.loadAllInElement = function ( callback, elementId ){
	var query = 'SELECT * '
		query += 'FROM element_to_action_type_rel e_to_at_rel LEFT JOIN action_type at ';
		query += 'ON e_to_at_rel.action_type_id = at.action_type_id AND e_to_at_rel.element_id = ? ';
		query += 'WHERE at.action_type_id IS NOT NULL';

	db.query( query, elementId, function ( error, rows, fields ){
		if ( error ) throw error;

		var actionTypes = new Array();
		var currentActionType = 0;

		async.whilst( 
			function (){
				return actionTypes.length < rows.length;
			},
			function ( callback ){
				ActionType.initWithData( function ( actionType ){
					var buffer = new Buffer( rows[currentActionType].data, 'binary' );

					actionTypes.push({
						actionType: actionType,
						data: buffer.toString()
					});

					currentActionType++;
					callback();
				}, rows[currentActionType])
			},
			function ( error ) { callback( actionTypes ); }
		);
	});
}

ActionType.loadAllInElementType = function ( callback, elementTypeId ){
	var query = 'SELECT * ';
		query += 'FROM element_type_to_action_type_rel et_to_at_rel LEFT JOIN action_type at ';
		query += 'ON et_to_at_rel.action_type_id = at.action_type_id AND et_to_at_rel.element_type_id = ? ';
		query += 'WHERE at.action_type_id IS NOT NULL';

	db.query( query, elementTypeId, function ( error, rows, fields ){
		if ( error ) throw error;

		var actionTypes = new Array();
		var currentActionType = 0;

		async.whilst(
			function (){
				return actionTypes.length < rows.length;
			},
			function ( callback ){
				ActionType.initWithData( function ( actionType ){
					actionTypes.push( actionType );
					currentActionType++;
					
					callback();
				}, rows[currentActionType]);
			},
			function ( error )
			{
				callback( actionTypes );
			}
		);
	});
}

ActionType.initWithData = function ( callback, data ){
	var actionType = new ActionType( data );

	callback( actionType );
}

module.exports.ActionType = ActionType;
