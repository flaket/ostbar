var server = require( '../server' ).server;
var nowjs = require( 'now' );

var everyone = nowjs.initialize( server );

everyone.now.logStuff = function ( msg ){
	console.log(msg);
};

module.exports.everyone = everyone;