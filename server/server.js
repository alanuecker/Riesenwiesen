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
            socket.playerName = "";
            let socketSelectedCard = -1;
            let socketLastSelectedCard = -1;
            let socketCardType = 0;
            let socketCardRotation = 0;

            function resetSelectedCard() {
                socketLastSelectedCard = -1;
                socketSelectedCard = -1;
            }

            //get a new card type for the player to place
            socket.newCardType = function () {
                let old = socketCardType;

                socketCardType = Math.floor(Math.random() * (field.numberOfCardTypes - 1)) + 1;

                //prevent same card as old
                if(old == socketCardType){
                    socket.newCardType();
                    return;
                }

                socket.emit('newPlaceCardType', socketCardType);
                field.predictNotPossiblePositions(socketCardType, socket);

                if(socketSelectedCard > 0)
                    field.resetCardType(socketSelectedCard);
            };
            socket.newCardType();

            socket.on('setPlayerName', function (playerName) {
                self.playerManager.checkPlayerName(playerName, socket);
                socket.playerName = playerName;
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
                    field.setCardRotation(socketSelectedCard, socketCardRotation);
                    self.sendPlaceCardRotation(socketCardRotation, socket);
                }
            });

            //player rotated a card
            socket.on('changeCardRotation', function () {
                socketCardRotation++;
                if(socketCardRotation > 3)
                    socketCardRotation = 0;

                if(socketSelectedCard > 0){
                    field.setCardRotation(socketSelectedCard, socketCardRotation);
                    self.sendPlaceCardRotation(socketCardRotation, socket);
                }
            });

            //player applied a card
            socket.on('applyCard', function () {
                field.checkPlacement(socketSelectedCard, socket);
                resetSelectedCard();
            });

            //player reset a card
            socket.on('resetCard', function () {
                field.resetCardType(socketSelectedCard);
                resetSelectedCard();
            });

            //player want's new card
            socket.on('newCard', function () {
                socket.newCardType();
                resetSelectedCard();
            });

            //player left the game
            socket.on('disconnect', function () {
                self.playerManager.playerLeft(socket.playerName);
                io.emit('playerLeftGame', socket.playerName);
                field.resetCardType(socketSelectedCard);
                resetSelectedCard();
                console.log("player left " + socket.playerName);
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
        this.playerManager.addPoint(socket.playerName);
        socket.emit('cardValid');
    }

    sendPositionPrediction(possibleCards, socket){
        socket.emit('positionPrediction', possibleCards);
    }

    sendPlaceCardRotation(rotation, socket){
        socket.emit('placeCardRotation', rotation);
    }
}

let server = new Server();
let field = new Field(server);


app.use(express.static(__dirname + '/../client'));