class Game extends createjs.Container{
    constructor(socket){
        super();

        self = this;
        this.socket = socket;
        this.cards = [];
        this.field = new createjs.Container();
        this.playerList = new PlayerList();
        this.drawCards();

        this.init();
    };

    init(){
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

        let applyButton = new Button(50, 25, 15, 300, "#EEEEEE", "#CCCCCC", "#DDDDDD", "black", "Apply", 15, "black", function () {self.socket.emit('applyCard');});
        let resetButton = new Button(50, 25, 100, 300, "#EEEEEE", "#CCCCCC", "#DDDDDD", "black", "Reset", 15, "black", function () {self.socket.emit('resetCard');});
        let newCardButton = new Button(50, 25, 185, 300, "#EEEEEE", "#CCCCCC", "#DDDDDD", "black", "New Card", 15, "black", function () {self.socket.emit('newCard');});

        content.addChild(this.field, this.playerList, applyButton, resetButton, newCardButton);
    }

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
            let card = new Card(data[0].xPosGrid, data[0].yPosGrid, data[0].cardId, data[0].cardType, data[0].cardRotation);
            self.cards = [card];
            content.addChild(card);

            for(let i = 1; i < data.length; i++){
                self.addCard(data[i].xPosGrid, data[i].yPosGrid, data[i].cardId, data[i].cardType, data[i].cardRotation);
            }
        });

        //update card values from server
        this.socket.on('updateCard', function (data) {
            self.cards[data.cardId].setType(data.cardType);
            self.cards[data.cardId].setRotation(data.cardRotation);
            self.cards[data.cardId].setCardPlaced(data.cardPlaced);
            self.drawCards();
        });

        //update player values from server
        this.socket.on('updatePlayer', function (data) {
            self.playerList.setPlayerScore(data);
        });

        //add a card to the field
        this.socket.on('addCard', function (data) {
            self.addCard(data.xPosGrid, data.yPosGrid, data.cardId, data.cardType, data.cardRotation);
        });

        //card is valid
        this.socket.on('cardValid', function () {
           console.log("card Valid");
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
        this.socket.emit('changeCardType', id);
    }

    sendPlayerName(playerName){
        console.log("send player name " + playerName);
        this.socket.emit('setPlayerName', playerName);
    }

    sendRotateCard(id){
        this.socket.emit('changeCardRotation', id);
    }

    //create a new card and add it
    addCard(xPosGrid, yPosGrid, cardId, type, rotation){
        let card = new Card(xPosGrid, yPosGrid, cardId, type, rotation);
        this.cards.push(card);
        this.field.addChild(card);
    }
}
createjs.promote(Game, "Container");