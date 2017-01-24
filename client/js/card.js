class Card{
    constructor(x, y, id, type){
        this. x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.width = 100;
        this.color = ["grey", "green"];
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getType(){
        return this.type;
    }

    getWidth(){
        return this.width;
    }

    draw(){
        let x = this.x * this.width + c.width/2 - this.width/2;
        let y = this.y * this.width + c.height/2 - this.width/2;
        console.log(x + " " + y);
        this.drawRect(x, y, this.width, this.width, this.color[this.type]);
    }

    drawRect(x, y, h, w, color){
        canvas.fillStyle = color;
        canvas.fillRect(x, y, h, w);
    }
}