const path = require('path');
const construction = require('./config.js').construction;

// CORS + CSP middleware
var allowCrossDomainCSP = function(req, res, next) {
    // Apparently changing this origin to 127.0.0.1 specifically doesn't matter because of secure set-cookie flag
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Content-Security-Policy', "connect-src '*'");
    next();
}

// Serve construction page
const serveConstructionPageMiddleware = function (req,res,next){
    if(construction){
        serveConstruction(res);
    }
    else{
        next();
    }
}

const serveConstruction = function(res){
    // Serve static file
    res.sendFile(path.join(__dirname,"public/construction.html"));
};

// Export middlewares
module.exports = {
    allowCrossDomainCSP: allowCrossDomainCSP,
    serveConstructionPageMiddleware: serveConstructionPageMiddleware
}