const fs = require('fs');
const multer = require('multer');
const uuidv1 = require('uuid/v1');

const uploadPath = {
    full: '/data/uploads',
    short: '/uploads',
};

if (!fs.existsSync(uploadPath.full)) {
    (async () => {
        await fs.mkdir(uploadPath.full, { recursive: true }, err => {
            if (err) {
                throw err;
            }
        });
    })();
};

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
