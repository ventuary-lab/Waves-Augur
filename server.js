const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

let port = process.env.PORT || 5000;
const httpServer = app.listen(port, () => {
    console.log(__dirname); // eslint-disable-line no-console
    console.log('Listening Port ' + port); // eslint-disable-line no-console
});
require('./aws-upload')(app);

if (process.env.DAPP) {
    require('./node/contract_legacy');
}
require('./node/contract')(app, httpServer);

app.use(function(req, res, next) {
    if (/^\/\?invitation=/.test(req.url)) {
        res.redirect('/projects/feed?invitation=' + req.query.invitation);
        return;
    }

    if (req.url === '/') {
        res.sendFile('index.html', { root : __dirname + '/landing'});
        return;
    }

    if (req.header('x-forwarded-proto') == 'http') {

        res.redirect(301, 'https://' + req.headers.host + req.url);
        return;
    }
    next();
});
app.use(express.static(__dirname + '/landing'));
app.use(express.static(__dirname + '/dist'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});

