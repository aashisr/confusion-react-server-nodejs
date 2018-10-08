//This file stores the authentication strategy

var passport = require('passport');
//Use passport local strategy to configure this file
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/users');

//Configure passport with new local strategy and export
exports.local = passport.use(new LocalStrategy(Users.authenticate()));

//serialize and deserialize the user
//These two functions takes care of sessions
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());