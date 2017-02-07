class PlayerList extends createjs.Container{
    constructor(){
        super();

        this.playerList = [];
    }

    addPlayer(playerName, playerScore){
        let playerElement = new PlayerElement(playerName, playerScore, this.playerList.length * 25);
        this.playerList.push(playerElement);
        this.addChild(playerElement);
    }

    removePlayer(playerName){
        let self = this;

        this.playerList = this.playerList.filter(function (n) {
            if(n.getPlayerName() !== playerName){
                return n.getPlayerName() !== playerName;
            }else{
                self.removeChild(n);
            }
        });

        for (let i in this.playerList) {
            this.playerList[i].movePosition(i * 25);
        }
    }
}
createjs.promote(PlayerList, "Container");

class PlayerElement extends createjs.Container{
    constructor(playerName, playerScore, position){
        super();

        this.playerName = playerName;
        this.playerScore = playerScore;

        this.playerText = new createjs.Text(this.playerName, "18px Arial", "black");
        this.playerText.yPos = position;

        this.scoreText = new createjs.Text(this.playerScore, "18px Arial", "black");
        this.scoreText.yPos = position;
        this.scoreText.xPos = 100;

        this.addChild(this.playerText, this.scoreText);
    }

    movePosition(position){
        this.playerText.yPos = position;
        this.scoreText.yPos = position;
    }

    getPlayerName(){
        return this.playerName;
    }

    getPlayerScore(){
        return this.playerScore;
    }

    setPlayernName(playerName){
        this.playerName = playerName;
    }

    setPlayerScore(value){
        this.playerScore = value;
        this.scoreText = value;
    }
}
createjs.promote(PlayerElement, "Container");