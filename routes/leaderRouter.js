//File for handling all routes of '/leaders' endpoint
//This is an mini express router, so we require all that was required in index.js

const express = require('express');

const bodyParser  = require('body-parser');

//Declare leaderRouter as express router
const leaderRouter = express.Router();

//Make use of body parser
leaderRouter.use(bodyParser.json());

//The endpoint is just / since this router will be mounted as /leaders in index.js

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        //Call the next function so that it will continue to look for additional leaders endpoint
        next();
    })
    .get((req, res, next) => {
        res.end('Getting all the leaders');
    })
    .post((req, res, next) => {
        res.end('Add leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end('PUT operation forbidden on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders');
    });


//ROUTE FOR /leaders/:leaderId
leaderRouter.route('/:leaderId')
    .get((req, res, next) => {
        res.end('Get the details of leader ' + req.params.leaderId);
    })
    .post((req, res, next) => {
        res.statusCode = 403
        res.end('POST operation forbidden on /leaders/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        //res.write adds line to the reply message
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Update leader: ' + req.body.name + ' with details '+ req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader: ' + req.params.leaderId);
    });

//Export this route as a module
module.exports = leaderRouter;