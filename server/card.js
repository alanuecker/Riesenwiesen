module.exports = class Card{
    constructor(x, y, id, type){
        this.xPosGrid = x;
        this.yPosGrid = y;
        this.cardId = id;
        this.type = type;
    }

    setType(value){
        this.type = value;
    }

    getType(){
        return this.type;
    }

    getXPosGrid(){
        return this.xPosGrid;
    }

    getYPosGrid(){
        return this.yPosGrid;
    }
};