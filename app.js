const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const server = app.listen(port, (error) => {
    if (error) {
        console.log('Something went wrong');
    } else {
        console.log('Server running on port', server.address().port);
    }
});