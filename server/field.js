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
        this.fillSurroundingCards(0, 0);

        this.cards[0].setCardPlaced(true);
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

    getSurroundingCards(x, y){
        let surroundingCards = [this.cards[this.getPositionID(x, y + 1)]];
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y)]);
        surroundingCards.push(this.cards[this.getPositionID(x, y - 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y)]);

        return surroundingCards;
    }

    getAllSurroundingCards(x, y){
        let surroundingCards = this.getSurroundingCards(x, y);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y + 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x + 1, y - 1)]);
        surroundingCards.push(this.cards[this.getPositionID(x - 1, y - 1)]);

        return surroundingCards;
    }

    getAllEdgeCards(){
        let edgeCards = [];

        for(let card of this.cards){
            if(card.getType() == 0)
                edgeCards.push(card);
        }

        return edgeCards;
    }

    //change the type of a card by 1
    setCardType(id, type){
        if(this.cards[id].getCardPlaced())
            return;

        this.cards[id].setType(type);

        this.gameServer.sendUpdateCard(this.cards[id]);
    }

    //change the rotation of a card by 1
    setCardRotation(id, rotation){
        if(this.cards[id].getCardPlaced())
            return;

        this.cards[id].setRotation(rotation);

        this.gameServer.sendUpdateCard(this.cards[id]);
    }

    //set a card at a specific position
    setPosition(x, y, type){
        let coordinate = x + ", " + y;
        this.cards.push(new Card(x, y, this.numberOfCards, type));
        this.field.set(coordinate, this.numberOfCards);
        this.numberOfCards++;
    }

    //create an empty card on all sides of the placed card
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

        switch(rotation){
            case 0:
                return position;
                break;
            case 1:
                position -= 1;
                if(position < 0)
                    position = 3;
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

    //check if the card can be placed
    checkPlacement(cardID, socket){

        if(cardID <= 0)
            return;

        let cardValid = true;
        let card = this.cards[cardID];
        //get the surrounding cards
        let surroundingCards = this.getSurroundingCards(card.getXPosGrid(), card.getYPosGrid());

        //go through all surrounding cards and check if their intersecting sides are free or the right card type is selected
        for(let i in surroundingCards){
            if(surroundingCards[i] != undefined && surroundingCards[i].getType() != 0){
                if(!this.checkSides(i, card, surroundingCards[i]))
                    cardValid = false;
            }
        }

        //card can be placed
        if(cardValid){
            card.setCardPlaced(true);

            this.fillSurroundingCards(card.getXPosGrid(), card.getYPosGrid());
            this.gameServer.sendCardValid(socket);
            socket.newCardType();

            for(let i in surroundingCards){
                if(surroundingCards[i] != undefined){
                    this.placeSides(i, card, surroundingCards[i]);
                }
            }
        }else{
            this.resetCardType(cardID);
        }
    }

    //check if the side on cardA and the intersecting side on cardB have the same type
    checkSides(sideA, cardA, cardB){
        sideA = parseInt(sideA);
        let sideB = this.correspondingSide(sideA);

        return this.cardSides.cards[cardA.getType()].sides[this.sideArrayPosition(cardA.getRotation(), sideA)] === this.cardSides.cards[cardB.getType()].sides[this.sideArrayPosition(cardB.getRotation(), sideB)];
    }

    //if the card is placed, mark the side in the card as 1
    placeSides(sideA, cardA, cardB){
        sideA = parseInt(sideA);
        let sideB = this.correspondingSide(sideA);

        cardA.setSide(sideA, 1);
        cardB.setSide(sideB, 1);
    }

    correspondingSide(sideA){
        let sideB = 0;
        //find the intersecting side on the other card
        if(sideA < 2)
            sideB = sideA + 2;
        else
            sideB = sideA - 2;

        return sideB;
    }

    //reset the card if it exists and is not placed
    resetCardType(id){
        if(this.cards[id] != undefined)
            if(!this.cards[id].getCardPlaced()){
                this.cards[id].setType(0);
                this.gameServer.sendUpdateCard(this.cards[id]);
            }
    }

    //predict positions which are not possible based on card type
    predictNotPossiblePositions(cardType, socket){
        let edgeCards = this.getAllEdgeCards();
        let notPossibleCards = [];

        //go through all edge cards to check if they are a possible position
        for(let eCard of edgeCards){
            let surroundingCards = this.getSurroundingCards(eCard.getXPosGrid(), eCard.getYPosGrid());
            //sides the card has to have
            let sidesA = ['none', 'none', 'none', 'none'];
            let cardPossible = false;

            //get the sides from surrounding cards
            for(let i in surroundingCards){
                if(surroundingCards[i] === undefined || surroundingCards[i].getType() == 0)
                    continue;

                let sideB = this.correspondingSide(parseInt(i));
                sidesA[i] = this.cardSides.cards[surroundingCards[i].getType()].sides[this.sideArrayPosition(surroundingCards[i].getRotation(), sideB)];
            }

            //check all card rotations
            for(let i = 0; i < 4; i++){
                let rotationPossible = false;

                //check all card sides
                for(let j = 0; j < sidesA.length; j++){
                    //skip if side is empty
                    if(sidesA[j] == 'none')
                        continue;

                    let sideB = this.cardSides.cards[cardType].sides[this.sideArrayPosition(i, j)];

                    if(sidesA[j] === sideB){
                        rotationPossible = true;
                        break;
                    }
                }

                if(rotationPossible){
                    cardPossible = true;
                    break;
                }
            }

            if(!cardPossible)
                notPossibleCards.push(eCard.getCardId());
        }

        this.gameServer.sendPositionPrediction(notPossibleCards, socket);
    }
};
