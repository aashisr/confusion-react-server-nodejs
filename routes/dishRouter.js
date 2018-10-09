//File for handling all routes of 'dishes'
//This is an mini express router, so we require all that was required in app.js
const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

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
    //GET request for dishes, open for all even without authentication
    .get((req, res, next) => {
        //Find all the dishes from the Dishes model i.e dishes collection in database
        Dishes.find()
            //Populate the author field in comments from the User schema since Dishes schema only has the reference to user object
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(dishes);
            }, (err) => next(err)) //sends the error to the error handler
            .catch((err) => next(err));
    })
    //POST request for dishes, user must be authenticated to use this route, verifyUser verifies if the user is logged in
    //If verifyUser returns false, it is handled by passport
    .post(authenticate.verifyUser, (req, res, next) => {
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
    .put(authenticate.verifyUser, (req, res, next) => {
        //Update the status code to 403
        res.statusCode = 403
        res.end('PUT operation forbidden on /dishes');
    })
    //DELETE request for dishes
    .delete(authenticate.verifyUser, (req, res, next) => {
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
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        //POST not supported for this one
        //Update the status code to 403
        res.statusCode = 403
        res.end('POST operation forbidden on /dishes/' + req.params.dishId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
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
    .delete(authenticate.verifyUser, (req, res, next) => {
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


//HTTP methods for operation on comments on the dish object

dishRouter.route('/:dishId/comments')
    //GET request for dish comments
    .get((req, res, next) => {
        //First, find the dish with the id in the parameter
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                //Check if the dish exists
                if (dish !== null){
                    //Dish exists
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    //Return the comments on this dish as json
                    res.json(dish.comments);
                } else {
                    //Dish does not exist
                    //So, return the error message and status code
                    //error is handled by the error handler in app.js
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err)) //sends the error to the error handler
            .catch((err) => next(err));
    })
    //POST request for dish comments
    .post(authenticate.verifyUser, (req, res, next) => {
        //Find the dish to post the comments to with the given id
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                //Check if the dish exists
                if (dish !== null){
                    //Dish exists
                    //Push the comments from req.body to the comments property of the dish object
                    //Author of the comment is the user who submitted the comment, verifyUser contains req.user
                    //So, populate the author field with the object id of that user
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);

                    //Save the dish
                    dish.save(dish)
                        .then((dish) => {
                            //Populate author's information to the comments in dish
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    //Return the updated dish as json
                                    res.json(dish);
                                })

                        }, (err) => next(err))
                        .catch((err) => next(err));

                } else {
                    //Dish does not exist
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    //PUT request for comments on a dish
    .put(authenticate.verifyUser, (req, res, next) => {
        //Update the status code to 403
        res.statusCode = 403
        res.end('PUT operation forbidden on /dishes/' + req.params.dishId + '/comments');
    })
    //DELETE request for comments on a dish
    .delete(authenticate.verifyUser, (req, res, next) => {
        //Find the dish to delete the comments from with the given id
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish !== null){
                    //Delete all the comments from this dish
                    //dish.comments.remove() does not work

                    //So, go through all the comments using for loop
                    for (var i = (dish.comments.length - 1); i >= 0; i--){
                        //Remove all comments
                        //This is the way to access a sub-document,
                        // .id method gives the object from a sub-document with the given id
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    //Save the dish
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            //Return the dish with comments deleted as json
                            res.json(dish);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    //Dish does not exist
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    });


dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        //Find the dish
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                //Check if the dish and comment both exists
                if (dish !== null && dish.comments.id(req.params.commentId) !== null){
                    //Dish and comment exists
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    //Return the comment with the given id on this dish as json
                    res.json(dish.comments.id(req.params.commentId));
                } else if (dish === null) {
                    //Dish does not exist
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    //Comment does not exist
                    err = new Error('Comment ' + req.params.commentId + ' not found on dish ' +
                    req.params.dishId);
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        //POST not supported for this one
        //Update the status code to 403
        res.statusCode = 403
        res.end('POST operation forbidden on /dishes/' + req.params.dishId +
                '/comments/' + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        //Find the dish
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                //Check if the dish and comment both exists
                if (dish !== null && dish.comments.id(req.params.commentId) !== null){
                    //Dish and comment exists
                    //Only the rating or the comment can be updated
                    if (req.body.rating){
                        //If the request body has the rating property to update
                        //Find the comment by comment id and update the rating
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment){
                        //If the request body has the comment property to update
                        //Find the comment by comment id and update the comment
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    //Save the dish
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id).populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    //Return the dish with updated comments as json
                                    res.json(dish);
                                })

                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else if (dish === null) {
                    //Dish does not exist
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    //Comment does not exist
                    err = new Error('Comment ' + req.params.commentId + ' not found on dish ' +
                        req.params.dishId);
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        //Find the dish
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish !== null && dish.comments.id(req.params.commentId) !== null){
                    //Remove the comment with given id
                    dish.comments.id(req.params.commentId).remove();

                    //Save the dish
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id).populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    //Return the dish with the given comment deleted as json
                                    res.json(dish);
                                })

                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else if (dish === null) {
                    //Dish does not exist
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    //Comment does not exist
                    err = new Error('Comment ' + req.params.commentId + ' not found on dish ' +
                        req.params.dishId);
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    });

//Export this route as a module
module.exports = dishRouter;