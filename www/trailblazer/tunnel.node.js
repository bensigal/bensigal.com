var board;
var fs = require('fs');
var tables;
var server;
module.exports = function(req, res, server){
    switch(req.path.split("/")[2]){
        
    case "starchart":
        switch(req.path.split("/")[3]){
        case "set":
            board = JSON.parse(req.post.data);
            saveBoard();
        case "get":
            return JSON.stringify(board);
        case "init":
            if(req.path.split("/").length > 4 && req.path.split("/")[4] == "advanced")
                constructDefaultBoardAdvanced();
            else
                constructDefaultBoardOther();
            return JSON.stringify(board);
        default:
            server.defaultTunnel(req,res,"/trailblazer/starchart/");
            break;
        }
        break;
    default:
        server.defaultTunnel(req, res, "/trailblazer/");
        break;
    }
    
};
function saveBoard(){
    fs.writeFile(server.root + "www/trailblazer/board.json", JSON.stringify(board), function(err){
    });
}
module.exports.init = function(serverInfo){
    server = serverInfo;
    fs.readFile(server.root + "www/trailblazer/board.json", "utf8", function(err, data){
        board = JSON.parse(data);
    });
    fs.readFile(server.root + "www/trailblazer/tables.json", "utf8", function(err, data){
        tables = JSON.parse(data);
    });
};
class Star{
    constructor(name, type, goodsSupply, goodsDemand, discovery){
        this.name = name;
        this.goodsSupply = goodsSupply;
        this.goodsDemand = goodsDemand;
        this.type = type;
        this.discovery = discovery;
    }
}
Star.createRandom = function(name, type, discovery){
    
    var goodsSupply = [];
    var goodsDemand = [];
    
    var numberGoodsProduced = 
        tables.numberGoodsProduced[this.type][d6()+d6()];
    for(var i = 0; i < numberGoodsProduced; i++){
        goodsSupply.push(SuppliedGood.createRandom(type));
    }
    
    var numberGoodsConsumed =
        tables.numberGoodsConsumed[this.type][d6()+d6()];
    for(i = 0; i < numberGoodsConsumed; i++){
        goodsDemand.push(ConsumedGood.createRandom(type));
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
        tables.priceMultiple(d6()+d6()+d6())
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
function constructDefaultBoardAdvanced(){
    board = {stars:[]};
    board.stars = tables.defaultBoardAdvanced.stars.map(createStarFromJSON);
    saveBoard();
}
function createStarFromJSON(element){
    return new Star(element.name, element.type, element.goodsSupply.map(
        (element) => new SuppliedGood(element.name, element.priceMultiple, element.production)
    ), element.goodsDemand.map(
        (element) => new DemandedGood(element.name, element.demandLetter, element.demandModifier, element.demandNumber||element.demandModifier)
    ));
}
function constructDefaultBoardOther(){
    board = {stars:[]};
    board.stars = tables.defaultBoardOther.stars.map(createStarFromJSON);
    saveBoard();
}/* now using tables.json
var defaultBoard = {
    stars:[
        new Star("Sol","A", [
            new SuppliedGood("Ships", "1/5", 2),
            new SuppliedGood("Germ Plasm", "4", 4),
            new SuppliedGood("Industrial Tech", "2", 2),
            new SuppliedGood("Medical Tech", "4/3", 3),
            new SuppliedGood("Weapons", "3/4", 2)
        ], [
            new DemandedGood("Beasts", "F", "2"),
            new DemandedGood("Boostspice", "B", "12"),
            new DemandedGood("Drugs", "E", "5"),
            new DemandedGood("Fissionables", "A", "6"),
            new DemandedGood("Liquors", "B", "4"),
            new DemandedGood("Medicines", "A", "6"),
            new DemandedGood("Spices", "C", "6"),
            new DemandedGood("Superheavy Metals", "D", "8"),
            new DemandedGood("Wines", "C", "5"),
            new DemandedGood("D-Class Worlds", "F", "12")
        ], 0),
        new Star("Alpha C", "B", [
            new SuppliedGood("")])
    ]
};*/