class Game{
    constructor(canvas, global){
        self = this;
        this.global = global;
        this.canvas = canvas;
        this.cards = [];

        this.drawCards();
    };

    handleNetwork(socket) {
        socket.on('playerJoined', function (playerName) {

        });

        socket.on('setInitData', function () {
            socket.emit('getAllCards');
            socket.on('setAllCards', function (data) {

                self.cards = [new Card(data[0].x, data[0].y, data[0].id, data[0].type)];

                for(let i = 1; i < data.length; i++){
                    self.cards.push(new Card(data[i].x, data[i].y, data[i].id, data[i].type));
                }
            });
        });
        // This is where you receive all socket messages
    };

    handleLogic() {
        // This is where you update your game logic
    };

    handleGraphics(canvas) {
        // This is where you draw everything
        this.drawCards();
    };

    drawCards(){
        for(let i in this.cards){
            this.cards[i].draw();
        }
    }
}
