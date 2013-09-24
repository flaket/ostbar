var http = require('http');

http.createServer(function (request, response) {
request.on('end', function () {
console.log('request end event fired');
});
var _get = url.parse(request.url, true).query; 
response.writeHead(200, {'Content-Type': 'text/plain'});
response.end('Here is your data: ' + _get['data']);
console.log('response end call done');
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
