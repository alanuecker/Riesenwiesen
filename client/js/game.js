class Game{
    constructor(canvas, global){
        this.global = global;
        this.canvas = canvas;
        this.cards = [];

        this.drawCards();
    };

    handleNetwork(socket) {
        socket.on('playerJoined', function (playerName) {
            this.getCardsFromServer(socket);
        });
        // This is where you receive all socket messages
    };

    handleLogic() {
        // This is where you update your game logic
    };

    handleGraphics(canvas) {
        // This is where you draw everything

    };

    drawCards(){
        for(let i in this.cards){
            this.cards[i].draw();
        }
    }

    getCardsFromServer(socket){
        socket.emit('getAllCards');
        socket.on('setAllCards', function (data) {
            console.log(data);
        });
    }
}
