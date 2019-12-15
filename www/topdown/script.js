var canvas, ctx, mainLoopInterval, ticks, lastTime;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];

$(function(){
    lastTime = new Date().getTime();
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white"
    
    ctx = canvas.getContext("2d");
    
    scene = "game";
    
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    })
    
    gameSceneSetup();
	
    window.requestAnimationFrame(animationFrame);
	
});
function animationFrame(timestamp){
    var dt = timestamp - lastTime;
	if(dt > 100)dt = 100;
    lastTime = timestamp;
    ctx.clearRect(0,0,800,600);
    try{
        switch(scene){
        case "game":
            gameScene(dt);
            break;
        }
    }catch(e){
        console.error(e.message)
        console.error(e.stack)
    }
    window.requestAnimationFrame(animationFrame);
}

$(document).keydown(function(e){
    var preventDefault = true;
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 38:
        keyboard.up = true;
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
        break;
    case 87:
        keyboard.w=true;
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        break;
    case 83:
        keyboard.s=true
        break;
    case 32:
        keyboard.space = true;
    default:
        preventDefault = false;
    }
    if(preventDefault)e.preventDefault();
});
$(document).keyup(function(e){
    switch(e.keyCode){
    case 37:
        keyboard.left = false;
        break;
    case 38:
        keyboard.up = false;
        break;
    case 39:
        keyboard.right = false;
        break;
    case 40:
        keyboard.down = false;
        break;
    case 87:
        keyboard.w=false;
        break;
    case 68:
        keyboard.d=false;
        break;
    case 65:
        keyboard.a=false;
        break;
    case 83:
        keyboard.s=false
        break;
    case 32:
        keyboard.space = false;
        break;
    }
})