var out = {val:"", log:function(toLog){this.val+=toLog;}};
var board;
var newBoard;
var layoutGenerated = false; 
var editMode =1;
var oldLength=0;

$.ajaxSetup({error: function(xhr, status, error){
    if(xhr.status == 403){
        alert("You must be logged in to edit the starchart.");
        $(document.body).prepend("<h3>Note: Editing the starchart requires a <a href='/login?trailblazer/starchartonline'>login</a>. You can keep looking at it though.</h3>");
        $("button:not(.noLoginRequired)").prop("disabled", true);
    }else{
        alert("Error "+xhr.status+": "+error);
    }
}});
$(function(){
    $.get("/server/login", function(data){
        if(data != "true"){
            $(document.body).prepend("<h3>Note: Editing the starchart requires a <a href='/login?trailblazer/starchartonline'>login</a>. You can keep looking at it though.</h3>");
            $("button:not(.noLoginRequired)").prop("disabled", true);
        }
    });
});
$.get("/trailblazer/tables.json", function(data){
    tables=data;
});
setInterval(function(){
    var expectedValue = tables.priceDetermination[$("option:selected").val()][$("#numberSold").val()][$("#demandNumber").val()];
    if(expectedValue!=$("#result").text())
        $("#result").text(expectedValue);
}, 100);
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
//Random integer from 1-6
function d6(){
    return Math.ceil(Math.random()*6);
}
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
    postData();
    alert("Rolled a "+roll+", production changed by "+change+".");
}
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
    postData();
    alert("Rolled a "+roll+", demand number changed by "+change+".")
}
function changeEditMode(){
    editMode++;
    editMode%=2;
    generateLayout();
}
//Generate tabs if necessary, replace tables if necessary
function chartData(data){
    //console.log("chart");
    board = JSON.parse(data);
    var startTime = new Date().getTime();
    if(oldLength != board.stars.length)generateLayout();
    else{ 
        board.stars.forEach(function(element, index){
            $("#"+element.name+" .starChart").html(starRows(element, index));
        });
    }
    //console.log(new Date().getTime() - startTime)
}
function starsEqual(s1, s2){
    if(s1.name != s2.name)return;
    if(s1.type != s2.type)return;
    if(s1.goodsSupply.length != s2.goodsSupply.length)return;
    if(s1.goodsDemand.length != s2.goodsSupply.length)return;
    s1.goodsSupply.forEach
}
function generateLayout(){
    var html="<div id='tabs'><ul>";
    board.stars.forEach(function(element, index){
        html+="<li><a href='#"+element.name+"'>"+element.name+"</a></li>";
    });
    html+="<li><a href='#options'>Tools</a></li></ul>";
    board.stars.forEach(function(element, starIndex){
        html+="<div id='"+element.name+"' class='tab-aim'><table class='starChart'>"
        html+=starRows(element, starIndex);
        html+="</table><button onclick='deleteStar("+starIndex+")'>Delete Star</button></div>";
    });
    html+="<div id='options'>"
    html+="</div>"
    console.log(html);
    $("#main").html(html);
    $("#options").html($("#hidden").html());
    $("#tabs").tabs();
    $("#tabs").tabs("refresh");
    layoutGenerated = true;
    oldLength = board.stars.length;
}
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
function chartAllStars(){
    var html="<table class='starChart'>";
    board.stars.forEach(function(element, index){
        html+=starRows(element, index);
    });
    html+="</table>";
    $("#main").html(html);
}