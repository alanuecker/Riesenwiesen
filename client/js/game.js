class Game{
    constructor(){
        self = this;
        this.cards = [];

        this.drawCards();
    };

    handleNetwork(socket) {
        socket.on('playerJoined', function (playerName) {

        });

        socket.on('setInitData', function () {
            socket.emit('getAllCards');
            socket.on('setAllCards', function (data) {

                let card = new Card(data[0].xPosGrid, data[0].yPosGrid, data[0].cardId, data[0].type);
                self.cards = [card];
                content.addChild(card);

                for(let i = 1; i < data.length; i++){
                    card = new Card(data[i].xPosGrid, data[i].yPosGrid, data[i].cardId, data[i].type);
                    self.cards.push(card);
                    content.addChild(card);
                }
            });
        });
        // This is where you receive all socket messages
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
}