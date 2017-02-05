class Game extends createjs.Container{
    constructor(socket){
        super();

        self = this;
        this.cards = [];
        this.field = new createjs.Container();
        this.drawCards();

        content.addChild(this.field);

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

    handleNetwork(socket) {
        this.socket = socket;

        // This is where you receive all socket messages
        this.socket.on('playerJoined', function (playerName) {

        });

        //get all cards from sever and create them
        self.socket.on('setAllCards', function (data) {

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

    //create a new card and add it
    addCard(xPosGrid, yPosGrid, cardId, type){
        let card = new Card(xPosGrid, yPosGrid, cardId, type);
        this.cards.push(card);
        this.field.addChild(card);
    }
}
createjs.promote(Game, "Container");