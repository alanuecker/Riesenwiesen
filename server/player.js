module.exports = class Player{

    constructor(playerName, playerId){
        this.playerName = playerName;
        this.playerActive = true;
        this.playerScore = 0;
        this.playerId = playerId;

        this.selectedCardId = 0;
        this.cardRotation = 0;
    }

    addPoint(value){
        this.playerScore = this.playerScore + value;
    }

    getPlayerId() {
        return this.playerId;
    }

    getPlayerScore() {
        return this.playerScore;
    }

    getPlayerName(){
        return this.playerName;
    }

    getPlayerActive(){
        return this.playerActive;
    }

    setPlayerId(value) {
        this.playerId = value;
    }

    setPlayerScore(value) {
        this.playerScore = value;
    }

    setPlayerName(value){
        this.playerName = value;
    }

    setPlayerActive(value){
        this.playerActive = value;
    }
};