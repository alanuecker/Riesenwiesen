class Card extends createjs.Container{
    constructor(xPos, yPos, id, type){
        super();

        this.draw();
        this.xPos = xPos;
        this.yPos = yPos;
        this.id = id;
        this.type = type;
        this.width = 100;
        this.color = ["grey", "green"];

        this.init();
    }

    init(){
        this.rect = new createjs.Shape();
        this.rect.graphics.beginFill(this.color[this.type]).drawRect(0, 0, this.width, this.width);

        this.rect.addEventListener("mousedown", function (event) {
            console.log(event);
            if(event.nativeEvent.button == 0){
                //left button
                console.log(this.id);
            }else{
                //right or middle button
                console.log(this.id);
            }
        }.bind(this));

        stage.addChild(this.rect);
    }

    getXPos(){
        return this.xPos;
    }

    getYPos(){
        return this.yPos;
    }

    getType(){
        return this.type;
    }

    getWidth(){
        return this.width;
    }

    draw(){
        let x = this.xPos * this.width + c.width/2 - this.width/2;
        let y = this.yPos * this.width + c.height/2 - this.width/2;
        this.x = x;
        this.y = y;
    }
}
createjs.promote(Card, "Container");