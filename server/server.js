let express = require('express');
let app     = express();
let http    = require('http').Server(app);
let io      = require('socket.io')(http);

let config  = require('./config.json');

let Field = require('./field.js');
let Card = require('./card.js');

class Server{
    constructor(){
        io.on('connection', function (socket) {
            console.log("Somebody connected!");
            //send connected player field data
            socket.emit('setAllCards', field.getCards());

            //player selected a card
            socket.on('setSelectedCard', function (id) {
                field.setCardType(id);
            });
        });

        let serverPort = process.env.PORT || config.port;
        http.listen(serverPort, function() {
            console.log("Server is listening on port " + serverPort);
        });
    }

    //send new card to all players
    sendAddCard(card) {
        io.emit('addCard', card);
    }


    //update a card for all players
    sendUpdateCard(card) {
        io.emit('updateCard', card);
    }
}

let server = new Server();
let field = new Field(server);


app.use(express.static(__dirname + '/../client'));