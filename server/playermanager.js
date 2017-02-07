let Player = require('./player.js');

module.exports = class PlayerManager{
    constructor(gameServer){
        this.playerActive = [];
        this.playerList = [];
        this.gameServer = gameServer;
    }

    addNewPlayer(playerName){
        this.playerList.push(new Player(playerName, this.playerList.length));
        this.playerActive.push(this.playerList[this.playerList.length - 1]);

        for (let obj of this.playerActive) {
            console.log("added player " + obj);
        }
    }

    playerLeft(playerName){
        console.log("player left " + playerName + " active players " + this.playerActive.length);
        if(this.playerActive.length > 1)
            this.playerActive = this.playerActive.filter(function (n) {return n.getPlayerName() !== playerName;});
        else
            this.playerActive.pop();

        this.setPlayerActiveValue(playerName, false);

        for (let obj of this.playerActive) {
            console.log("playerLeft " + obj);
        }
    }

    playerJoined(playerName){
        console.log("player joined");
        for(let player of this.playerList){
            if(player.getPlayerName() === playerName){
                player.setPlayerActive(true);
                this.playerActive.push(player);
            }
        }

        for (let obj of this.playerActive) {
            console.log("playerJoined " + obj);
        }
    }

    checkPlayerName(playerName, socket){
        if(this.playerList.length == 0){
            this.addNewPlayer(playerName);
            this.gameServer.sendPlayerNameValid(true, socket);
            console.log('added first player');
        }else {
            let playerNotInList = false;

            for(let i in this.playerList){
                console.log("player names in list: " + this.playerList[i].getPlayerName());

                if(playerName == this.playerList[i].getPlayerName()){
                    if(!this.playerList[i].getPlayerActive()){
                        this.playerJoined(playerName);
                        this.gameServer.sendPlayerNameValid(true, socket);
                        console.log("player name in list and not active " + playerName);
                        playerNotInList = false;
                    }
                    else{
                        this.gameServer.sendPlayerNameValid(false, socket);
                        console.log('player name in list but active');
                        playerNotInList = false;
                    }
                }else{
                    playerNotInList = true;
                }
            }

            if(playerNotInList){
                this.addNewPlayer(playerName);
                this.gameServer.sendPlayerNameValid(true, socket);
                console.log('player not in list ' + playerName);
            }
        }
    }

    getLastPlayer(){
        if(this.playerActive.length > 0)
            return this.playerActive[this.playerActive.length - 1];
    }

    setPlayerActiveValue(playerName, value){
        for (let player of this.playerList) {
            if(playerName === player.getPlayerName()){
                player.setPlayerActive(value);
            }
        }
    }
};
