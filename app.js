var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
app.use(cookieParser());


//Function to check for authorization
function auth(req, res, next){
    console.log(req.headers);

    //Get the authorization header
    // Example of basic authorization header: Basic YWRtaW46cGFzc3dvcmQ=
    //Second part is the base64 encoding of 'username:password'
    var authHeader = req.headers.authorization;

    //If no authentication header
    if (!authHeader) {
        //Ask the user to authenticate
        //Create a error and send to next(err)
        var err = new Error('You are not authenticated.');
        //Set the header to response message
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        //Skip all other middlewares and go directly to error handler
        next(err);
    }

    //If authHeader exists, get the username and password
    //split the authHeader with space and get the latter part by removing Basic and decode the base64 value to string using buffer
    //authHeader is now in format 'username:password'
    //Again split that string with ':'
    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');

    //Get the username and password
    var username = auth[0];
    var password = auth[1];

    //Check for the username and password
    if (username === 'admin' && password === 'password'){
        //Allow the client request to pass to next middleware
        //express matches the specific request to specific middleware
        next();
    } else {
        //Username and password does not match, Ask the user to authenticate again
        //Create a error and send to next(err)
        var err = new Error('You are not authenticated.');
        //Set the header to response message
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        //Skip all other middlewares and go directly to error handler
        next(err);
    }

}

//Add the authentication middleware here
//So the app needs to go through the authentication to use the middlewares below
app.use(auth);

//express.static middleware serves static data from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
