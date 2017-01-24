class Game{
    constructor(global){
        self = this;
        this.global = global;
        this.cards = [];

        this.drawCards();
    };

    handleNetwork(socket) {
        socket.on('playerJoined', function (playerName) {

        });

        socket.on('setInitData', function () {
            socket.emit('getAllCards');
            socket.on('setAllCards', function (data) {

                self.cards = [new Card(data[0].xPos, data[0].yPos, data[0].id, data[0].type)];

                for(let i = 1; i < data.length; i++){
                    self.cards.push(new Card(data[i].xPos, data[i].yPos, data[i].id, data[i].type));
                }
            });
        });
        // This is where you receive all socket messages
    };

    handleLogic() {
        // This is where you update your game logic
    };

    handleGraphics() {
        // This is where you draw everything
        this.drawCards();
        stage.update();
    };

    drawCards(){
        for(let i in this.cards){
            this.cards[i].draw();
        }
    }
}
