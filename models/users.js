var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    //Username and hash passwords will be automatically added by passportLocalMongoose plugin
    admin : { //By default , the new user created is not admin
        type: Boolean,
        default: false
    }
});

//Use passportLocalMongoose as a plugin
UserSchema.plugin(passportLocalMongoose);

//Create a module and export
var Users = mongoose.model('User', UserSchema);
module.exports = Users;