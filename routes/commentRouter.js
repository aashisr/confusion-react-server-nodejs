//File for handling all routes of 'comments'
//This is an mini express router, so we require all that was required in app.js
const express = require('express');
const bodyParser = require('body-parser');
//mongoose is used for mongoose methods like find, create, findById, etc
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

//Import comments model and store in Comments variable
const Comments = require('../models/comments');

//Declare commentRouter as express router
const commentRouter = express.Router();

//Make use of body parser
commentRouter.use(bodyParser.json());

//HTTP methods for operation on comments
commentRouter
    .route('/')
    //Implement cors
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    //GET request for dish comments
    .get(cors.cors, (req, res, next) => {
        //First, find the dish with the id in the parameter
        Comments.find(req.query)
            .populate('author')
            .then(
                (comments) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    //Return the comments as json
                    res.json(comments);
                },
                (err) => next(err)
            ) //sends the error to the error handler
            .catch((err) => next(err));
    })
    //POST request for dish comments
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('Post comment');
        // Check if req containes the data (comment) required
        if (req.body) {
            // insert author to the body as the id of the logged in user
            req.body.author = req.user._id;

            //Create the comment now as req.body contains all the required information
            Comments.create(req.body)
                .then(
                    (comment) => {
                        Comments.findById(comment._id) // id of the comment just inserted
                            .populate(author)
                            .then((comment) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(comment);
                            });
                    },
                    (err) => next(err)
                )
                .catch((err) => next(err));
        } else {
            err = new Error('Comment not found in request body!');
            err.status = 404;
            return next(err);
        }
    })
    //PUT request for comments on a dish
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        //Update the status code to 403
        res.statusCode = 403;
        res.end('PUT operation forbidden on /comments/');
    })
    //DELETE request for deleting all the comments on all the dishes, only for admins
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // Removes all the comments from the document
        Comments.remove({})
            .then(
                (response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

commentRouter
    .route('/:commentId')
    //Implement cors
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        //Find the comment
        Comments.findById(req.params.commentId)
            .populate('author')
            .then(
                (comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    //Return the comment with the given id
                    res.json(comment);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //POST not supported for this one
        //Update the status code to 403
        res.statusCode = 403;
        res.end('POST operation forbidden on /comments/' + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Find the comment
        Comments.findById(req.params.commentId)
            .then(
                (comment) => {
                    //Check if the comment exists
                    if (comment) {
                        //Comment exists

                        //Check if the user editing is the author of this comment
                        if (req.user._id.equals(comment.author)) {
                            // insert author to the body as the id of the logged in user
                            req.body.author = req.user._id;

                            //Save the comment
                            Comments.findByIdAndUpdate(req.params.commentId, { $set: req.body }, { new: true }).then((comment) => {
                                Comments.findById(comment._id)
                                    .populate('author')
                                    .then(
                                        (comment) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            //Return the updated comment
                                            res.json(comment);
                                        },
                                        (err) => next(err)
                                    )
                                    .catch((err) => next(err));
                            });
                        } else {
                            //User is not the one who posted the comment
                            err = new Error('You are not authorized to update this comment.');
                            err.status = 403;
                            return next(err);
                        }
                    } else {
                        //Comment does not exist
                        err = new Error('Comment ' + req.params.commentId + ' not found ');
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Find the comment
        Comments.findById(req.params.commentId)
            .then(
                (comment) => {
                    if (comment) {
                        //Comment exists

                        //Check if the user editing is the author of this comment
                        if (req.user._id.equals(comment.author)) {
                            //Remove the comment with given id
                            Comments.findByIdAndRemove(req.params.commentId)
                                .then(
                                    (response) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        //Return the response
                                        res.json(response);
                                    },
                                    (err) => next(err)
                                )
                                .catch((err) => next(err));
                        } else {
                            //User is not the one who posted the comment
                            var err = new Error('You are not authorized to delete this comment.');
                            err.status = 403;
                            next(err);
                        }
                    } else {
                        //Comment does not exist
                        err = new Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

module.exports = commentRouter;
