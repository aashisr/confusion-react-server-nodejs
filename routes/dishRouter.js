//File for handling all routes of 'dishes'
//This is an mini express router, so we require all that was required in index.js

const express = require('express');

const bodyParser  = require('body-parser');

//Declare dishRouter as express router
const dishRouter = express.Router();

//Make use of body parser
dishRouter.use(bodyParser.json());

//The endpoint is just / since this router will be mounted as /dishes in index.js
//Building REST api support for dishes endpoint
//Chain all the methods with dishRouter.route, so first parameter in all methods are not needed
//since all methods will take route from the dishRouter.route

dishRouter.route('/')

//All the http methods will come here first and go to specific method by calling next()
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        //Call the next function so that it will continue to look for additional dishes endpoint
        next();
    })
    //GET request for dishes
    //The modified parameters req, res are passed from the above 'all' method
    .get((req, res, next) => {
        //The modified res objects are carried in to this function as well
        //.end ends the handling of the current method i.e get in here
        res.end('Getting all the dishes');
    })
    //POST request for dishes
    .post((req, res, next) => {
        //The modified res objects are carried in to this function as well
        res.end('Add dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    //PUT request for dishes
    .put((req, res, next) => {
        //Update the status code to 403
        res.statusCode = 403
        res.end('PUT operation forbidden on /dishes');
    })
    //DELETE request for dishes
    .delete((req, res, next) => {
        res.end('Deleting all the dishes');
    });


//ROUTE FOR /dishes/:dishId
dishRouter.route('/:dishId')
    .get((req, res, next) => {
        res.end('Get the details of dish ' + req.params.dishId);
    })
    .post((req, res, next) => {
        //POST not supported for this one
        //Update the status code to 403
        res.statusCode = 403
        res.end('POST operation forbidden on /dishes/' + req.params.dishId);
    })
    .put((req, res, next) => {
        //res.write adds line to the reply message
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Update dish: ' + req.body.name + ' with details '+ req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting dish: ' + req.params.dishId);
    });

//Export this route as a module
module.exports = dishRouter;