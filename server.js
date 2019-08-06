// This is server used for Heroku app deployment
// See https://alpha-ventuary-dao.herokuapp.com
const express = require('express');
const sharp = require('sharp');
const upload = require('./node/upload');
const app = express();


app.use(function(req, res, next) {
    if (req.header('x-forwarded-proto') == 'http') {
        res.redirect(301, 'https://' + req.headers.host + req.url);
        return;
    }
    next();
});
app.use(express.static('/data'));
app.use(express.static(__dirname + '/dist'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});


app.put('/upload', upload.middleware.single('avatar'), (request, response) => {

    const fileName = request.file.filename;

    sharp(upload.path.full + '/' + fileName)
        .resize(300, 300)
        .toFile(upload.path.full + '/thumbnail.' + fileName)
        .then(info => {
            response.send(JSON.stringify({
                path: upload.path.short + '/thumbnail.' + fileName
            }));
        })
        .catch(err => {
            // console.log(err);
        });
});


let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(__dirname); // eslint-disable-line no-console
    console.log('Listening Port ' + port); // eslint-disable-line no-console
});

//require('./node/contract');

