class Card extends createjs.Container{
    constructor(xPosGrid, yPosGrid, id, type){
        super();

        this.xPosGrid = xPosGrid;
        this.yPosGrid = yPosGrid;
        this.cardId = id;
        this.type = type;
        this.width = 100;
        this.color = ["grey", "green"];

        this.refreshPosition();
        this.init();
    }

    init(){
        let rect = new createjs.Shape();
        rect.graphics.beginFill(this.color[this.type]).drawRect(0, 0, this.width, this.width);


        rect.addEventListener("mousedown", function (event) {
            console.log(event);
            if(event.nativeEvent.button == 0){
                //left button
                game.sendSelectedCard(this.cardId);
            }else{
                //right or middle button
            }
        }.bind(this));

        this.addChild(rect);
    }

    setXPosGrid(value){
        this.xPosGrid = value;
    }

    setYPosGrid(value){
        this.yPosGrid = value;
    }

    setType(value){
        this.type = value;
    }

    getXPosGrid(){
        return this.xPosGrid;
    }

    getYPosGrid(){
        return this.yPosGrid;
    }

    getType(){
        return this.type;
    }

    getWidth(){
        return this.width;
    }

    getCardId(){
        return this.cardId;
    }


    refreshPosition(){
        let x = this.xPosGrid * this.width + screenWidth/2 - this.width/2;
        let y = this.yPosGrid * this.width + screenHeight/2 - this.width/2;
        this.xPos = x;
        this.yPos = y;
    }
}
createjs.promote(Card, "Container");