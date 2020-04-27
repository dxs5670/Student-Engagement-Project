// Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const jwt = require('jsonwebtoken')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const dbConfig = require('./config/database.config.js');


// Connect to database and check for errors
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("successfully connected to the db");
}).catch(err => {
    console.log('Could not connect to the database. Exiting...', err);
    process.exit();
});


// create express app
var app = express();


// Setting public path for static views
var publicPath = path.join(__dirname, 'public');


// Setting the public folder
app.use(express.static(path.join(__dirname, 'public'), {extensions:'html'}));


/* ~~~~~~~~~~~~~~~~~~~
     MIDDLEWARE
~~~~~~~~~~~~~~~~~~~~*/

// Initialize logger, cookieparser, & json
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add headers to prevent errors with requst methods
app.use(function (req, res, next) {
    // Allow origin from all sites (note: this is not acceptable for deployment)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods (allow all)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true for cookie transmission
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Body Parser Middleware:  parse requests & JSON
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Express Messsages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

// Passport Middleware
require('./config/passport.config')(passport);
app.use(passport.initialize());
app.use(passport.session());
// User global variable for logout
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})

/* ~~~~~~~~~~~~~~~~~~~
        ROUTES
~~~~~~~~~~~~~~~~~~~~*/
var usersRouter = require('./app/routes/user.routes.js')(app);
var eventsRouter = require('./app/routes/event.routes.js')(app);
app.get('/', function(req,res) { res.sendfile(publicPath + '/index.html'); });
app.get('/signIn', function(req,res) { res.sendfile(publicPath + '/signIn.html'); });
app.get('/calendar', function(req,res) { res.sendfile(publicPath + '/calendar.html'); });
app.get('/createEvent', function(req,res) { res.sendfile(publicPath + '/createEvent.html'); });
app.get('/eventsList', function(req,res) { res.sendfile(publicPath + '/eventsList.html'); });
app.get('/fundraising', function(req,res) { res.sendfile(publicPath + '/fundraising.html'); });
app.get('/orgs', function(req,res) { res.sendfile(publicPath + '/orgs.html'); });
app.get('/account', function(req,res) { res.sendfile(publicPath + '/account.html'); });

// Start Express

module.exports = usersRouter;
module.exports = eventsRouter;
module.exports = app;

