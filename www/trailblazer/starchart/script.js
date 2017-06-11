var out = {val:"", log:function(toLog){this.val+=toLog;}};
var board;
function d6(){
    return Math.ceil(Math.random()*6);
}
getData();
$(function(){
});
function getData(){
    $.get("starchart/get", (data)=>{
        board = JSON.parse(data);
        chartData();
    });
}
function postData(){
    $.post("starchart/set", {data:JSON.stringify(board)}, function(data){
        board = JSON.parse(data);
        chartData();
        console.log("CHANGE")
    })
}
function takeProductionFrom(starIndex, goodIndex){
    board.stars[starIndex].goodsSupply[goodIndex].production--;
    postData();
}
function addProductionTo(starIndex, goodIndex){
    board.stars[starIndex].goodsSupply[goodIndex].production++;
    postData();
}
function takeDemandFrom(starIndex, goodIndex){
    board.stars[starIndex].goodsDemand[goodIndex].demandNumber--;
    postData();
}
function addDemandTo(starIndex, goodIndex){
    board.stars[starIndex].goodsDemand[goodIndex].demandNumber++;
    postData();
}
function chartData(){
    if(!board)return;
    var starChartHtml="";
    var starChart2Html="";
    var even = true;
    board.stars.forEach(function(element, index){
        var starIndex = index;
        var html
        html+="<tr><th colspan=5 class=starName>"+element.name+" ("+element.type+")</th></tr>";
        html+="<tr><th>Supplied Good</th><th>Price Multiple</th><th>Production</th><td></td><th>Edit Production</th></tr>";
        element.goodsSupply.forEach(function(element, index){
            html+="<tr><td>"+element.type+"</td>";
            html+="<td>"+element.priceMultiple+"</td>";
            html+="<td>"+element.production+"</td><td></td>";
            html+="<td><button onclick='takeProductionFrom("+starIndex+", "+index+")'>-</button>"
            html+="<button onclick='addProductionTo("+starIndex+", "+index+")'>+</button></td></tr>"
        });
        html+="<tr><th>Demanded Good</th><th>Demand Letter</th><th>Demand Modifier</th><th>Demand Number</th><th>Edit Demand Number</th></tr>";
        element.goodsDemand.forEach(function(element){
            html+="<tr><td>"+element.type+"</td>";
            html+="<td>"+element.demandLetter+"</td>";
            html+="<td>"+element.demandModifier+"</td>";
            html+="<td>"+element.demandNumber+"</td>";
            html+="<td><button onclick='takeDemandFrom("+starIndex+", "+index+")'>-</button>"
            html+="<button onclick='addDemandTo("+starIndex+", "+index+")'>+</button></td></tr>"
        });
        if(even)
            starChartHtml+=html;
        else
            starChart2Html+=html;
        even=!even;
    });
    $("#starChart").html(starChartHtml);
    $("#starChart2").html(starChart2Html);
}