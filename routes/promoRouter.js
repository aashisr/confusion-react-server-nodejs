//File for handling all routes of '/promotions' endpoint
//This is an mini express router, so we require all that was required in index.js

const express = require('express');
const bodyParser  = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

//Import promotions model and store it in a variable
const Promotions = require('../models/promotions');

//Declare promoRouter as express router
const promoRouter = express.Router();

//Make use of body parser
promoRouter.use(bodyParser.json());

//The endpoint is just / since this router will be mounted as /promotions in index.js

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.statusCode = 200;
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.find()
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(promotions);
            }, (err) => next(err))

            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                console.log('Promotion created \n', promotion);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation forbidden on /promotions');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.remove()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//ROUTE FOR /promotions/:promoId
promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => {
        res.statusCode = 200;
    })
    .get(cors.cors, (req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('POST operation forbidden on /promotions/' + req.params.promoId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set : req.body }, { new : true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                //Return the response as json
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//Export this route as a module
module.exports = promoRouter;