// This is server used for Heroku app deployment
// See https://alpha-ventuary-dao.herokuapp.com
const express = require('express');
const sharp = require('sharp');
const upload = require('./node/upload');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});


app.put('/upload', upload.middleware.single('avatar'), (request, response) => {

    const fileName = request.file.filename;

    sharp(upload.path.full + '/' + fileName)
        .resize(300, 300)
        .toFile(upload.path.full + '/mini.' + fileName)
        .then(info => {
            // console.log(info);
        })
        .catch(err => {
            // console.log(err);
        });
    response.send(JSON.stringify({
        path: upload.path.short + '/' + fileName
    }));
});


let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(__dirname); // eslint-disable-line no-console
    console.log('Listening Port ' + port); // eslint-disable-line no-console
});

require('./node/index');

