const path = require('path')
const fs = require('fs');
const multer = require('multer');
const uuidv1 = require('uuid/v1');

const uploadPath = {
    full: path.join(__dirname, '../dist/uploads'),
    short: '/uploads',
};

if (!fs.existsSync(uploadPath.full)) {
    fs.mkdirSync(uploadPath.full);
}

const getFileFormat = (fileName) => {
    return fileName.match(/\.\w+$/i)[0];
};

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadPath.full);
    },
    filename: (request, file, cb) => {
        cb(null, uuidv1() + getFileFormat(file.originalname));
    }
});

const middleware = multer({ storage: storage });


module.exports.path = uploadPath;
module.exports.middleware = middleware;
