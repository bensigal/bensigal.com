var canvas, ctx, startTime;
var currentMenuOptions = ["start"];
var optionSelected = 0;
var scene = "menu";
var balance = new Balance(0);
var speed = 0.04;
var keyboard = {
    left:false
}

$(function(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext("2d");
    lastTime = new Date().getTime();
    window.requestAnimationFrame(drawFrame);
});
function drawFrame(timestamp){
    try{
        ctx.clearRect(0,0,800,600);
        window.requestAnimationFrame(drawFrame);
        startTime = startTime || timestamp;
        var dt = timestamp - lastTime;
        lastTime = timestamp;
        var timeElapsed = timestamp - startTime;
        switch(scene){
        case "menu":
            drawMenu(dt, timeElapsed);
            break;
        case "game":
            drawGame(dt, timeElapsed);
            break;
        }
    }catch(e){
        console.log(e.stack)
        if(confirm(e))window.requestAnimationFrame(drawFrame);
    }
}
function drawGame(dt, timeElapsed){
    ctx.fillRect(0,299,800,2);
    balance.tick(dt);
    balance.draw();
}
function drawMenu(dt, timeElapsed){
    ctx.fillStyle = "black";
    ctx.font = "12px Arial"
    
    currentMenuOptions.forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 300 + 40 * (index-currentMenuOptions.length/2))
    });
}
$(document).keydown(function(e){
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 39:
        keyboard.right = true;
        break;
    }
});
$(document).keyup(function(e){
    switch(e.keyCode){
    case 13:
        if(scene == "menu"){
            scene = "game";
        }
        break
    case 37:
        keyboard.left = false;
        break;
    case 39:
        keyboard.right = false;
        break;
    }
});