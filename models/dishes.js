//Require mongoose to the application
const mongoose = require('mongoose');
//Define Schema as a mongoose schema
const Schema = mongoose.Schema;

//Require the mongoose-currency node module and load the new type to mongoose
require('mongoose-currency').loadType(mongoose);
//Now, Currency is the new data type in mongoose just like Number or String
const Currency = mongoose.Types.Currency;

//A blueprint for the dish object
const dishSchema = new Schema(
    {
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
        category: {
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
    },
    {
        //Adds updatedAt and createdAt timestamp to the document
        timestamps: true
    }
);

//Define a mongoose model of type dishSchema
//'Dish' is the name of the model which will be mapped as a collection (table) in the database with name 'dishes'
//mongoose automatically converts the name of the model to plural and name it as collection
//'dishes' collection stores the documents of type 'Dish'
var Dishes = mongoose.model('Dish', dishSchema);

//Export the module
module.exports = Dishes;
