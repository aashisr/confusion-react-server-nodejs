const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Require the mongoose-currency node module and load the new type to mongoose
require('mongoose-currency').loadType(mongoose);
//Now, Currency is the new data type in mongoose just like Number or String
const Currency =  mongoose.Types.Currency;

const promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    //Adds updatedAt and createdAt timestamp to the document
    timestamps: true
});

//Define a mongoose model of type leaderSchema
var Promotions = mongoose.model('Promotion', promoSchema);

//Export the module
module.exports = Promotions;