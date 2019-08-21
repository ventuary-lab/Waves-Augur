// const fs = require('fs');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3({
    accessKeyId: process.env.HDRIVE_S3_ACCESS_KEY || "778",
    secretAccessKey: process.env.HDRIVE_S3_SECRET_KEY || "8783"
});
const upload = require('./node/upload');

const S3_UPLOAD_ROOT = 'uploads';
const myBucket = process.env.HDRIVE_S3_BUCKET || 'alpha-ventuary-dao';

module.exports = (app) => {
    app.put('/upload', upload.middleware.single('avatar'), async (req, res) => {
        const fileName = req.file.filename;

        try {
            const shouldCropped = req.query.crop === 'true';
            let img;

            if (shouldCropped) {
                img = await sharp(upload.path.full + '/' + fileName)
                    .resize(300, 300)
                    .toBuffer();
            } else {
                img = await sharp(upload.path.full + '/' + fileName).toBuffer();
            }

            const params = {
                Bucket: myBucket,
                Key: `${S3_UPLOAD_ROOT}/${fileName}`,
                Body: img
            };

            s3.upload(params, function(err, data) {
                if (err) {
                    res.send({ err });
                } else {
                    res.send({ 
                        path: data.Location
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
};
