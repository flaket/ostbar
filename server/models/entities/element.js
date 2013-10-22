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
}

Element.prototype = new Entity();

Element.prototype.constructor = Element;

Element.loadById = function ( id, callback ){
    if ('element_id' in id){
        id = id.element_id;
    }

    db.query( 'SELECT * FROM element WHERE element_id = ?', id, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.length == 1 ) Element.initWithData( rows[0], callback );
        else callback( 'Could not load Element with id ' + util.inspect(id, false, null), false );
    });
};

Element.loadAllInScene = function ( sceneId, callback ){
    var query = 'SELECT element_id FROM scene_to_element_rel se_rel WHERE se_rel.scene_id = ?';

    db.query( query, sceneId, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        console.log('loading all in scene', sceneId);

        async.map ( rows, Element.loadById, callback);
    });
};

Element.create = function ( elementTypeId, frame, callback ){
    var post = {
        element_id: null,
        element_type_id: elementTypeId,
        frame_x: frame.x,
        frame_y: frame.y,
        frame_width: frame.width,
        frame_height: frame.height
    }

    var query = 'INSERT INTO element SET ?';

    ElementType.loadById( elementTypeId, function ( error, elementType ){
        if ( error ) return callback( error, false );

        db.query(query, post, function ( error, rows, fields ){
            if ( error ) return callback( error, false );
            
            if ( rows.insertId ) Element.loadById( rows.insertId, callback );
            else return callback( 'Could not create element with data ' + {
                    elementTypeId: elementTypeId,
                    frame: frame
                }, false );
        });
    });
};

Element.initWithData = function ( data, callback ){
    async.parallel({
        actionTypes: function ( callback ){
            ActionType.loadAllInElement( data.element_id, callback );
        }
    },
    function ( error, results ){
        if ( error ) return callback( error, false );

        data.action_types = results.actionTypes;
        callback( null, new Element( data ) );
    });
}

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
}

Element.prototype.addActionType = function( actionTypeId, data, callback ){
    var post = {
        element_id: this.elementId, 
        action_type_id: actionTypeId,
        data: data
    };

    var query = 'INSERT INTO element_to_action_type_rel SET ?';

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) return callback( error, false );

        if ( rows.insertId ) Element.loadById( this.elementId, callback );
        else return callback( 'Could not add action type ' + actionTypeId + ' to element with id ' + this.elementId, false );
    });
};

module.exports.Element = Element;
