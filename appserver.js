
const express = require('express');
const bodyParser = require('body-parser');

// app.js 
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken')

// create express app
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.set('secretKey', 'studentEngagement')

// parse requests 
app.use(bodyParser.urlencoded({ extended: true}));

// parse json
app.use(bodyParser.json());

//var indexRouter = require('./app/routes/');
var usersRouter = require('./app/routes/user.routes.js')(app);
var eventsRouter = require('./app/routes/event.routes.js')(app);


// initializing express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {extensions:'html'}));

//end app.js







// configure database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connect to db
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("successfully connected to the db");
}).catch(err => {
    console.log('Could not connect to the database. Exiting...', err);
    process.exit();
});


// routes for all pages
var publicPath = path.join(__dirname, 'public');

app.get('/', function(req,res) {
    res.sendfile(publicPath + '/index.html');
});

app.get('/signIn', function(req,res) {
    res.sendfile(publicPath + '/signIn.html');
});

app.get('/calendar', function(req,res) {
    res.sendfile(publicPath + '/calendar.html');
});

app.get('/contact', function(req,res) {
    res.sendfile(publicPath + '/contact.html');
});

app.get('/createEvent', function(req,res) {
    res.sendfile(publicPath + '/createEvent.html');
});

app.get('/events', function(req,res) {
    res.sendfile(publicPath + '/events.html');
});

app.get('/fundraising', function(req,res) {
    res.sendfile(publicPath + '/fundraising.html');
});

app.get('/orgs', function(req,res) {
    res.sendfile(publicPath + '/orgs.html');
});

app.get('/account', function(req,res) {
    res.sendfile(publicPath + '/account.html');
});

//end routes

//may need to include validateUser for accessing and editing events

/* function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    });
    
  } */

module.exports = usersRouter;
module.exports = eventsRouter;
module.exports = app;

