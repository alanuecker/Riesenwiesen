let Card = require('./card.js');

module.exports = class Field{
    constructor(server){
        this.numberOfCards = 0;
        this.field = new Map();
        this.cards = [];
        this.gameServer = server;

        //different card type with their sides
        this.cardSides = {"cards":
            [
                {
                    "cardType": 0,
                    "numFields": "none",
                    "numStreets": ["none", "none", "none", "none"],
                    "sides": "none"
                },
                {
                    "cardType": 1,
                    "numFields": 4,
                    "numStreets": 0,
                    "sides": ["field", "field", "field", "field"]
                },
                {
                    "cardType": 2,
                    "numFields": 2,
                    "numStreets": 2,
                    "sides": ["street", "field", "street", "field"]
                },
                {
                    "cardType": 3,
                    "numFields": 2,
                    "numStreets": 2,
                    "sides": ["field", "field", "street", "street"]
                },
                {
                    "cardType": 4,
                    "numFields": 0,
                    "numStreets": 4,
                    "sides": ["street", "street", "street", "street"]
                },
                {
                    "cardType": 5,
                    "numFields": 3,
                    "numStreets": 1,
                    "sides": ["street", "field", "field", "field"]
                },
                {
                    "cardType": 6,
                    "numFields": 1,
                    "numStreets": 3,
                    "sides": ["street", "field", "street", "street"]
                }
            ]
        };

        this.initField();
    }

    //init the basic field with
    initField(){
        this.setPosition(0, 0, 1);
        this.setPosition(0, 1, 0);
        this.setPosition(0, -1, 0);
        this.setPosition(1, 0, 0);
        this.setPosition(-1, 0, 0);
    }

    //set a card at a specific position
    setPosition(x, y, type){
        let coordinate = x + ", " + y;
        this.cards.push(new Card(x, y, this.numberOfCards, type));
        this.field.set(coordinate, this.numberOfCards);
        this.numberOfCards++;
    }

    //get the id of the card at this position
    //return -1 if not found
    getPositionID(x, y){
        let coordinate = x + ", " + y;
        let id = this.field.get(coordinate);

        if(id != undefined)
            return id;
        else
            return -1;
    }

    //get the type of the card with the given id
    getPositionType(id){
        if(id >= 0)
            return this.cards[id].getType();
        else
            return -1;
    }

    //return all cards
    getCards(){
        return this.cards;
    }


    setCardType(id){
        this.cards[id].cardType++;
        if(this.cards[id].cardType > 6)
            this.cards[id].cardType = 0;

        this.gameServer.sendUpdateCard(this.cards[id]);
    }

    setCardRotation(id){
        this.cards[id].cardRotation++;
        if(this.cards[id].cardRotation > 3)
            this.cards[id].cardRotation = 0;

        this.gameServer.sendUpdateCard(this.cards[id]);
    }

    getSurroundingIds(x, y){
         let surroundingIds = [this.getPositionID(x, y + 1)];
         surroundingIds.push(this.getPositionID(x + 1, y));
         surroundingIds.push(this.getPositionID(x, y - 1));
         surroundingIds.push(this.getPositionID(x - 1, y));

         return surroundingIds;
    }

    getSurroundingCards(x, y){
        let surroundingCards = [this.cards[this.getPositionID(x, y + 1)]];
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y)]);
        surroundingCards.push(this.cards[this.getPositionID(x, y - 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y)]);

        console.log("getsurrounding for " + x + " " + y + " " + surroundingCards[1]);

        return surroundingCards;
    }

    getSurroundingTypes(x, y){
        let surroundingTypes = [this.getPositionType(this.getPositionID(x, y + 1))];
        surroundingTypes.push(this.getPositionType(this.getPositionID(x + 1, y)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x, y - 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y)));

        return surroundingTypes;
    }

    getAllSurroundingIds(x, y){
        let surroundingIds = this.getSurroundingIds(x, y);
        surroundingIds.push(this.getPositionID(x - 1, y + 1));
        surroundingIds.push(this.getPositionID(x + 1, y + 1));
        surroundingIds.push(this.getPositionID(x + 1, y - 1));
        surroundingIds.push(this.getPositionID(x - 1, y - 1));

        return surroundingIds;
    }

    getAllSurroundingCards(x, y){
        let surroundingCards = this.getSurroundingCards(x, y);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y - 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y - 1)]);

        return surroundingCards;
    }

    getAllSurroundingTypes(x, y){
        let surroundingTypes = this.getSurroundingTypes(x, y);
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y + 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x + 1, y + 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x + 1, y - 1)));
        surroundingTypes.push(this.getPositionType(this.getPositionID(x - 1, y - 1)));

        return surroundingTypes;
    }

    fillSurroundingCards(x, y){
        if(this.getPositionType(this.getPositionID(x + 1, y)) < 0){
            this.setPosition(x + 1, y, 0);
            this.gameServer.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x - 1, y)) < 0){
            this.setPosition(x - 1, y, 0);
            this.gameServer.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x, y + 1)) < 0){
            this.setPosition(x, y + 1, 0);
            this.gameServer.sendAddCard(this.cards[this.cards.length - 1]);
        }
        if(this.getPositionType(this.getPositionID(x , y - 1)) < 0){
            this.setPosition(x, y - 1, 0);
            this.gameServer.sendAddCard(this.cards[this.cards.length - 1]);
        }
    }

    //apply rotation to position in array
    sideArrayPosition(rotation, position){

        console.log("rotation " + rotation + " position " + position);
        switch(rotation){
            case 0:
                return position;
                break;
            case 1:
                position -= 1;
                if(position < 0)
                    position = 3;
                console.log("position in rotated array " + position);
                return position;
                break;
            case 2:
                if(position < 2)
                    return position += 2;
                else
                    return position -= 2;
                break;
            case 3:
                position += 1;
                if(position > 3)
                    position = 0;
                return position;
                break
        }
    }

    checkPlacement(cardID, socket){
        console.log("------------------------------------");


        let cardValid = true;
        let card = this.cards[cardID];
        let surrondingCards = this.getSurroundingCards(card.getXPosGrid(), card.getYPosGrid());

        console.log("clog length " + surrondingCards.length);

        for(let i in surrondingCards){
            console.log(surrondingCards[i]);
        }
        console.log("----------------");

        for(let i in surrondingCards){
            if(surrondingCards[i] != undefined && surrondingCards[i].getType() != 0){
                if(!this.checkSides(i, card, surrondingCards[i]))
                    cardValid = false;
                console.log("next card " + cardValid);
            }
        }

        if(cardValid){
            console.log("card is valid");
            card.setCardPlaced(true);

            this.gameServer.sendCardValid(socket);
            this.fillSurroundingCards(card.getXPosGrid(), card.getYPosGrid());

            for(let i in surrondingCards){
                if(surrondingCards[i] != undefined){
                    this.placeSides(i, card, surrondingCards[i]);
                }
            }
        }
    }

    checkSides(sideA, cardA, cardB){
        let sideB = 0;
        sideA = parseInt(sideA);
        if(sideA < 2)
            sideB = (sideA + 2);
        else
            sideB = (sideA - 2);

        console.log("side A " + this.cardSides.cards[cardA.getType()].sides[this.sideArrayPosition(cardA.getRotation(), sideA)] + " type " + cardA.getType() + " sidea " + sideA);
        console.log("side B " + this.cardSides.cards[cardB.getType()].sides[this.sideArrayPosition(cardB.getRotation(), sideB)] + " type " + cardB.getType() + " sideb " + sideB);

        if(this.cardSides.cards[cardA.getType()].sides[this.sideArrayPosition(cardA.getRotation(), sideA)] === this.cardSides.cards[cardB.getType()].sides[this.sideArrayPosition(cardB.getRotation(), sideB)])
            return true;
        else
            return false;
    }

    placeSides(sideA, cardA, cardB){
        let sideB = 0;
        sideA = parseInt(sideA);
        if(sideA < 2)
            sideB = sideA + 2;
        else
            sideB = sideA - 2;

        cardA.setSide(sideA, 1);
        cardB.setSide(sideB, 1);
    }
};
