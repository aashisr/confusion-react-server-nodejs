var express = require('express');
const bodyParser = require('body-parser');
var Users = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
    console.log(req.body);
    //register is a mongoose method
    //First parameter is an instance of Users with submitted username,
    //2nd is the submitted password and third is a callback function
    //.then method does not work here
    Users.register(new Users({username : req.body.username}), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            //Authenticate the registered user with passport to ensure successful registration
            passport.authenticate('local')(req, res, () => {
                //send back the reply to the client
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration successful! '});
            });
        }
    });
});

//Login route for the signed up users
//When the post request comes for login, first authenticate the user with passport
//Next function will be called only if the authentication is successful
//If error in authentication, passport automatically sends back the reply message
userRouter.post('/login', passport.authenticate('local') , (req, res) => {
    //Authenticate the user with local strategy first and issue a token to the user

    //Create a token with payload as id of the user
    //req.user contains the authenticated user
    var token = authenticate.getToken({_id: req.user._id});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //pass this token back to the user which is extracted by the passport from body of the message when authenticating
    res.json({success: true, token: token, status: 'Successful login! '});

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
