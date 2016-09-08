var isLeftTurn = true;
var winConditionMoneyAmount = 1000;

$(function(){
    $("#resourceRow button").click(buttonClickHandler);
    $("#rightResourcesTable button").prop("disabled", true);
    updateMoney();
    updateCommodityAmounts();
    var deal = new SpecialDeal(true);
    $("#cardsForSaleRow").children().first().html(deal.totalDescription);
});

function buttonClickHandler(event){
    
    var isLeft = $.contains($("#leftResources")[0], event.target);
    var isBuy = $(event.target).is(".buy");
    var commodityName = $(event.target).parent().parent().find(".resourceName").html();
    var activeCommodity = Commodity.getByName(commodityName);
    var commodityAmount = players[isLeft].commodityAmounts[activeCommodity.id];
    
    console.log((isLeft?"Left":"Right") + " is attempting to " + (isBuy?"buy":"sell") + " a " +
        commodityName + ".");
    
    if(!isBuy){
        if(commodityAmount <= 0){
            console.log("They fail.");
            alert("You do not have any "+commodityName+" to sell!");
            return;
        }
        console.log("Selling.");
        players[isLeft].commodityAmounts[activeCommodity.id]--;
        players[isLeft].addMoney(activeCommodity.sell());
    }else{
        console.log("Buying.");
        players[isLeft].commodityAmounts[activeCommodity.id]++;
        players[isLeft].addMoney(-activeCommodity.buy());
        nextTurn();
    }
    updatePrices();
    updateMoney();
    updateCommodityAmounts();
}

var Player = function(isLeft){
    this.isLeft = isLeft;
    this.commodityAmounts = [1,1,1,1,1];
    this.money = isLeft?500:600;
    this.setMoney = function(money){
        this.money = money;
        if(this.money >= winConditionMoneyAmount){
            alert((this.isLeft?"Left":"Right" ) + " wins!");
        }
    }
    this.addMoney = function(amount){
        this.setMoney(this.money + amount);
    }
    this.getCommodityAmount = function(commodity){
        if(typeof commodity == "string"){
            return this.commodityAmounts[Commodity[commodity.toLowerCase()]];
        }
        return this.commodityAmounts[commodity.id];
    };
};

//Yes, the player on the left is the second item in the array. Deal with it.
var leftPlayer = new Player(true);
var rightPlayer = new Player(false);
var players = {
    0:rightPlayer,
    1:leftPlayer,
    left:leftPlayer,
    right:rightPlayer,
    "true":leftPlayer,
    "false":rightPlayer
}

var prices = [100,100,100,100,100];

var Commodity = function(name, id){
    this.name=name;
    this.id  =id;
    this.buysMinusSells = 0;
    this.getExactPrice = function(){
        return 100 * Math.pow(1.1, this.buysMinusSells);
    }
    this.getPrice = function(){
        return Math.floor(this.getExactPrice());
    }
    this.sell = function(){
        var result = this.getPrice();
        this.buysMinusSells--;
        return result;
    }
    this.buy = function(){
        var result = this.getPrice();
        this.buysMinusSells++;
        return result;
    }
};

Commodity.getIdByName = function(name){
    name = name.toLowerCase();
    switch(name){
    case "wood" : return 0;
    case "stone": return 1;
    case "cloth": return 2;
    case "metal": return 3;
    case "food" : return 4;
    default: throw "Name '"+name+"' does not represent a commodity.";
    }
};
Commodity.getByName = function(name){
    return commodities[Commodity.getIdByName(name)];
};

var commodities = [
    new Commodity("Wood",0),
    new Commodity("Stone",1),
    new Commodity("Cloth",2),
    new Commodity("Metal",3),
    new Commodity("Food",4),
];

Commodity.wood = commodities[0];
Commodity.stone = commodities[1];
Commodity.cloth = commodities[2];
Commodity.metal = commodities[3];
Commodity.food = commodities[4];

var SpecialDeal = function(random){
    
    if(random){
        
        this.amounts = [2, 1, 1, 0, 0];
        this.markup = "200";
        var commodityOrder = shuffle([0,1,2,3,4]);
        
        console.log("Order for random deal: "+commodityOrder);
        
        this.resourcesList = "";
        this.amounts.forEach(function(element, index){
            console.log("Item "+element+" at index "+index)
            if(element){
                this.resourcesList += element + " " + commodities[commodityOrder[index]] + "<br>";
            }
        });
        console.log(this.resourcesList);
        
        this.priceDescription = "<span class='greenText'>" + this.markup + "</span>";
        this.totalDescription = this.resourcesList + this.priceDescription;
        
    }else{
        //TODO
        throw "Non-random deals not yet supported.";
    }
}

function updateMoney(){
    $("#leftInfo .moneyInfo").html("$"+players[1].money);
    $("#rightInfo .moneyInfo").html("$"+players[0].money);
}

function updateCommodityAmounts(){
    updateCommodityAmountsTable($("#leftResourcesTable"), true);
    updateCommodityAmountsTable($("#rightResourcesTable"), false);
}

function updateCommodityAmountsTable(table, isLeft){
    //Two children calls to bypass <tbody>
    table.children().children().each(function(){
        $(this).children(".amount").html(
            players[isLeft].commodityAmounts[Commodity.getIdByName(
                $(this).children(".resourceName").html()
            )]
        );
    });
}

function updatePrices(){
    //Two children calls to bypass <tbody>
    $("#pricesTable").children().children().each(function(){
        $(this).children(".pricesCommodityValue").html(
            "$" + Commodity.getByName(
                $(this).children(".pricesCommodityName").html()
            ).getPrice()
        );
    });
}

function nextTurn(){
    if(isLeftTurn){
        $("#leftResourcesTable button").prop("disabled", true);
        $("#rightResourcesTable button").prop("disabled", false);
    }else{
        $("#leftResourcesTable button").prop("disabled", false);
        $("#rightResourcesTable button").prop("disabled", true);
    }
    isLeftTurn = !isLeftTurn;
}
//http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
//changes argument. :(
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}