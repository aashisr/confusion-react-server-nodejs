var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin : { //By default , the new user created is not admin
        type: Boolean,
        default: false
    }
});

//Create a module and export
var Users = mongoose.model('User', UserSchema);
module.exports = Users;