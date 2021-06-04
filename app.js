// Import configurations
const port = require('./config.js').port;
// Import middlewares
const allowCrossDomainCSP = require('./middleware.js').allowCrossDomainCSP;
const serveConstructionPageMiddleware = require('./middleware.js').serveConstructionPageMiddleware;
// Import express.js and session
const express = require('express');
const session = require('express-session')
// Import helper functions for routing functions
const loginMatch = require('./APIHelpers.js').loginMatch;
const serveForturneCookie = require('./APIHelpers.js').serveForturneCookie;
const addFortuneCookie = require('./APIHelpers.js').addFortuneCookie;

// Initiate express
const app = express();

// Set up a body parser middleware (to use req.body)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// CORS + CSP middleware
app.use(allowCrossDomainCSP);

// Set up a middleware to serve construction page
app.use(serveConstructionPageMiddleware);

// Set up the Express session middleware for session and cookies
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // localhost works but not 127.0.0.1?!
    // cookie: {sameSite: 'none', secure: true}
}));

// Serve a fortune cookie for each get request 
app.get('/', (req,res)=>{
    serveForturneCookie().then((fortuneCookie) => {
        if(fortuneCookie){
            res.write(fortuneCookie.FortunesID + "\n" + fortuneCookie.FortuneMessage + 
            "\n" + "Written by: " + fortuneCookie.Writer);
            res.end();
        }
        else{
            res.send("There is no fortune cookie.");
        }
    }).catch((err) => {
        res.status(400).send("There was an error while retrieving: " + err);
        console.error("Error serving fortune cookie:",err);
    });
});

// Logged in members can post a fortune cookie
app.post('/', (req,res)=>{
    var cookieSubmition = req.body.fortunecookie;
    var loggedInStatus = req.session.loggedInStatus;
    if (loggedInStatus=="true"){
        // Add submitted cookie to the cookie list & respond success or failure
        addFortuneCookie(req.session.userId, cookieSubmition).then(()=>{
            res.send("Success");
        }).catch((err)=>{
            res.status(400).send("There was an error while posting: " + err);
            res.send("Fail")
        })
    }
    else {
        // Not logged in
        res.status(401).send("Invalid token. Log in or submit a valid token.");
    }
});

// Handle user login
app.post('/login', (req,res)=>{
    var id = req.body.id;
    var pw = req.body.pw;
    loginMatch(id,pw).then((data) => {
        if (data){
            // Use Express session middleware and save username for users logged in
            req.session.userId = id;
            req.session.loggedInStatus = "true";
            // respond failure
            res.send(`Welcome, ${id}`);
        }
        else{
            // respond failure
            res.status(401).send("failure");
        }
    });
});

/*

Serves frontend to make Login and Create API requests easier through form.

It does two things for you:

1. Login at './login'

2. Send a post request to './' to upload fortune cookies

Originally it was planned as a stand alone app but that would have required
gimics or Oauth.
*/

app.get('/forms', function(req,res){
    res.render('client.pug', {
        loggedInStatus: req.session.loggedInStatus,
        userID: req.session.userId
    });
});

app.listen(port);