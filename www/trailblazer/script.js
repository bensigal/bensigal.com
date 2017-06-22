var tables, board;
var oldLength = 0;
var editMode = 1;

if(typeof(Storage)===undefined){
    alert("This page requires HTML5 Local Storage, which your browser does not support.");
    history.back();
}

//Get the tables from the back of the rules
$.get("/trailblazer/tables.json", function(data){
    tables = data;
    if(localStorage.board){
        //If game already exists, load that
        board = JSON.parse(localStorage.board);
    }else{
        //Otherwise set up default
        constructDefaultBoardOther();
    }
    chartData();
});
//This is hilariously stupid. Instead of spending 5 seconds to look up the event, just update
//the result every 1/10th of a second.
setInterval(function(){
    var expectedValue = tables.priceDetermination[$("option:selected").val()][$("#numberSold").val()][$("#demandNumber").val()];
    if(expectedValue!=$("#result").text())
        $("#result").text(expectedValue);
}, 100);
//For when randomized movement happens. Result is set to something like "Move 6 points to the Southeast"
function calculateRandomization(){
    var direction = [
        "Northwest",
        "North",
        "Northeast",
        "East",
        "Southeast",
        "South",
        "Southwest",
        "West",
        "Remain Still"
    ][Math.floor(Math.random()*9)];
    if(direction=="Remain Still")return $("#randomizationResult").text(direction);
    $("#randomizationResult").text("Move "+Math.ceil(Math.random()*6)+" points to the "+direction);
}
//Put the string version of the board into local storage
function saveBoard(){
    localStorage.board = JSON.stringify(board);
}
//Sol only
function constructDefaultBoardAdvanced(){
    board = {stars:[]};
    board.stars = tables.defaultBoardAdvanced.stars.map(createStarFromJSON);
}
//Sol and the 4 other planets with default values
function constructDefaultBoardOther(){
    board = {stars:[]};
    board.stars = tables.defaultBoardOther.stars.map(createStarFromJSON);
}
//Random integer 1-6
function d6(){
    return Math.ceil(Math.random()*6);
}
//Create star from object. Slight misnomer, does not expect a string value.
function createStarFromJSON(element){
    return new Star(element.name, element.type, element.goodsSupply.map(
        (element) => new SuppliedGood(element.name, element.priceMultiple, element.production)
    ), element.goodsDemand.map(
        (element) => new DemandedGood(element.name, element.demandLetter, element.demandModifier, element.demandNumber||element.demandModifier)
    ));
}
//Roll production based on index of star and good. Average price
//will be prompted for, something like "9/4" is fine if you don't
//want to calculate the decimal
function rollProduction(starIndex, goodIndex){
    
    var good = board.stars[starIndex].goodsSupply[goodIndex];
    
    var response = prompt("Average price?");
    if(!response)return;
    response = "("+response+")";
    
    //Don't feel like making/downloading math interpreter
    var averagePrice = eval(response);
    var roll = d6()+d6();
    var priceMultiple = Number(good.priceMultiple);
    var currentProduction = Number(good.production);
    var result = roll + Math.round(priceMultiple*averagePrice) - currentProduction;
    
    console.log("Rolled: "+roll);
    console.log("Price Multiple"+priceMultiple);
    console.log("Average Price: "+averagePrice);
    console.log("Current Production: "+currentProduction);
    
    var change = 0;
    
    if(result < 6){
        change = -1;
    }else if(result > 20){
        change = 2;
    }else if(result > 8){
        change = 1;
    }
    good.production = Number(good.production) + change;
    chartData();
    alert("Rolled a "+roll+", production changed by "+change+".");
}
//Change demand of given star and good
function rollDemand(starIndex, goodIndex){
    var good = board.stars[starIndex].goodsDemand[goodIndex];
    
    var response = prompt("What is the calculated advertisement bonus?");
    if(response === null)return;
    var advertisement = Number(response);
    var roll = d6()+d6();
    var demandModifier = Number(good.demandModifier);
    var demandNumber = Number(good.demandNumber);
    var result = roll + demandModifier - demandNumber + advertisement;
    
    console.log("Rolled: "+roll);
    console.log("Demand Modifier: "+demandModifier);
    console.log("Demand Number: "+demandNumber);
    console.log("Advertisement Bonus: "+advertisement);
    console.log("Result: "+result);
    
    var change = 0;
    
    if(result < 6 && demandNumber > 1){
        change = -1;
    }else if (result > 20 && demandNumber < 11){
        change = 2;
    }else if (result > 8 && demandNumber < 12){
        change = 1;
    }
    
    good.demandNumber = Number(good.demandNumber) + change;
    alert("Rolled a "+roll+", demand number changed by "+change+".")
    chartData();
}
//Switch from roll for number changes to manual +1 or -1.
function changeEditMode(){
    editMode++;
    editMode%=2;
    generateLayout();
}
//Generate tabs if necessary, replace tables if necessary
function chartData(){
    if(oldLength != board.stars.length)generateLayout();
    else{ 
        board.stars.forEach(function(element, index){
            $("#"+element.name+" .starChart").html(starRows(element, index));
        });
    }
    saveBoard();
}
//Add all the stars to tables, add stuff to tabs
function generateLayout(){
    var html="<div id='tabs'><ul>";
    board.stars.forEach(function(element, index){
        html+="<li><a href='#"+element.name+"'>"+element.name+"</a></li>";
    });
    html+="<li><a href='#options'>Tools</a></li></ul>";
    board.stars.forEach(function(element, starIndex){
        html+="<div id='"+element.name+"' class='tab-aim'><table class='starChart'>"
        html+=starRows(element, starIndex);
        html+="</table><button onclick='deleteStar("+starIndex+")'>Delete Star</button>";
        html+="<button onclick='addShipProduction("+starIndex+")'>Add Ship Production</button></div>";
    });
    html+="<div id='options'>"
    html+="</div>"
    $("#main").html(html);
    $("#options").html($("#hidden").html());
    $("#tabs").tabs();
    layoutGenerated = true;
    oldLength = board.stars.length;
}
//Return the html for the rows in a star. <tr> elements only, this is later inserted into more html.
function starRows(element, starIndex){
    var html = "";
    //html+="<tr><th colspan=5 class=starName>"+element.name+" ("+element.type+")</th></tr>";
    if(element.goodsSupply.length){
        html+="<tr><th>Supplied Good</th><th>Price Multiple</th><th>Production</th><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><th>Edit Production</th></tr>";
        element.goodsSupply.forEach(function(element, index){
            html+="<tr class='"+element.type+"'><td>"+element.type+"</td>";
            html+="<td>"+element.priceMultiple+"</td>";
            html+="<td>"+element.production+"</td><td></td>";
            if(editMode){
                //Die Roller
                html+="<td><button onclick='rollProduction("+starIndex+", "+index+")'>Roll</button>";
            }else{
                html+="<td><button onclick='takeProductionFrom("+starIndex+", "+index+")'>-</button>";
                html+="<button onclick='addProductionTo("+starIndex+", "+index+")'>+</button></td></tr>";
            }
        });
    }
    if(element.goodsDemand.length){
        html+="<tr><th>Demanded Good</th><th>Demand Letter</th><th>Demand Modifier</th><th>Demand Number</th><th>Edit Demand Number</th></tr>";
        element.goodsDemand.forEach(function(element, index){
            html+="<tr><td>"+element.type+"</td>";
            html+="<td>"+element.demandLetter+"</td>";
            html+="<td>"+element.demandModifier+"</td>";
            html+="<td>"+element.demandNumber+"</td>";
            if(editMode){
                //Die roller
                html+="<td><button onclick='rollDemand("+starIndex+", "+index+")'>Roll</button></tr>";
            }else{
                //Manual Edit
                html+="<td><button onclick='takeDemandFrom("+starIndex+", "+index+")'>-</button>"
                html+="<button onclick='addDemandTo("+starIndex+", "+index+")'>+</button></td></tr>"
            }
        });
    }
    return html;
}
//Generate a random star based on name and type. You still need to draw a random tile from the cup.
function generateStar(){
    var name = prompt("What is the new star's name?");
    if(name === null)return;
    var type = prompt("What type is the new star?");
    if(type === null)return;
    type = type.toUpperCase();
    board.stars.push(Star.createRandom(name, type))
    chartData();
}
function resetAdvanced(){
    if(!confirm("Are you sure? This will destroy the current save game."))return;
    constructDefaultBoardAdvanced();
    chartData();
}
function resetNormal(){
    if(!confirm("Are you sure? This will destroy the current save game."))return;
    constructDefaultBoardOther();
    chartData();
}
function takeProductionFrom(starIndex, goodIndex){
    board.stars[starIndex].goodsSupply[goodIndex].production--;
    chartData();
}
function addProductionTo(starIndex, goodIndex){
    board.stars[starIndex].goodsSupply[goodIndex].production++;
    chartData();
}
function takeDemandFrom(starIndex, goodIndex){
    board.stars[starIndex].goodsDemand[goodIndex].demandNumber--;
    chartData();
}
function addDemandTo(starIndex, goodIndex){
    board.stars[starIndex].goodsDemand[goodIndex].demandNumber++;
    chartData();
}
function addShipProduction(starIndex){
    var response = prompt("What will the price multiple be?");
    if(!response)return;
    var priceMultiple = Math.round(eval(response)*1000)/1000;
    board.stars[starIndex].goodsSupply.push(new SuppliedGood("Ships", priceMultiple, 1));
    chartData();
}
function deleteStar(index){
    if(!confirm("Are you sure you would like to delete this star? This decision is not reversible."))return;
    board.stars.splice(index, 1);
    chartData();
}