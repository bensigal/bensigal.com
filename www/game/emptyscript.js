var canvas, ctx, mainLoopIntervalCode;

var keyboard = {};
var stopped = false;
var lastKeys=[];

var themes = {
    basic:{
        player:"black",
        background:"white",
        enemy:"#F00",
        powerup:"#1F4",
        dead:"#F33",
        text:"black",
        outline:"black",
        stewart:"#00F"
    }
}
var theme = themes.basic;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background
    
    ctx = canvas.getContext("2d");
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
    stopped=false;
}
$(start);
function mainLoop(){
    ctx.clearRect(0,0,800,600)
    ticks++;
}
$(document).keydown(function(e){
    e.preventDefault();
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
        if(stopped){
            start();
        }
    }
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