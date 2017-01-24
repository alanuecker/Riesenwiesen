module.exports = class Card{
    constructor(x, y, field){
        this. x = x;
        this.y = y;
        this.id = field.getPositionID(x, y);
        this.type = field.getPositionType(this.id);
    }
};