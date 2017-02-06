let Player = require('./player.js');

module.exports = class PlayerManager{
    constructor(gameServer){
        this.playerActive = [];
        this.playerList = [];
        this.gameServer = gameServer;
    }

    addNewPlayer(playerName){
        if(this.playerList.length > 0){
            console.log("not first");
            this.playerList.push(new Player(playerName, this.playerList.length));
            console.log(this.playerList.length);
            this.playerActive.push(this.playerList[this.playerList.length--]);
        }else{
            console.log("first");
            this.playerList.push(new Player(playerName, this.playerList.length));
            this.playerActive = [this.playerList[0]];
        }
    }

    playerLeft(playerName){
        this.playerActive = this.playerActive.filter(function (n) {return n.getPlayerName() !== playerName;})
    }

    playerJoined(playerName){
        console.log("player joined");
        for(let i in this.playerList){
            if(this.playerList[i].getPlayerName() === playerName){
                if(this.playerActive.length > 0){
                    this.playerActive.push(this.playerList[i]);
                }else{
                    this.playerActive = [this.playerList[i]];
                }
            }
        }
    }

    checkPlayerName(playerName, socket){
        if(this.playerList.length == 0){
            this.addNewPlayer(playerName);
            socket.emit('playerValid', 'true');
            console.log('added first player');
        }else {
            for(let i in this.playerList){
                if(playerName === this.playerList[i].getPlayerName() && !this.playerList[i].getPlayerActive()){
                    this.playerJoined(playerName);
                    this.gameServer.sendPlayerNameValid(true, socket);
                    console.log("player name in list and not active");
                }else if(playerName === this.playerList[i].getPlayerName() && this.playerList[i].getPlayerActive()){
                    this.gameServer.sendPlayerNameValid(false, socket);
                    console.log('player name in list but active');
                }else{
                    this.addNewPlayer(playerName);
                    this.gameServer.sendPlayerNameValid(true, socket);
                    console.log('player not in list');
                }
            }
        }
    }
};
