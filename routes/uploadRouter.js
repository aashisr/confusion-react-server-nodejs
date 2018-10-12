const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
//Require multer, node middleware for handling multipart/form-data (file upload)
const multer = require('multer');

//Set up multer to enable uploading file
//Define the storage for files
const storage = multer.diskStorage({
    //Req - request object, file - object that contains information of file processed by multer, cb - callback function
    destination: (req, file, cb) => {
        //null - error, and other parameter is destination for the file to be stored
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        //Set the name of the file to be the original name as submitted
        cb(null, file.originalname);
    }
});

//Specify which kinds of files to accept for the upload
const imageFileFilter = (req, file, cb) => {
    //Check the file type with regular expressions (regex)
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        //If file is not an image file with above extensions
        return cb(new Error('You can upload only image files!'), false);
    }
    else {
        //Error is null and the file is image type
        cb(null, true);
    }
};

//Configure multer
const upload = multer({ storage: storage, fileFilter: imageFileFilter });


//Declare uploadRouter as express router
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());


//Only post method for the upload router
uploadRouter.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET method not allowed on /imageUpload');
    })
    //Make use of upload to support upload of single file at a time with the name of the form input field as parameter
    //upload also takes care of handling the errors if any
    .post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //Pass the req.file to the client, contains the path to the file
        res.json(req.file);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT method not allowed on /imageUpload');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE method not allowed on /imageUpload');
    });

//Export the uploadRouter module
module.exports = uploadRouter;