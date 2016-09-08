var isLeftTurn = true;
var winConditionMoneyAmount = 3000;
var deals;

$(function(){
    $("#resourceRow button").click(buttonClickHandler);
    $("#rightResourcesTable button").prop("disabled", true);
    updateMoney();
    updateCommodityAmounts();
    deals = [];
    for(var i = 1; i < 7; i++){
        deals[i] = new Deal("autobuy");
        deals[i].populate(i);
    }
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
    this.effects = [];
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
    this.removeEffect = function(effect){
        this.effects.splice(this.effects.indexOf(effect), 1);
    }
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

var Deal = function(type){
    
    this.generatePriceDescription = function(){
        
        result = "";
        
        this.amounts.forEach(function(element, index){
            if(element){
                result += element + " " + 
                    commodities[this.commodityOrder[index]].name + "<br>";
            }
        }, this);
        
        return result;
        
    }
    
    switch(type){
    case "discount":
        this.amounts = [4, 1, 1, 0, 0];
        this.markup = 200;
        this.commodityOrder = shuffle([0,1,2,3,4]);
        
        this.benefitDescription = "<span class='greenText'>+$"+this.markup+"</span><br>";
        
        console.log("Order for random deal: "+this.commodityOrder);
        
        this.priceDescription = this.generatePriceDescription();
        
        break;
    case "autobuy":
        this.amounts = [2, 1, 0, 0, 0];
        this.commodityOrder = shuffle([0,1,2,3,4]);
        this.commodityBought = commodities[this.commodityOrder[2]];
        
        this.benefitDescription = "<span class='greenText'>Buys a "+
            this.commodityBought.name+" every turn.</span><br>";
        this.priceDescription = this.generatePriceDescription();
        this.resolve = function(player){
            player.effects.push({
                commodityBought: this.commodityBought,
                resolve: function(player){
                    if(player.money < this.commodityBought.getPrice()){
                        alert("An autobuyer was unable to buy "+this.commodityBought.name+" and was destroyed!");
                        updateEffects();
                        return this;
                    }
                    player.commodityAmounts[this.commodityBought.id]++;
                    player.addMoney(-this.commodityBought.buy());
                },
                description: "Autobuys one "+this.commodityBought.name+" every turn."
            });
            updateEffects();
        };
        break;
    }
    this.populate = function(index){
        this.chosenCard = $("#cardsForSaleRow").children().eq(index)
        this.chosenCard.cardIndex = index;
        this.chosenCard.html(this.priceDescription + this.benefitDescription);
        this.chosenCard.append($("<button>")
            .addClass("cardButton")
            .click(function(event){
                deals[$(event.target).data("index")].click()
            })
            .data("index", index)
            .html("It's a Deal!")
        );
    };
    this.click = function(){
        var activePlayer = players[isLeftTurn];
        this.amounts.forEach(function(element, index){
            
            if(activePlayer.commodityAmounts[this.commodityOrder[index]] < element){
                alert("Not enough "+commodities[this.commodityOrder[index]].name + "!");
                throw "Not enough."
            }
            
        }, this);
        this.amounts.forEach(function(element, index){
            activePlayer.commodityAmounts[this.commodityOrder[index]]-=element;
        }, this);
        updateCommodityAmounts();
        this.resolve(activePlayer);
        nextTurn();
    }
};

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

function updateEffects(){
    $("#leftInfo .factoryInfo").html(players.left.effects.map(
        function(element){
            return element.description;
        }
    ).join("<br>"));
    $("#rightInfo .factoryInfo").html(players.right.effects.map(
        function(element){
            return element.description;
        }
    ).join("<br>"));
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
    var deadEffects = [];
    players[isLeftTurn].effects.forEach(function(element){
        var result = element.resolve(players[isLeftTurn])
        if(result)
            deadEffects.push(result);
    });
    deadEffects.forEach(function(element){
        players[isLeftTurn].removeEffect(element);
    })
    updateEffects();
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