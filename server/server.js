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
            let socketPlayerName = "";
            let socketSelectedCard = -1;
            let socketLastSelectedCard = -1;
            let socketCardType = 0;

            //get a new card type for the player to place
            socket.newCardType = function () {
                socketCardType = Math.floor(Math.random() * (6 - 1 +1)) + 1;
                socket.emit('newPlaceCardType', socketCardType);
            };
            socket.newCardType();

            socket.on('setPlayerName', function (playerName) {
                self.playerManager.checkPlayerName(playerName, socket);
                socketPlayerName = playerName;
            });

            //send connected player field data
            socket.emit('setAllCards', field.getCards());

            //player changed a cards type
            socket.on('changeCardType', function (id) {
                if(id > 0){
                    if(socketSelectedCard != id){
                        socketLastSelectedCard = socketSelectedCard;
                        field.resetCardType(socketLastSelectedCard);
                    }
                    field.setCardType(id, socketCardType);
                    socketSelectedCard = id;
                }
            });

            //player rotated a card
            socket.on('changeCardRotation', function (id) {
                if(id == socketSelectedCard)
                    field.setCardRotation(id);
            });

            //player applied a card
            socket.on('applyCard', function () {
                field.checkPlacement(socketSelectedCard, socket);
            });

            //player reset a card
            socket.on('resetCard', function () {
                field.resetCardType(socketSelectedCard);
                socketLastSelectedCard = -1;
                socketSelectedCard = -1;
            });

            //player want's new card
            socket.on('newCard', function () {
                socketCardType = socket.newCardType();
            });

            //player left the game
            socket.on('disconnect', function () {
                self.playerManager.playerLeft(socketPlayerName);
                io.emit('playerLeftGame', socketPlayerName);
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

        if(value == true){
            //send active player to new client
            for(let i = 0; i < this.playerManager.getPlayerActive().length - 1; i++){
                socket.emit('playerJoinedGame', this.playerManager.getPlayerActive()[i]);
            }
            //tell all clients that new player has joined the game
            io.emit('playerJoinedGame', this.playerManager.getLastPlayer());
        }
    }

    sendUpdatePlayer(player){
        io.emit('updatePlayer', player);
    }

    sendCardValid(socket){
        socket.emit('cardValid');
    }

    sendPositionPrediction(possibleCards, socket){
        socket.emit('positionPrediction', possibleCards);
    }
}

let server = new Server();
let field = new Field(server);


app.use(express.static(__dirname + '/../client'));