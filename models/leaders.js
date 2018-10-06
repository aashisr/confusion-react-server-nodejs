const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    //Adds updatedAt and createdAt timestamp to the document
    timestamps: true
});

var Leaders = mongoose.model('Leader', LeaderSchema);

module.exports = Leaders;