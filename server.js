const express = require('express');
const addGtagHelper = require('./add-gtag');
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

app.use(async function(req, res, next) {
    if (/^\/\?invitation=/.test(req.url)) {
        res.redirect('/projects/feed?invitation=' + req.query.invitation);
        return;
    }

    if (req.url === '/') {
        await gTagWrapper(res, __dirname + 'landing/index.html');
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

async function gTagWrapper (res, route) {
    const html = await addGtagHelper(route);
    res.send(html);
}

app.get('/*', async (req, res) => {
    await gTagWrapper(res, __dirname + 'dist/index.html');
});

