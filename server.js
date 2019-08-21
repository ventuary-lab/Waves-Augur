// This is server used for Heroku app deployment
// See https://alpha-ventuary-dao.herokuapp.com
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(function(req, res, next) {
    if (req.header('x-forwarded-proto') == 'http') {
        res.redirect(301, 'https://' + req.headers.host + req.url);
        return;
    }
    next();
});
app.use(express.static('/data'));
app.use(express.static(__dirname + '/dist'));

require('./aws-upload')(app);

app.get('/get-dapp-info', (req, res) => {
    res.send({
        DAPP: process.env.DAPP,
        APP_DAPP_NETWORK: process.env.APP_DAPP_NETWORK,
        NODE_URL: process.env.NODE_URL,
        APP_ADMIN_ADDRESS: process.env.APP_ADMIN_ADDRESS
    });
});

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});

let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(__dirname); // eslint-disable-line no-console
    console.log('Listening Port ' + port, process.env.DAPP, process.env.NODE_URL); // eslint-disable-line no-console
});

// require('./node/contract');

