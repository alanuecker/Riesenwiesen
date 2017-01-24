let Card = require('./card.js');

module.exports = class Field{
    constructor(){
        this.numberOfCards = 0;
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
        this.cards.push(new Card(x, y, this.numberOfCards, type));
        this.field.set(coordinate, this.numberOfCards);
        this.numberOfCards++;
    }

    getPositionID(x, y){
        let coordinate = x + ", " + y;
        let id = this.field.get(coordinate);
        return id;
    }

    getPositionType(id){
        return this.cards[id].getType();
    }

    getCards(){
        return this.cards;
    }
};
