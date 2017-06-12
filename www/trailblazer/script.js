var tables;
$.get("tables.json", function(data){
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