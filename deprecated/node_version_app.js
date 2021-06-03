var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    logConnection(req);
    // resEnd=routingAddress(req);
    res.end(fortuneCookieFunction());
}).listen(8080);

var fortuneCookieFunction = function(hello) {
    random = Math.floor(Math.random()*30);
    var fortunes = fs.readFileSync('text').toString();
    var arrayOfFortunes = fortunes.split(/[\r\n]+/);
    return arrayOfFortunes[random];
};

var logConnection = function(req){
    console.log((req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0]);
};

// TODO: REST API on Express (insertion and get and delete on a backup)

// var routingAddress = function(req){
//     req.url
// };

