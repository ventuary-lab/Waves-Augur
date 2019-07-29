// This is server used for Heroku app deployment
// See https://alpha-ventuary-dao.herokuapp.com
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const uuidv1 = require('uuid/v1');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});


//////file uploads
const uploadsPath = {
    full: __dirname + '/dist/uploads',
    short: '/uploads',
};

if (!fs.existsSync(uploadsPath.full)) {
    fs.mkdirSync(uploadsPath.full);
}

const getFileFormat = (fileName) => {
    return fileName.match(/\.\w+$/i)[0];
};

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadsPath.full);
    },
    filename: (request, file, cb) => {
        cb(null, uuidv1() + getFileFormat(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.put('/upload', upload.single('avatar'), (request, response) => {

    const fileName = request.file.filename;

    sharp(uploadsPath.full + '/' + fileName)
        .resize(300, 300)
        .toFile(uploadsPath.full + '/mini.' + fileName)
        .then(info => {
            console.log(info);
        })
        .catch(err => {
            console.log(err);
        });
    response.send(uploadsPath.short + '/' + fileName);
});
//////


let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(__dirname);
    console.log("Listening Port " + port);
});

// require('./node/upload');
require('./node/index');

