let express = require('express');
let app     = express();
let http    = require('http').Server(app);
let io      = require('socket.io')(http);

let config  = require('./config.json');

let Field = require('./field.js');
let PlayerManager = require('./playermanager.js');

class Server{
    constructor(){
        let self = this;

        this.playerManager = new PlayerManager(this);

        io.on('connection', function (socket) {
            console.log("Somebody connected!");

            socket.on('setPlayerName', function (playerName) {
                self.playerManager.checkPlayerName(playerName, socket);
            });

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

    sendPlayerNameValid(value, socket){
        socket.emit('playerValid', value);
    }
}

let server = new Server();
let field = new Field(server);


app.use(express.static(__dirname + '/../client'));