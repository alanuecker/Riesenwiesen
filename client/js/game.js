class Game extends createjs.Container{
    constructor(socket){
        super();

        self = this;
        this.socket = socket;
        this.cards = [];
        this.field = new createjs.Container();
        this.playerList = new PlayerList();
        this.drawCards();

        content.addChild(this.field, this.playerList);

        function keyPressed(event) {

            switch(event.keyCode){
                case global.KEY_RIGHT:
                    global.offsetX -= 100;
                    break;
                case global.KEY_LEFT:
                    global.offsetX += 100;
                    break;
                case global.KEY_UP:
                    global.offsetY += 100;
                    break;
                case global.KEY_DOWN:
                    global.offsetY -= 100;
                    break;
            }
        }

        document.onkeydown = keyPressed;
    };

    handleNetwork() {
        this.socket.on('playerValid', function (playerValid) {
            console.log("player name valid " + playerValid);
            checkedNick(playerValid);
        });
        
        // This is where you receive all socket messages
        this.socket.on('playerJoinedGame', function (data) {
            self.playerList.addPlayer(data.playerName, data.playerScore);
        });

        this.socket.on('playerLeftGame', function (playerName) {
            self.playerList.removePlayer(playerName);
        });

        //get all cards from sever and create them
        this.socket.on('setAllCards', function (data) {
            self.cards = [];
            let card = new Card(data[0].xPosGrid, data[0].yPosGrid, data[0].cardId, data[0].type);
            self.cards = [card];
            content.addChild(card);

            for(let i = 1; i < data.length; i++){
                self.addCard(data[i].xPosGrid, data[i].yPosGrid, data[i].cardId, data[i].type);
            }
        });

        this.socket.on('updateCard', function (data) {
            self.cards[data.cardId].setType(data.type);
            self.drawCards();
        });

        this.socket.on('addCard', function (data) {
            self.addCard(data.xPosGrid, data.yPosGrid, data.cardId, data.type);
        });
    };

    handleLogic() {
        // This is where you update your game logic

    };

    handleGraphics() {
        // This is where you refreshPosition everything
        this.drawCards();
        stage.update();
    };

    drawCards(){
        for(let i in this.cards){
            this.cards[i].refreshPosition();
        }
    }

    //player selected a card and send that data to server
    sendSelectedCard(id){
        this.socket.emit('setSelectedCard', id);
    }

    //player confirmed card placement
    sendSetCard(id){
        this.socket.emit('setCard', id);
    }

    sendPlayerName(playerName){
        console.log("send player name " + playerName);
        this.socket.emit('setPlayerName', playerName);
    }

    //create a new card and add it
    addCard(xPosGrid, yPosGrid, cardId, type){
        let card = new Card(xPosGrid, yPosGrid, cardId, type);
        this.cards.push(card);
        this.field.addChild(card);
    }
}
createjs.promote(Game, "Container");