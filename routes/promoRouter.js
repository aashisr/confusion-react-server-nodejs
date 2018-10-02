//File for handling all routes of '/promotions' endpoint
//This is an mini express router, so we require all that was required in index.js

const express = require('express');

const bodyParser  = require('body-parser');

//Declare promoRouter as express router
const promoRouter = express.Router();

//Make use of body parser
promoRouter.use(bodyParser.json());

//The endpoint is just / since this router will be mounted as /promotions in index.js

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        //Call the next function so that it will continue to look for additional promotions endpoint
        next();
    })
    .get((req, res, next) => {
        res.end('Getting all the promotions');
    })
    .post((req, res, next) => {
        res.end('Add promotion: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation forbidden on /promotions');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the promotions');
    });


//ROUTE FOR /promotions/:promoId
promoRouter.route('/:promoId')
    .get((req, res, next) => {
        res.end('Get the details of promotion ' + req.params.promoId);
    })
    .post((req, res, next) => {
        res.statusCode = 403
        res.end('POST operation forbidden on /promotions/' + req.params.promoId);
    })
    .put((req, res, next) => {
        //res.write adds line to the reply message
        res.write('Updating the promotion: ' + req.params.promoId + '\n');
        res.end('Update promotion: ' + req.body.name + ' with details '+ req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting promotion: ' + req.params.promoId);
    });

//Export this route as a module
module.exports = promoRouter;