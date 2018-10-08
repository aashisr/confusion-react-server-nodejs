var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Cookie parser sets the cookies
var cookieParser = require('cookie-parser');
//Logger logs the request information in console (terminal) where npm start is done
var logger = require('morgan');
//Require session and file store to store the sessions
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

//Mongoose helps to impose a structure on the documents that is going to be stored in the database collection
const mongoose = require('mongoose');
//import the dishes schema from model folder
const Dishes = require('./models/dishes');

//url to connect to mongodb => localhost, port and database name
const url = 'mongodb://localhost:27017/conFusion';

//Establish a connection with the database and store in connect variable
//Since current URL string parser is deprecated, new URL parser is being used
const connect = mongoose.connect(url, {useNewUrlParser: true});

//Now, connect the database and do database operations
connect.then((db) => {
    console.log('Connected to the server');

}, (err) => {console.log(err)}); //Console log the error

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Below are middlewares which work from top to bottom in an application
//The request goes to the first middleware and then to second and so on
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Parse cookies sent from the client side in the request message and add to the request header
//Parameter is the secret-key required for a signed cookie
//app.use(cookieParser('12345-67890'));

//Replace cookieParser with sessions
app.use(session({
    name: 'session-id', //Name of the session
    secret: '12345-67890',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()  //Store the session in FileStore
}));

//let the user access the index, sign up and login routes before authorization
app.use('/', indexRouter);
app.use('/users', usersRouter);

//Function to check for authorization
function auth(req, res, next){
    console.log(req.session);

    //User should not be able to come in here without logging in
    if (!req.session.user){  //So, if they are here, display error message

        //Create a error and send to next(err)
        var err = new Error('You are not authenticated.');
        err.status = 401;
        //Skip all other middlewares and go directly to error handler
        next(err);

    } else {
        //Session already exists and user property is defined
        if (req.session.user === 'authenticated') { //If the session user is authenticated which was set in /login
            //Allow the request to pass to next middleware
            next();
        } else { //This does not happen since if there is a session for the request, it should have the correct value
            //Session is not valid, so send the error response
            var err = new Error('You are not authenticated.');
            //Do not ask again for the authentication
            //res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    }

}

//Add the authentication middleware here
//So the app needs to go through the authentication to use the middlewares below
app.use(auth);

//express.static middleware serves static data from public folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount the imported routers to respective routes
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
