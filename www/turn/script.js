var canvas, ctx, mainLoopInterval, ticks, lastTime, timePassed, level;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];

function resetGame(){
    level = 0;
    timePassed = 0;
}

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
    
    resetGame();
    window.requestAnimationFrame(animationFrame);
});
function animationFrame(timestamp){
    var dt = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,800,600);
    try{
        switch(scene){
        case "game":
            mainLoop(dt, timestamp);
            break;
        }
    }catch(e){
        console.error(e.message)
        console.log(e.stack)
    }
    window.requestAnimationFrame(animationFrame);
}
function mainLoop(dt, timestamp){
    
    timePassed += dt;
    ticks++;
    
    ctx.fillText("Hello", 100, 100);
    
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

function rectangularCollisionTest(a,b){
    
    var al = a.x;
    var ar = a.x+a.w;
    var at = a.y;
    var ab = a.y+a.h;
    
    var bl = b.x;
    var br = b.x+b.w;
    var bt = b.y;
    var bb = b.y+b.h;
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    )
}

function distance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}