class Star{
    constructor(name, type, goodsSupply, goodsDemand, discovery){
        this.name = name;
        this.goodsSupply = goodsSupply;
        this.goodsDemand = goodsDemand;
        this.type = type;
        this.discovery = discovery || 0;
    }
}
Star.createRandom = function(name, type, discovery){
    
    var goodsSupply = [];
    var goodsDemand = [];
    
    var numberGoodTypesProduced = 
        tables.numberGoodTypesProduced[type][d6()+d6()];
    for(var i = 0; i < numberGoodTypesProduced; i++){
        goodsSupply.push(SuppliedGood.createRandom(type));
    }
    
    var numberGoodsConsumed =
        tables.numberGoodsConsumed[type][d6()+d6()];
    for(i = 0; i < numberGoodsConsumed; i++){
        goodsDemand.push(DemandedGood.createRandom(type));
    }
    
    return new Star(
        name, type, goodsSupply, goodsDemand, discovery
    );
}
class SuppliedGood{
    constructor(type, priceMultiple, production){
        this.type = type;
        this.priceMultiple = priceMultiple;
        this.production = production || 1;
    }
}
SuppliedGood.createRandom = function(planetType){
    return new SuppliedGood(
        tables.goodTypeProduced[planetType][d6()+d6()],
        tables.priceMultiple[d6()+d6()+d6()]
    );
};
class DemandedGood{
    constructor(type, demandLetter, demandModifier, demandNumber){
        this.type = type;
        this.demandLetter = demandLetter;
        this.demandModifier = demandModifier;
        this.demandNumber = demandNumber || demandModifier;
    }
}
DemandedGood.createRandom = function(planetType){
    var type =tables.goodTypeConsumed[planetType][d6()+d6()] 
    return new DemandedGood(
        type,
        tables.demandLetter[d6()+d6()],
        tables.demandModifierModifier[type]+d6()
    )
}