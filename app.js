require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const cors = require('cors');
app.use(cors({ origin: 'http://interval-champions.herokuapp.com'}));

const scoreRoute = require('./routes/score.js');
app.use(scoreRoute.router);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', (req, res) => {
    res.sendStatus(404);
});

const server = app.listen(port, (error) => {
    if (error) {
        console.log('Something went wrong');
    } else {
        console.log('Server running on port', server.address().port);
    }
});