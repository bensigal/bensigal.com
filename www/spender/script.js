$(function(){
    $("#resourceRow button").click(buttonClickHandler);
    $("#rightResourcesTable button").prop("disabled", true);
    updateMoney();
    updateCommodityAmounts();
});

function buttonClickHandler(event){
    
    var isLeft = $.contains($("#leftResources")[0], event.target);
    var isBuy = $(event.target).is(".buy");
    var commodityName = $(event.target).parent().parent().find(".resourceName").html();
    var commodityAmount = players[Number(isLeft)].getCommodityAmount(commodityName);
    
    console.log((isLeft?"Left":"Right") + " is attempting to " + (isBuy?"buy":"sell") + " a " +
        commodityName + ".");
    
    if(!isBuy){
        if(commodityAmount <= 0){
            console.log("They fail.");
            alert("You do not have any "+commodityName+" to sell!");
        }
    }
}

var Player = function(isLeft){
    this.isp1 = isLeft;
    this.commodityAmounts = [0,0,0,0,0];
    this.money = isLeft?500:600;
    this.getCommodityAmount = function(commodity){
        if(typeof commodity == "string"){
            return this.commodityAmounts[Commodity[commodity.toLowerCase()]];
        }
        return this.commodityAmounts[commodity.id];
    };
};

//Yes, the player on the left is the second item in the array. Deal with it.
var players = [new Player(false), new Player(true)]

var prices = [100,100,100,100,100];

var Commodity = function(name, id){
    this.name=name;
    this.id  =id;
};

Commodity.wood = 0;
Commodity.stone = 1;
Commodity.cloth = 2;
Commodity.metal = 3;
Commodity.food = 4;

var commodities = [
    new Commodity("Wood",0),
    new Commodity("Stone",1),
    new Commodity("Cloth",2),
    new Commodity("Metal",3),
    new Commodity("Food",4),
];

function updateMoney(){
    $("#leftInfo .moneyInfo").html("$"+players[1].money);
    $("#rightInfo .moneyInfo").html("$"+players[0].money);
}

function updateCommodityAmounts(){
    
}

function nextTurn(){
    
}