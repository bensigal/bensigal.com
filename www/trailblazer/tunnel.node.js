var board;
var fs = require('fs');
var tables;
var server;
module.exports = function(req, res, server){
    switch(req.path.split("/")[2]){
        
    case "starchartonline":
        //Require login for board-affecting operations
        var deniedOperations = ["set", "init", "newstar", "reloadtables", "backup", "deletestar"]
        if(!req.session.on && deniedOperations.includes(req.path.split("/")[3])){
            req.log("Not logged in, insufficient permissions for operation "+req.path.split("/")[3]);
            server.redirect("/login?trailblazer/starchartonline", req, res, 403);
            return;
        }
        switch(req.path.split("/")[3]){
        case "set":
            board = JSON.parse(req.post.data);
            saveBoard();
            return JSON.stringify(board);
        case "get":
            return JSON.stringify(board);
        case "init":
            if(req.path.split("/").length > 4 && req.path.split("/")[4] == "advanced")
                constructDefaultBoardAdvanced();
            else
                constructDefaultBoardOther();
            return JSON.stringify(board);
        case "newstar":
            board.stars.push(Star.createRandom(req.post.name, req.post.type));
            saveBoard();
            return JSON.stringify(board);
        case "reloadtables":
            fs.readFile(server.root + "www/trailblazer/tables.json", "utf8", function(err, data){
                tables = JSON.parse(data);
                server.sendString("Success", req, res);
            });
            break;
        case "backup":
            fs.writeFile("backups/"+(new Date().getTime())+".json", JSON.stringify(board), function(err){if(err)console.error(err.message)});
            break;
        case "deletestar":
            board.stars.splice(req.post.index, 1);
            saveBoard();
            return JSON.stringify(board);
        default:
            server.defaultTunnel(req,res,"/trailblazer/starchartonline/");
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
}
function d6(){
    return Math.ceil(Math.random()*6);
}