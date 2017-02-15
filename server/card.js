module.exports = class Card{
    constructor(x, y, id, type){
        this.xPosGrid = x;
        this.yPosGrid = y;
        this.cardId = id;
        this.cardType = type;
        this.cardRotation = 0;
        this.cardPlaced = false;

        this.sides = [0, 0, 0, 0];
    }

    setType(value){
        this.cardType = value;
    }

    setSide(position, type){
        this.sides[position] = type;
    }

    setCardPlaced(value){
        this.cardPlaced = value;
    }

    getType(){
        return this.cardType;
    }

    getXPosGrid(){
        return this.xPosGrid;
    }

    getYPosGrid(){
        return this.yPosGrid;
    }

    getSides(){
        return this.sides;
    }

    getRotation(){
        return this.cardRotation;
    }
};