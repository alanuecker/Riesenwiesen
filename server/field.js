module.exports = class Field{
    constructor(){
        this.field = new Map();
        this.cards = [];

        this.initField();
    }

    initField(){
        this.setPosition(0, 0, 1);
        this.setPosition(0, 1, 0);
        this.setPosition(0, -1, 0);
        this.setPosition(1, 0, 0);
        this.setPosition(-1, 0, 0);
    }

    setPosition(x, y, type){
        let coordinate = x + ", " + y;
        this.cards.push(type);
        this.field.set(coordinate, this.cards.length - 1);
    }

    getPositionID(x, y){
        let coordinate = x + ", " + y;
        let id = this.field.get(coordinate);
        return id;
    }

    getPositionType(id){
        return this.cards[id];
    }

    getCards(){
        return this.cards;
    }
};
