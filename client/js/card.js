class Card extends createjs.Container{
    constructor(xPosGrid, yPosGrid, id, type, rotation){
        super();

        this.xPosGrid = xPosGrid;
        this.yPosGrid = yPosGrid;
        this.cardId = id;
        this.cardType = type;
        this.cardRotation = 0;
        this.cardRotationType = rotation;
        this.width = 100;
        this.color = ["grey", "green"];
        this.cardPlaced = false;

        this.refreshPosition();
        this.init();

    }

    init(){
        this.regX = this.width/2;
        this.regY = this.width/2;

        let streetWidth = 6;
        let middle = this.width/2-((this.width/streetWidth)/2);

        let rect = new createjs.Shape();
        this.rectCommand = rect.graphics.beginFill(this.color[0]).command;
        rect.graphics.drawRect(0, 0, this.width, this.width);


        rect.addEventListener("mousedown", function (event) {
            if(!this.getCardPlaced()){
                if(event.nativeEvent.button == 0){
                    //left button
                    game.sendSelectedCard(this.cardId);
                }else{
                    //right or middle button
                    game.sendRotateCard(this.cardId);
                }
            }
        }.bind(this));

        //long piece
        this.streetLong = new createjs.Shape();
        this.streetLong.graphics.beginFill("blue").drawRect(middle, 0, this.width/streetWidth, this.width);

        //street corner piece
        this.streetCorner = new createjs.Container();

        let streetCornerOne = new createjs.Shape();
        streetCornerOne.graphics.beginFill("blue").drawRect(0, middle, this.width/2, this.width/streetWidth);

        let streetCornerTwo = new createjs.Shape();
        streetCornerTwo.graphics.beginFill("blue").drawRect(middle, middle, this.width/streetWidth, this.width/2 + ((this.width/streetWidth)/2));

        this.streetCorner.addChild(streetCornerOne, streetCornerTwo);

        //intersection
        this.streetIntersection = new createjs.Container();

        let streetIntersectionOne = new createjs.Shape();
        streetIntersectionOne.graphics.beginFill("blue").drawRect(0, middle, this.width, this.width/streetWidth);

        let streetIntersectionTwo = new createjs.Shape();
        streetIntersectionOne.graphics.beginFill("blue").drawRect(middle, 0, this.width/streetWidth, this.width);

        this.streetIntersection.addChild(streetIntersectionOne, streetIntersectionTwo);

        //end piece
        this.streetEnd = new createjs.Shape();
        this.streetEnd.graphics.beginFill("blue").drawRect(middle, 0, this.width/streetWidth, this.width/2 + ((this.width/streetWidth)/2));

        //T intersection piece
        this.streetTIntersection = new createjs.Container();

        let streetTIntersectionOne = new createjs.Shape();
        streetTIntersectionOne.graphics.beginFill("blue").drawRect(0, middle, this.width/2, this.width/streetWidth);

        let streetTIntersectionTwo = new createjs.Shape();
        streetTIntersectionOne.graphics.beginFill("blue").drawRect(middle, 0, this.width/streetWidth, this.width);

        this.streetTIntersection.addChild(streetTIntersectionOne, streetTIntersectionTwo);

        this.streetLong.visible = false;
        this.streetCorner.visible = false;
        this.streetIntersection.visible = false;
        this.streetEnd.visible = false;
        this.streetTIntersection.visible = false;

        this.addChild(rect, this.streetLong, this.streetCorner, this.streetIntersection, this.streetEnd, this.streetTIntersection);

        this.setType(this.cardType);
        this.setRotation(this.cardRotationType);
    }

    setXPosGrid(value){
        this.xPosGrid = value;
    }

    setYPosGrid(value){
        this.yPosGrid = value;
    }

    setType(value){
        this.cardType = value;

        this.streetLong.visible = false;
        this.streetCorner.visible = false;
        this.streetIntersection.visible = false;
        this.streetEnd.visible = false;
        this.streetTIntersection.visible = false;

        switch (value){
            case 0:
                this.rectCommand.style = this.color[0];
                break;
            case 1:
                this.rectCommand.style = this.color[1];
                break;
            case 2:
                this.streetLong.visible = true;
                this.rectCommand.style = this.color[1];
                break;
            case 3:
                this.streetCorner.visible = true;
                this.rectCommand.style = this.color[1];
                break;
            case 4:
                this.streetIntersection.visible = true;
                this.rectCommand.style = this.color[1];
                break;
            case 5:
                this.streetEnd.visible = true;
                this.rectCommand.style = this.color[1];
                break;
            case 6:
                this.streetTIntersection.visible = true;
                this.rectCommand.style = this.color[1];
                break;
        }
    }

    setRotation(value){
        this.cardRotationType = value;
        this.cardRotation = value * 90;
    }

    setCardPlaced(value){
        this.cardPlaced = value;
    }

    getXPosGrid(){
        return this.xPosGrid;
    }

    getYPosGrid(){
        return this.yPosGrid;
    }

    getType(){
        return this.cardType;
    }

    getWidth(){
        return this.width;
    }

    getCardId(){
        return this.cardId;
    }

    getCardPlaced(){
        return this.cardPlaced;
    }

    refreshPosition(){
        let x = this.xPosGrid * this.width + screenWidth/2 - this.width/2 + global.offsetX;
        let y =  -1 * this.yPosGrid * this.width + screenHeight/2 - this.width/2 + global.offsetY;
        this.xPos = x;
        this.yPos = y;
    }
}
createjs.promote(Card, "Container");