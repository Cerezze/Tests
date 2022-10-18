const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
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

//app.use('/userFeed', userFeedRoutes);

app.use("/userFeed/post", (req, res, next) => {
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