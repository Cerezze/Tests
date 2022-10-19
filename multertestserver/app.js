const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//After importing, Icreate a filStorage and fileFilter for multer
//as it says in documentation. Although I am new to multer
//and I have a feeling the error is either in the multer diskStorage
//or the fileFilter because it is either not set up correctly, or I made
//a stupid mistake that I cant quite see.

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE' );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//In app.post here, the error comes back as No image provided.
// I would like to fix this error

app.post("/userFeed/post", (req, res, next) => {
    if(!req.file){
        const error = new Error('NO image provided.');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const thumbnailTitle = req.body.ThumbnailTitle;

    console.log(imageUrl);
    console.log(thumbnailTitle);
});

app.listen(3001);