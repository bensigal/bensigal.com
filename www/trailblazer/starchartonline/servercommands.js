function getData(){
    $.get("get", chartData);
}
getData();
//getDataInterval = setInterval(getData, 500);
function generateStar(){
    $.post("newstar", 
        {name:prompt("What is the new star's name?"), type:prompt("What type is the new star?")}, chartData
    );
}
function resetAdvanced(){
    if(!confirm("Are you sure? This will destroy the current save game."))return;
    $.get("init/advanced", chartData);
}
function resetNormal(){
    if(!confirm("Are you sure? This will destroy the current save game."))return;
    $.get("init", chartData);
}
function postData(){
    $.post("set", {data:JSON.stringify(board)}, chartData);
    console.log("post");
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
function deleteStar(index){
    if(!confirm("Are you sure you would like to delete this star? This decision is not reversible."))return;
    else $.post("deletestar", {index:index}, chartData)
}