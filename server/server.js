let express = require('express');
let app     = express();
let http    = require('http').Server(app);
let io      = require('socket.io')(http);

let config  = require('./config.json');

let Field = require('./field.js');
let Card = require('./card.js');

let field = new Field();

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
    console.log("Somebody connected!");
    socket.on('getAllCards', function () {
       socket.emit('setAllCards', field.getCards());
    });
    // Write your code here
});

let serverPort = process.env.PORT || config.port;
    http.listen(serverPort, function() {
    console.log("Server is listening on port " + serverPort);
});
