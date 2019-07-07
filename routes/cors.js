const express = require('express');
const cors = require('cors');
const app = express();

//Whiltelist is all the origins server is willing to accept
const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:3001'];

//Configure cors options in a function
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    //If the incoming request header does not contain origin field in the whitelist
    //Origin configures the Access-Control-Allow-Origin CORS header
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        //If the incoming request belongs to one of the while listed origin, enable the requested origin in CORS request
        corsOptions = { origin: true };
    }
    //If req.header('Origin') is not in the white list
    else {
        //Access-Control-Allow-Origin will not be returned, i.e CORS will be disabled for this request
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

//Cors will reply back with Access-Control-Allow-Origin with wildcard *
//Ok to accept in GET requests
exports.cors = cors();

//Apply cors with specific options to a particular route
exports.corsWithOptions = cors(corsOptionsDelegate);
