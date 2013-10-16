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
    this.elementType    = data.element_type;
    this.frameX         = data.frame_x;
    this.frameY         = data.frame_y;
    this.frameWidth     = data.frame_width;
    this.frameHeight    = data.frame_height;
    this.actionTypes    = data.action_types;
}

Element.prototype = new Entity();

Element.prototype.constructor = Element;

Element.loadById = function ( callback, id ){
    db.query( 'SELECT * FROM element WHERE element_id = ?', id, function ( error, rows, fields ){
        if ( error ) throw error;

        if ( rows.length == 1 ){
            var data = rows[0];

            async.parallel({
                elementType: function ( callback ){
                    ElementType.loadById( function ( elementType ){
                        callback( null, elementType );
                    }, data.element_type_id );
                },
                actionTypes: function ( callback ){
                    ActionType.loadAllInElement( function ( actionTypes ) {
                        callback( null, actionTypes );
                    }, data.element_id );
                }
            },
            function ( error, results ){
                if ( error ) callback( null );
                else{
                    data.element_type = results.elementType;
                    data.action_types = results.actionTypes;
                    callback( new Element( data ) );
                }
            });
        }
        else callback( null );
    });
}

Element.loadAllInScene = function ( callback, sceneId ){
    var query = 'SELECT * FROM scene_to_element_rel se_rel WHERE se_rel.scene_id = ?';

    db.query( query, sceneId, function ( error, rows, fields ){
        if ( error ) throw error;

        var elements = new Array();
        var currentElement = 0;

        async.whilst( 
            function (){
                return elements.length < rows.length;
            },
            function ( callback ){
                Element.loadById( function ( element ){
                    currentElement++;
                    elements.push( element );
                    callback();
                }, rows[currentElement].element_id );
            },
            function ( error ){
                if ( error ) callback( null );
                else callback( elements );
            }
         );
    });
}

Element.prototype.addActionType = function( callback, actionTypeId, data ){
    var post = {
        element_id: this.elementId, 
        action_type_id: actionTypeId,
        data: data
    };

    var query = 'INSERT INTO element_to_action_type_rel SET ?';

    db.query( query, post, function ( error, rows, fields ){
        if ( error ) throw error;

        callback( true );
    });
}

module.exports.Element = Element;
