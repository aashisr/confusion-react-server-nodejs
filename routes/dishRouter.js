//File for handling all routes of 'dishes'
//This is an mini express router, so we require all that was required in app.js
const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');

//Import dishes model and store in Dishes variable
const Dishes = require('../models/dishes');

//Declare dishRouter as express router
const dishRouter = express.Router();

//Make use of body parser
dishRouter.use(bodyParser.json());

//The endpoint is just / since this router will be mounted as /dishes in index.js
//Building REST api support for dishes endpoint
//Chain all the methods with dishRouter.route, so first parameter in all methods are not needed
//since all methods will take route from the dishRouter.route

dishRouter.route('/')
    //GET request for dishes
    .get((req, res, next) => {
        //Find all the dishes from the Dishes model i.e dishes collection in database
        Dishes.find()
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(dishes);
            }, (err) => next(err)) //sends the error to the error handler
            .catch((err) => next(err));
    })
    //POST request for dishes
    .post((req, res, next) => {
        //Post the parsed request to the Dishes model i.e dishes collection
        //req.body is already parsed by bodyParser
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish created \n', dish);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    //PUT request for dishes
    .put((req, res, next) => {
        //Update the status code to 403
        res.statusCode = 403
        res.end('PUT operation forbidden on /dishes');
    })
    //DELETE request for dishes
    .delete((req, res, next) => {
        //Delete all the dishes from dishes collection
        Dishes.remove()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response which is a deleted object as json
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//ROUTE FOR /dishes/:dishId
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        //Find the dish by id and return the found dish
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        //POST not supported for this one
        //Update the status code to 403
        res.statusCode = 403
        res.end('POST operation forbidden on /dishes/' + req.params.dishId);
    })
    .put((req, res, next) => {
        //Find the dish by id and update that dish
        Dishes.findByIdAndUpdate(req.params.dishId, {
            //$set takes the new object to be updated
            //Here, new object is the object sent in the body with PUT request
            $set : req.body
            }, { new: true }) //new: true is to return the updated dish
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        //Find the dish by id and remove
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response which is a deleted object as json
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//Export this route as a module
module.exports = dishRouter;