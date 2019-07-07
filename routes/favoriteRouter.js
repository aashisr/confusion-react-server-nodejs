const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
//mongoose is used for mongoose methods like find, create, findById, etc
const mongoose = require('mongoose');

//Import models
const Favorites = require('../models/favorites');

//Declare FavoriteRouter as express router
const favoriteRouter = express.Router();

//Use body parser
favoriteRouter.use(bodyParser.json());

favoriteRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.statusCode = 200;
    })
    //Route to get all the favorite dishes of an authenticated user
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Get the favorites of the user
        Favorites.findOne({ user: req.user._id })
            //Populate user and dishes
            .populate('dishes')
            .populate('user')
            .then(
                (favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    //Route to post an array of dishes to favorite document
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Find if a user already has the favorite document, user id is req.user._id
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    //Favorite document already exists for this user
                    //Find, if the dishes sent in req.body already exists in favorite.dishes, check for all dishes
                    for (let i = 0; i < req.body.length; i++) {
                        //If the dish objectId does not exist in favorite.dishes
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            //Push the dish in req.body to the favorite.dishes
                            favorite.dishes.push(req.body[i]._id);
                        } else {
                            //Dish already exists in the user's favorites list
                            console.log('Dish with id ' + req.body[i]._id + ' already exists in favorites.');
                        }
                    }

                    //Save the favorite and return
                    favorite
                        .save(favorite)
                        .then(
                            (favorite) => {
                                //Find the saved favorite by id and return
                                Favorites.findById(favorite._id)
                                    .then(
                                        (favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        },
                                        (err) => next(err)
                                    )
                                    .catch((err) => next(err));
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err));
                } else {
                    //create new favorite document for the users
                    Favorites.create({ user: req.user._id })
                        .then(
                            (favorite) => {
                                //Add dishes objectIds
                                for (let i = 0; i < req.body.length; i++) {
                                    //Push the dish in req.body to the favorite.dishes
                                    favorite.dishes.push(req.body[i]._id);
                                    console.log('Pushed Dish id is ' + req.body[i]._id);
                                }

                                //Save the favorite, also populate the user and dishes
                                favorite
                                    .save(favorite)
                                    .then(
                                        (favorite) => {
                                            //Find the saved favorite by id and return
                                            Favorites.findById(favorite._id)
                                                .populate('user')
                                                .populate('dishes')
                                                .then(
                                                    (favorite) => {
                                                        res.statusCode = 200;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        res.json(favorite);
                                                    },
                                                    (err) => next(err)
                                                )
                                                .catch((err) => next(err));
                                        },
                                        (err) => next(err)
                                    )
                                    .catch((err) => next(err));
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //Delete the favorite document of this user and remove
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.statusCode = 200;
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(
                (favorites) => {
                    if (!favorites) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ exists: false, favorites: favorites });
                    } else {
                        // Check if the dish with given dishId exists in the list of favorites
                        if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                            // If dish does not exist in the list of favorites
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ exists: false, favorites: favorites });
                        } else {
                            // If dish exists in the list of favorites
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ exists: true, favorites: favorites });
                        }
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    //If the dish objectId does not exist in favorite.dishes
                    if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                        //Push the dish in req.body to the favorite.dishes
                        favorite.dishes.push(req.params.dishId);
                    } else {
                        //Dish already exists in the user's favorites list
                        err = new Error('Dish with id ' + req.params.dishId + ' already exists in favorites.');
                        err.status = 403;
                        return next(err);
                    }

                    //Save the favorite and return
                    favorite
                        .save(favorite)
                        .then(
                            (favorite) => {
                                //Find the saved favorite by id and return
                                Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(
                                        (favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        },
                                        (err) => next(err)
                                    )
                                    .catch((err) => next(err));
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err));
                } else {
                    //Create favorite for this user
                    //create new favorite document for the users
                    Favorites.create({ user: req.user._id })
                        .then(
                            (favorite) => {
                                //Add dish objectId from the url
                                favorite.dishes = req.params.dishId;

                                //Save the favorite
                                favorite
                                    .save(favorite)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(
                                        (favorite) => {
                                            //Find the saved favorite by id and return
                                            Favorites.findById(favorite._id)
                                                .then(
                                                    (favorite) => {
                                                        res.statusCode = 200;
                                                        res.setHeader('Content-Type', 'application/json');
                                                        res.json(favorite);
                                                    },
                                                    (err) => next(err)
                                                )
                                                .catch((err) => next(err));
                                        },
                                        (err) => next(err)
                                    )
                                    .catch((err) => next(err));
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    console.log(favorite.dishes);
                    var index = favorite.dishes.indexOf(req.params.dishId);
                    console.log('Index is ' + index);

                    if (index >= 0) {
                        //Splice (delete) one element starting from 'index'
                        favorite.dishes.splice(index, 1);

                        //Save the favorite
                        favorite
                            .save()
                            .then(
                                (favorite) => {
                                    Favorites.findById(favorite._id)
                                        .populate('user')
                                        .populate('dishes')
                                        .then((favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            //Return the dish with the given comment deleted as json
                                            res.json(favorite);
                                        });
                                },
                                (err) => next(err)
                            )
                            .catch((err) => next(err));
                    } else {
                        //Dish does not exist on favorites
                        err = new Error('Dish ' + req.params.dishId + ' not found in favorites of user ' + req.user._id + ' .');
                        err.status = 404;
                        return next(err);
                    }
                } else {
                    //Favorite does not exist
                    err = new Error('Favorites not found for user ' + req.user._id + ' .');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

//Export the favoriteRouter as a module
module.exports = favoriteRouter;
