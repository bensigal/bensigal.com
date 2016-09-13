var isLeftTurn = true;
var winConditionMoneyAmount = 5000;
var deals;

$(function(){
    $("#resourceRow button").click(buttonClickHandler);
    $("#rightResourcesTable button").prop("disabled", true);
    updateMoney();
    updateEffects();
    updateCommodityAmounts();
    deals = [new Deal("market"), new Deal("markup")];
    for(var i = 0; i < 5; i++){
        deals[i+2] = new Deal("autobuy", i);
    }
    deals.push(new Deal("markup"));
    deals.push(new Deal("market"));
    deals.forEach(function(element, index){
        element.populate(index);
    });
});

function buttonClickHandler(event){
    
    var isLeft = $.contains($("#leftResources")[0], event.target);
    var isBuy = $(event.target).is(".buy");
    var commodityName = $(event.target).parent().data("name");
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
        if(players[isLeft].money < activeCommodity.getPrice()){
            alert("Not enough money!");
            return;
        }
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
    this.money = isLeft?800:1000;
    this.moneyPerTurn = 0;
    this.autobuys = [];
    this.effects = [{
        resolve:function(){
            this.player.addMoney(this.player.moneyPerTurn);
        },
        player: this,
        description: "Makes $0 per turn automatically.",
        updateDescription: function(){
            this.description = "Makes $"+this.player.moneyPerTurn+" per turn automatically."
        }
    }];
    this.setMoney = function(money){
        this.money = money;
        if(this.money >= winConditionMoneyAmount){
            alert((this.isLeft?"Left":"Right" ) + " wins!");
        }
        updateMoney();
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
    this.removeAutobuy = function(effect){
        this.autobuys.splice(this.autobuys.indexOf(effect), 1);
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
    this.imgHTML = "<img src='/spender/images/"+this.name.toLowerCase()+".png'</img>";
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
    case "iron": return 2;
    case "gold": return 3;
    case "diamond" : return 4;
    default: throw "Name '"+name+"' does not represent a commodity.";
    }
};
Commodity.getByName = function(name){
    return commodities[Commodity.getIdByName(name)];
};

var commodities = [
    new Commodity("Wood",0),
    new Commodity("Stone",1),
    new Commodity("iron",2),
    new Commodity("gold",3),
    new Commodity("diamond",4),
];

Commodity.wood = commodities[0];
Commodity.stone = commodities[1];
Commodity.iron = commodities[2];
Commodity.gold = commodities[3];
Commodity.diamond = commodities[4];

var Deal = function(type, optionalParameter){
    
    this.optionalParameter = optionalParameter;
    this.type = type;
    
    this.generatePriceDescription = function(){
        
        result = "";
        
        this.amounts.forEach(function(element, index){
            if(element){
                for(var i = 0; i < element; i++){
                    result += commodities[this.commodityOrder[index]].imgHTML;
                }
                result+="<br>";
            }
        }, this);
        
        return result;
        
    }
    
    switch(type){
    case "market":
        this.amounts = [5, 2, 2, 0, 0];
        this.moneyPerTurn = 150;
        this.commodityOrder = shuffle([0,1,2,3,4]);
        
        this.benefitDescription = "<span class='greenText'>+$"+this.moneyPerTurn+"/turn</span><br>";
        
        console.log("Order for random deal: "+this.commodityOrder);
        
        this.priceDescription = this.generatePriceDescription();
        
        this.resolve = function(player){
            player.moneyPerTurn+=this.moneyPerTurn;
            player.effects[0].updateDescription();
            updateEffects();
            new Deal("market").populate(this.index);
        }
        
        break;
    case "markup":
        this.amounts = [3, 1, 1, 0, 0];
        this.markup = 300;
        this.commodityOrder = shuffle([0,1,2,3,4]);
        
        this.benefitDescription = "<span class='greenText'>+$"+this.markup+"</span><br>";
        
        console.log("Order for random deal: "+this.commodityOrder);
        
        this.priceDescription = this.generatePriceDescription();
        
        this.resolve = function(player){
            player.addMoney(this.markup);
            this.amounts.forEach(function(element, index){
                var activeCommodity = commodities[this.commodityOrder[index]];
                for(var i = 0; i < element; i++){
                    player.addMoney(activeCommodity.sell());
                }
            }, this);
            new Deal("markup").populate(this.index);
        }
        
        break;
    case "autobuy":
        
        this.commodityBought = commodities[this.optionalParameter];
        
        this.benefitDescription = this.commodityBought.imgHTML+
            "<span class='greenText'>Autobuy</span><br>";
        this.priceDescription = "End Turn<br>$100<br>";
        this.resolve = function(player){
            player.autobuys.push({
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
                description: this.commodityBought.imgHTML
            });
            updateEffects();
        };
        break;
    }
    this.populate = function(index){
        deals[index] = this;
        this.index = index;
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
        switch(this.type){
        case "markup":
        case "market":
            this.amounts.forEach(function(element, index){
                console.log("checking if "+element+" "+commodities[this.commodityOrder[index]].name+" exist");
                if(activePlayer.commodityAmounts[this.commodityOrder[index]] < element){
                    alert("Not enough "+commodities[this.commodityOrder[index]].name + "!");
                    throw "Not enough."
                }
                
            }, this);
            this.amounts.forEach(function(element, index){
                activePlayer.commodityAmounts[this.commodityOrder[index]]-=element;
            }, this);
            break;
        case "autobuy":
            if(activePlayer.money < 100){
                alert("Not enough money!");
                throw "Not enough."
            }
            activePlayer.addMoney(-100);
            /*if(activePlayer.commodityAmounts[this.optionalParameter] < 2){
                alert("Not enough "+commodities[this.optionalParameter].name + "!");
                throw "Not enough.";
            }
            activePlayer.commodityAmounts[this.optionalParameter] -= 2;*/
            break;
        }
        updateCommodityAmounts();
        this.resolve(activePlayer);
        switch(this.type){
        case "autobuy":
            nextTurn();
            break;
        }
    }
};

function updateMoney(){
    $("#leftInfo .moneyInfo").html("<span>$"+players[1].money+"</span>");
    $("#rightInfo .moneyInfo").html("<span>$"+players[0].money+"</span>");
}

function updateCommodityAmounts(){
    updateCommodityAmountsTable($("#leftResourcesTable"), true);
    updateCommodityAmountsTable($("#rightResourcesTable"), false);
}

function updateCommodityAmountsTable(table, isLeft){
    //Two children calls to bypass <tbody>
    table.children().children().each(function(index){
        $(this).children(".amount").html(
            players[isLeft].commodityAmounts[index]
        );
    });
}

function updateEffects(){
    $("#leftInfo .factoryInfo").html(players.left.effects.map(
        function(element){
            return element.description;
        }
    ).join("<br>") + "<br> Autobuys: <br>" + players.left.autobuys.map(
        function(element){
            return element.description;
        }
    ));
    $("#rightInfo .factoryInfo").html(players.right.effects.map(
        function(element){
            return element.description;
        }
    ).join("<br>") + "<br> Autobuys: <br>" + players.right.autobuys.map(
        function(element){
            return element.description;
        }
    ).join(" "));
}

function updatePrices(){
    //Two children calls to bypass <tbody>
    $("#pricesTable").children().children().each(function(index){
        $(this).children(".pricesCommodityValue").html(
            "$" + commodities[index].getPrice()
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
        element.resolve(players[isLeftTurn])
    });
    players[isLeftTurn].autobuys.forEach(function(element){
        var result = element.resolve(players[isLeftTurn])
        if(result)
            deadEffects.push(result);
    })
    deadEffects.forEach(function(element){
        players[isLeftTurn].removeAutobuy(element);
    })
    updateEffects();
    updatePrices();
    updateCommodityAmounts();
    updateMoney();
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