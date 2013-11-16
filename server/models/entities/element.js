var Entity  = require( '../entity' ).Entity;
var DB      = require( '../db' );
var db      = DB.instance;
var async   = require( 'async' );
var util    = require( 'util' );

var ActionType  = require( './actiontype' ).ActionType;
var ElementType = require( './elementtype' ).ElementType;

function Element( data ){
    Entity.call( this );

    this.elementId      = data.element_id;
    this.elementTypeId  = data.element_type_id;
    this.frameX         = data.frame_x;
    this.frameY         = data.frame_y;
    this.frameWidth     = data.frame_width;
    this.frameHeight    = data.frame_height;
    this.actionTypes    = data.action_types;
};

Element.prototype = new Entity();

Element.prototype.constructor = Element;

Element.loadById = function ( id, callback ){
    if ( id == null ) return callback( null, false );

    if ( id.element_id ) id = id.element_id;

    db.query( 'SELECT * FROM element WHERE element_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Element.initWithData( rows[0], callback );
        else callback( 'Could not load Element with id ' + util.inspect(id, false, null), false );
    });
};

Element.loadAllInScene = function ( sceneId, callback ){
    if ( sceneId == null ) return callback( null, false );

    var query = 'SELECT element_id FROM scene_to_element_rel se_rel WHERE se_rel.scene_id = ?';

    db.query( query, sceneId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        async.map ( rows, Element.loadById, callback);
    });
};

Element.create = function ( elementTypeId, frame, sceneId, callback ){
    if ( elementTypeId == null || frame == null || sceneId == null){
        return callback( null, false );
    }

    var post = {
        element_id: null,
        element_type_id: elementTypeId,
        frame_x: frame.x,
        frame_y: frame.y,
        frame_width: frame.width,
        frame_height: frame.height
    }

    var query = 'INSERT INTO element SET ?';

    db.query(query, post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );
        
        if ( rows.insertId ){
            var elementId = rows.insertId;

            db.query( 'INSERT INTO scene_to_element_rel VALUES (?, ?)', [sceneId, elementId], function ( error, rows, fields){
                if ( error ) return callback ( error, false );

                Element.loadById( elementId, callback );
            });
        } else return callback( null, false );
    });
};

Element.initWithData = function ( data, callback ){
    if ( data == null ) return callback( null, false );

    async.parallel({
        actionTypes: ActionType.loadAllInElement.bind( ActionType, data.element_id )
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.action_types = results.actionTypes;
        callback( null, new Element( data ) );
    });
};

Element.prototype.update = function ( callback ){
    var query = 'UPDATE element SET ';
        query += 'element_type_id = ?, ';
        query += 'frame_x = ?, ';
        query += 'frame_y = ?, ';
        query += 'frame_width = ?, ';
        query += 'frame_height = ? ';
        query += 'WHERE element_id = ?';

    var post = [
        this.elementTypeId,
        this.frameX,
        this.frameY,
        this.frameWidth,
        this.frameHeight,
        this.elementId
    ];
    
    var self = this;

    db.query(query, post, function ( error, rows, fields){        
        if ( error ) return callback( error, false );

        callback( null, self );
    });
};

Element.prototype.addActionType = function( actionTypeId, data, callback ){
    if ( actionTypeId == null || data == null ) return callback( null, false );
    
    var query = 'INSERT INTO element_to_action_type_rel SET ?',
        post = {
            element_id: this.elementId, 
            action_type_id: actionTypeId,
            data: data
        },
        self = this;

    db.query( query, post, function ( error, rows, fields ){
        if ( error && error.code == 'ER_DUP_ENTRY' ) {

            query = 'UPDATE element_to_action_type_rel SET data = ? WHERE element_id = ? AND action_type_id = ?';
            post = [data, self.elementId, actionTypeId];
            db.query( query, post, function ( error, rows, fields ){
                if ( error ) return callback( error, false );

                return Element.loadById( self.elementId, callback );
            });
        } else if ( error ) {
            return callback( error, false );
        } else {
            if ( rows.affectedRows ) Element.loadById( self.elementId, callback );
            else return callback( 'Could not add action type ' + actionTypeId + ' to element with id ' + self.elementId, false );
        }
    });
};

Element.prototype.removeActionType = function ( actionTypeId, callback ){
    console.log( 'Element.removeActionType', actionTypeId );

    if ( actionTypeId == null ) return callback( null, false );

    var query = 'DELETE FROM element_to_action_type_rel WHERE element_id = ? AND action_type_id = ?',
        self = this;

    db.query( query, [ this.elementId, actionTypeId ], function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        Element.loadById( self.elementId, callback );
    });
};

Element.prototype.addActivity = function( activityId, callback ){
    if ( activityId == null ) return callback( null, false );

    var self = this;

    db.query( 'SELECT * FROM action_type WHERE type = \'TO_ACTIVITY\'', function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) self.addActionType( rows[0].action_type_id, activityId + '', callback );
        else callback( 'TO_ACTIVITY finnes ikke i databasen', false );
    });
};

Element.prototype.removeActivity = function ( callback ){
    var self = this;

    db.query( 'SELECT * FROM action_type WHERE type = \'TO_ACTIVITY\'', function ( error, rows, fields ){
        if ( error ) return callback ( error, false );

        if ( rows.length == 1 ) self.removeActionType( rows[0].action_type_id, callback );
    });
};

Element.delete = function ( elementId, callback ){
    if ( elementId == null ) return callback( 'Kan ikke slette element med id null', false );

    db.query( 'DELETE FROM element WHERE element_id = ?', elementId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        db.query( 'DELETE FROM element_to_action_type_rel WHERE element_id = ?', elementId, function ( error, rows, fields ){
            if ( error ) return callback( error, false );

            db.query( 'DELETE FROM scene_to_element_rel WHERE element_id = ?', elementId, function ( error, rows, fields ){
                if ( error ) return callback( error, false );

                return callback( null, true );
            });
        });
    });
};

module.exports.Element = Element;
