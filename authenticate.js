//This file stores the authentication strategy

var passport = require('passport');
//Use passport local strategy to configure this file
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/users');
//Provides json web based strategy for configuring our passport module
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

//Import config file
var config = require('./config');

//Configure passport with new local strategy and export
exports.local = passport.use(new LocalStrategy(Users.authenticate()));

//serialize and deserialize the user
//These two functions takes care of sessions
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

//export these functions as well
exports.getToken = function(user) {
    // generate a signed json web token with the contents of user object and return it in the response
    //user is the payload for json web token and sends the user as jwt_payload
    return jwt.sign(user, config.secretKey, { expiresIn: 36000 });
};

//Configure json web token based strategy for passport
//options for jwt based strategy
var opts = {};
//Specifies how json web token should be extracted from incoming requests
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//supply the secret key for the sign in
opts.secretOrKey = config.secretKey;

//create adn export new JwtStrategy
//done is callback function provided by passport
exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('JWT payload: ', jwt_payload);

        //Search for user
        //jwt_payload includes the user information that was sent in jwt.sign in getToken function
        Users.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                //done is callback that passport into our strategy
                //Second parameter is the user, here false indicates user does not exist
                return done(err, false);
            } else if (user) {
                //If user is not null
                //null means there is no error, user is the user returned from mongodb
                return done(null, user);
            } else {
                //Return no error and user could not be found
                return done(null, false);
            }
        });
    })
);

//Verify the incoming user by using the token that comes in the authentication header
//Passport authentication strategy is jwt strategy,
//session false means do not create sessions since we are using token based authentication
exports.verifyUser = passport.authenticate('jwt', { session: false });

//Verifying admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin === true) {
        next();
    } else {
        var err = new Error('You must be an admin to perform this operation.');
        err.status = 403;
        next(err);
    }
};
