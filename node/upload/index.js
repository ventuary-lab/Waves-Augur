const fs = require('fs');
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const express = require('express');
const sharp = require('sharp');

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

module.exports = app => {
    app.put('/upload', multer({ storage: storage }).single('avatar'), (request, response) => {
        const fileName = request.file.filename;
        if (request.query.crop === 'true') {
            sharp(uploadPath.full + '/' + fileName)
                .resize(300, 300)
                .toFile(uploadPath.full + '/thumbnail.' + fileName)
                .then(info => {
                    response.send(JSON.stringify({
                        path: uploadPath.short + '/thumbnail.' + fileName
                    }));
                })
                .catch(err => {
                    // console.log(err);
                });
        } else {
            response.send(JSON.stringify({
                path: uploadPath.short  + '/' + fileName
            }));
        }
    });
    app.use(express.static('/data'));
};
