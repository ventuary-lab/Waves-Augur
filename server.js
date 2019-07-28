// This is server used for Heroku app deployment
// See https://alpha-ventuary-dao.herokuapp.com
const express = require('express');
const app = express();


// app.use(function(req, res, next) {
//     if(req.protocol === 'http'){
//         res.redirect("https://" + req.headers.host + req.url);
//     } else {
//         next();
//     }
// });
app.use(express.static(__dirname + '/dist'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : __dirname + '/dist'});
});
let port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(__dirname);
    console.log("Listening Port " + port);
});


require('./node/index');
