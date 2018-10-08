var express = require('express');
const bodyParser = require('body-parser');
var Users = require('../models/users');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
    console.log(req.body);
    //Check if user already exists
    Users.findOne({username : req.body.username})
        .then((user) => {
            if (user != null){
                var err = new Error('User ' + req.body.username + ' already exists.');
                err.status = 403;
                next(err);
            } else {
                //Create the user and return
                return Users.create({
                    username: req.body.username,
                    password: req.body.password
                });
            }
        })
        //If the above then returns a user by creating it
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Registration successful! ', user: user});
        }, (err) => next(err))
        .catch((err) => next(err));
});

//Login route for the signed up users
userRouter.post('/login', (req, res, next) => {
    //If the incoming request does not include the session, then the user is not authorized yet
    if (!req.session.user) {  //So, authenticate the user
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
        //.from included in new node versions to deal with security issues
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

        //Get the username and password
        var username = auth[0];
        var password = auth[1];

        //Search the databse to get the user info
        Users.findOne({username: username})
            .then((user) => {
                //If user could not be found, return error
                if (user === null) {
                    var err = new Error('User ' + username + 'does not exist!');
                    err.status = 403;
                    next(err);
                }
                //If the users password does not match with the submitted one
                else if (password !== user.password) {
                    var err = new Error('Your password is incorrect!');
                    err.status = 403;
                    next(err);
                }
                //Else, double check for username and password and allow to user to proceed further
                else if (username === user.username && password === user.password) {
                    //Set up the session user property as any string to be used on app.js
                    req.session.user = 'authenticated';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You are authenticated');
                }
            })
            .catch((err) => next(err));
    }
    //If the user is already logged in
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated');
    }
});

//LOGOUT route for the logged in users

//GET request for logout since no need to submit any information for logout
userRouter.get('/logout', (req, res) => {
    //If session already exists
    if(req.session){
        //Destroy the session
        req.session.destroy();
        //Clear the cookie from client browser, which was stored in the name session-id
        res.clearCookie('session-id');
        //Redirect to homepage
        res.redirect('/');
    } else {
        var err = 'You are not logged in!'
        err.status = 403;
        next(err);
    }
});

module.exports = userRouter;
