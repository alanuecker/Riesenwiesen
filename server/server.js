let express = require('express');
let app     = express();
let http    = require('http').Server(app);
let io      = require('socket.io')(http);

let config  = require('./config.json');

let data = {data: "test"};

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
    console.log("Somebody connected!");

    socket.emit('hello');

    socket.on('sendData', function () {
       socket.emit('data', data);
    });
    // Write your code here
});

let serverPort = process.env.PORT || config.port;
    http.listen(serverPort, function() {
    console.log("Server is listening on port " + serverPort);
});
