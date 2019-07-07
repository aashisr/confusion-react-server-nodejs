//Require mongoose to the application
const mongoose = require('mongoose');
//Define Schema as a mongoose schema
const Schema = mongoose.Schema;

//A blueprint for the comment object
const commentSchema = new Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        author: {
            //Stores reference to the id of the user document
            //Reference the user object with user's object id
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' //Reference to the User Schema
        },
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    },
    {
        timestamps: true
    }
);

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;
