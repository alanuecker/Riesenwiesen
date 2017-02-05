let Card = require('./card.js');

module.exports = class Field{
    constructor(server){
        this.numberOfCards = 0;
        this.field = new Map();
        this.cards = [];
        this.server = server;

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

        if(id != undefined)
            return id;
        else
            return -1;
    }

    getPositionType(id){
        if(id >= 0)
            return this.cards[id].getType();
        else
            return -1;
    }

    getCards(){
        return this.cards;
    }

    setCardType(id){
        if(this.cards[id].type == 0)
            this.fillSurroundingCards(this.cards[id].getXPosGrid(), this.cards[id].getYPosGrid());
        this.cards[id].type++;
        if(this.cards[id].type > 1)
            this.cards[id].type = 1;

        this.server.sendUpdateCard(this.cards[id]);
    }

    getSurroundingIds(x, y){
         let surroundingIds = [this.getPositionID(x + 1, y)];
         surroundingIds.push(this.getPositionID(x - 1, y));
         surroundingIds.push(this.getPositionID(x, y + 1));
         surroundingIds.push(this.getPositionID(x, y - 1));

         return surroundingIds.filter(function (n) {return n >= 0});
    }

    getSurroundingCards(x, y){
        let surroundingCards = [this.cards[this.getPositionID(x + 1, y)]];
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y)]);
        surroundingCards.push(this.cards[this.getPositionID(x, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x, y - 1)]);

        return surroundingCards.filter(function (n) {return n != undefined});
    }

    getSurroundingTypes(x, y){
        let surroundingTypes = [this.getPositionType(this.getPositionID(x + 1, y))];
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x, y + 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x, y - 1)));

        return surroundingTypes.filter(function (n) {return n >= 0});
    }

    getAllSurroundingIds(x, y){
        let surroundingIds = this.getSurroundingIds(x, y);
        surroundingIds.push(this.getPositionID(x - 1, y + 1));
        surroundingIds.push(this.getPositionID(x + 1, y + 1));
        surroundingIds.push(this.getPositionID(x - 1, y - 1));
        surroundingIds.push(this.getPositionID(x + 1, y - 1));

        return surroundingIds.filter(function (n) {return n >= 0});
    }

    getAllSurroundingCards(x, y){
        let surroundingCards = this.getSurroundingCards(x, y);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y - 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y - 1)]);

        return surroundingCards.filter(function (n) {return n != undefined});
    }

    getAllSurroundingTypes(x, y){
        let surroundingTypes = this.getSurroundingTypes(x, y);
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y + 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x + 1, y + 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y - 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x + 1, y - 1)));

        return surroundingTypes.filter(function (n) {return n >= 0});
    }

    fillSurroundingCards(x, y){
        if(this.getPositionType(this.getPositionID(x + 1, y)) < 0){
            this.setPosition(x + 1, y, 0);
            this.server.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x - 1, y)) < 0){
            this.setPosition(x - 1, y, 0);
            this.server.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x, y + 1)) < 0){
            this.setPosition(x, y + 1, 0);
            this.server.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x , y - 1)) < 0){
            this.setPosition(x, y - 1, 0);
            this.server.sendAddCard(this.cards[this.cards.length - 1]);
        }
    }
};
