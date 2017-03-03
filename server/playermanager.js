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
    }

    playerLeft(playerName){
        if(this.playerActive.length > 1)
            this.playerActive = this.playerActive.filter(function (n) {return n.getPlayerName() !== playerName;});
        else
            this.playerActive.pop();
        this.setPlayerActiveValue(playerName, false);
    }

    playerJoined(playerName){
        for(let player of this.playerList){
            if(player.getPlayerName() === playerName){
                player.setPlayerActive(true);
                this.playerActive.push(player);
            }
        }
    }

    checkPlayerName(playerName, socket){
        if(this.playerList.length == 0){
            this.addNewPlayer(playerName);
            this.gameServer.sendPlayerNameValid(true, socket);
        }else {
            let playerNotInList = true;

            for(let i in this.playerList){
                if(playerName == this.playerList[i].getPlayerName()){
                    if(!this.playerList[i].getPlayerActive()){
                        this.playerJoined(playerName);
                        this.gameServer.sendPlayerNameValid(true, socket);
                        playerNotInList = false;
                        break;
                    }
                    else{
                        this.gameServer.sendPlayerNameValid(false, socket);
                        playerNotInList = false;
                        break;
                    }
                }
            }

            if(playerNotInList){
                this.addNewPlayer(playerName);
                this.gameServer.sendPlayerNameValid(true, socket);
            }
        }
    }

    addPoint(playerName){
        let player = this.findActivePlayer(playerName);
        player.addPoint(1);
        this.gameServer.sendUpdatePlayer(player);
    }

    findActivePlayer(playerName){
        for(let player of this.playerActive){
            if(player.getPlayerName() === playerName){
                return player;
            }
        }
    }

    getLastPlayer(){
        if(this.playerActive.length > 0)
            return this.playerActive[this.playerActive.length - 1];
    }

    getPlayerActive(){
        return this.playerActive;
    }

    getPlayerList(){
        return this.playerList;
    }

    setPlayerActiveValue(playerName, value){
        for (let player of this.playerList) {
            if(playerName === player.getPlayerName()){
                player.setPlayerActive(value);
            }
        }
    }
};
