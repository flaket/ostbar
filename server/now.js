var nowjs = require( 'now' ),
    server = require( '../server' ).server;

var everyone = nowjs.initialize( server );

everyone.now.logOnServer = function ( msg ){
    console.log( msg );
};

module.exports.everyone = everyone;
