class Game{
    constructor(canvas, global){
        this.global = global;
        this.drawRectangle(canvas);
    };

    handleNetwork(socket) {
        console.log('Game connection process here');
        console.log(socket);

        socket.on('hello', function () {
            console.log("Hello");
            socket.emit('sendData');
        });

        socket.on('data', function (data) {
            console.log(data.data);
        });

        socket.on('playerJoined', function (playerName) {

        });
        // This is where you receive all socket messages
    };

    handleLogic() {
        // This is where you update your game logic
    };

    handleGraphics(canvas) {
        // This is where you draw everything

    };

    drawRectangle(canvas) {
        canvas.fillStyle = "green";
        canvas.fillRect(10, 10, 100, 100);
    }
}
