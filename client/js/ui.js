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

    setPlayerScore(data){
        for(let player of this.playerList){
            if(player.getPlayerName() === data.playerName){
                player.setPlayerScore(data.playerScore);
            }
        }
    }
}
createjs.promote(PlayerList, "Container");

class PlayerElement extends createjs.Container{
    constructor(playerName, playerScore, position){
        super();

        this.spacing = 15;

        this.playerName = playerName;
        this.playerScore = playerScore;

        this.playerText = new createjs.Text(this.playerName, "18px Arial", "white");
        this.playerText.yPos = position + this.spacing;
        this.playerText.xPos = 15;

        this.scoreText = new createjs.Text(this.playerScore, "18px Arial", "white");
        this.scoreText.yPos = position + this.spacing;
        this.scoreText.xPos = 115;

        this.addChild(this.playerText, this.scoreText);
    }

    movePosition(position){
        this.playerText.yPos = position + this.spacing;
        this.scoreText.yPos = position + this.spacing;
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
        this.scoreText.text = value;
    }
}
createjs.promote(PlayerElement, "Container");

class Button extends createjs.Container{
    constructor(width, height, xPos, yPos, background, backgroundClick, backgroundHover, text, textSize, textColor, handleClick) {
        super();

        this.width = width;
        this.height = height;
        this.background = background;
        this.backgroundClick = backgroundClick;
        this.backgroundHover = backgroundHover;
        this.text = text;
        this.textColor = textColor;
        this.textSize = textSize;
        this.padding = 3;
        this.handleClick = handleClick;

        //position
        this.xPos = xPos;
        this.yPos = yPos;

        //setup
        this.setup();
    };

    setup() {
        //backgroundElement
        this.backgroundElement = new createjs.Shape();
        this.backgroundElement.graphics.beginFill(this.background).drawRect(0, 0, this.width, this.height);
        //text
        this.textElement = new createjs.Text(this.text, this.textSize + "px Arial", this.textColor);
        //center text
        let textBounds = this.textElement.getBounds();
        this.textElement.xPos = this.width/2 - textBounds.width/2;
        this.textElement.yPos = this.height/2 - textBounds.height/2;

        //event on click
        let handleClickEvent = function () {
            this.backgroundElement.graphics.beginFill(this.backgroundClick).drawRect(0, 0, this.width, this.height);
            this.handleClick();
            this.backgroundElement.graphics.beginFill(this.background).drawRect(0, 0, this.width, this.height);
        };
        //event on hover
        let handleOverEvent = function (evt) {
            if(evt.type == "mouseover"){
                this.backgroundElement.graphics.beginFill(this.backgroundHover).drawRect(0, 0, this.width, this.height);
            }else{
                this.backgroundElement.graphics.beginFill(this.background).drawRect(0, 0, this.width, this.height);
            }
        };

        this.backgroundElement.addEventListener("click", handleClickEvent.bind(this));
        this.backgroundElement.addEventListener("mouseover", handleOverEvent.bind(this));
        this.backgroundElement.addEventListener("mouseout", handleOverEvent.bind(this));

        //add childs
        this.addChild(this.backgroundElement, this.textElement);
    };
}
createjs.promote(Button, "Container");