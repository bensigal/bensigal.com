$(function(){
    $("#resourceRow button").click(buttonClickHandler);
    $("#rightResourcesTable button").prop("disabled", true);
});

function buttonClickHandler(event){
    var isOnLeft = $.contains($("#leftResources")[0], event.target);
    var isBuy = $(event.target).is(".buy");
    var commodityName = $(event.target).parent().parent().find(".resourceName").html();
    var currentCommodityAmount = 
    alert(commodityName);
    if(!isBuy){
        
    }
}

var Player = function(isLeft){
    this.isp1 = isLeft;
    this.commmodityAmounts = [0,0,0,0,0];
    this.money = isLeft?500:600;
    this.getCommodityAmount = function(commodity){
        if(typeof name == "string"){
            return this.commodityAmounts[Commodity[name.toLowerCase()]];
        }
        return this.commodityAmounts[commodity.id];
    };
};

//Yes, the player on the left is the second item in the array. Deal with it.
var players = [new Player(false), new Player(true)]

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