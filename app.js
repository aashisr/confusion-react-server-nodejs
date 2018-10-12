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
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

//Mongoose helps to impose a structure on the documents that is going to be stored in the database collection
const mongoose = require('mongoose');
//import the dishes schema from model folder
const Dishes = require('./models/dishes');

//url to connect to mongodb, imported from config.js
const url = config.mongoUrl;

//Establish a connection with the database and store in connect variable
//Since current URL string parser is deprecated, new URL parser is being used
const connect = mongoose.connect(url, {useNewUrlParser: true});

//Now, connect the database and do database operations
connect.then((db) => {
    console.log('Connected to the server');

}, (err) => {console.log(err)}); //Console log the error

var app = express();

//Redirect the request coming to http port to https port
//Redirect for all the requests coming in, no matter the path
app.all('*', (req, res, next) => {
    //If incoming request is already a secure request
    //If incoming request is secure, req object will have the secure property set to true
    if (req.secure){
        //No need to do anything
        return next();
    } else {
        //Redirect to secure port
        //Return status code is 307
        //hostname is localhost, req.url is the actual path (routes)
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Below are middlewares which work from top to bottom in an application
//The request goes to the first middleware and then to second and so on
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Initialize passport
app.use(passport.initialize());

//let the user access the index, sign up and login routes before authorization
app.use('/', indexRouter);
app.use('/users', usersRouter);

//express.static middleware serves static data from public folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount the imported routers to respective routes
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
