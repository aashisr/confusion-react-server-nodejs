var express = require('express');
const bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});

/* GET users listing. */
userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //Get all the users
    Users.find()
        .then(
            (users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
    console.log(req.body);
    //register is a mongoose method
    //First parameter is an instance of Users with submitted username,
    //2nd is the submitted password and third is a callback function
    //.then method does not work here
    Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        } else {
            //If the incoming request contains other user information, add them also
            if (req.body.firstName) {
                //user is coming from passport module as 2nd parameter in above function
                user.firstName = req.body.firstName;
            }
            if (req.body.lastName) {
                user.lastName = req.body.lastName;
            }

            //Save the modification to the user
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                    return;
                }

                //Authenticate the registered user with passport to ensure successful registration
                passport.authenticate('local')(req, res, () => {
                    //send back the reply to the client
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration successful! ' });
                });
            });
        }
    });
});

//Login route for the signed up users
//When the post request comes for login, first authenticate the user with passport
userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
    // Authenticate the user with local strategy first and issue a token to the user
    // err containes genuine error with the passport authentication
    // returns user if there is no error
    // if user does not exist, it does not return error but a null user
    // info carries additional info such as user does not exist or either username or password is incorrect
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        // If user does not exist (if username or password is incorrect)
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'Login Unsuccessful!', err: info });
        }

        // If login is successful, passport authenticate will add req.login() to user
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in the user!' });
            }

            // If user has reached here, user is successfully logged in
            //Create a token with payload as id of the user
            //req.user contains the authenticated user
            var token = authenticate.getToken({ _id: req.user._id });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //pass this token back to the user which is extracted by the passport from body of the message when authenticating
            res.json({ success: true, token: token, status: 'Successful login! ' });
        });
    })(req, res, next);
});

//LOGOUT route for the logged in users

//GET request for logout since no need to submit any information for logout
userRouter.get('/logout', (req, res) => {
    //If session already exists
    if (req.session) {
        //Destroy the session
        req.session.destroy();
        //Clear the cookie from client browser, which was stored in the name session-id
        res.clearCookie('session-id');
        //Redirect to homepage
        res.redirect('/');
    } else {
        var err = 'You are not logged in!';
        err.status = 403;
        next(err);
    }
});

// Cross-check to make sure json web token is still valid
userRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT invalid!', success: false, err: info });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT valid!', success: true, user: user });
        }
    })(req, res);
});

module.exports = userRouter;
