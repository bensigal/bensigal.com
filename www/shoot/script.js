var canvas, ctx, mainLoopIntervalCode, player, bullets, ticks, level,
    upgrades;

var keyboard = {};
var stopped = false;
var lastKeys=[];

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white";
    
    ctx = canvas.getContext("2d");
    ctx.textAlign = "right";
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
    player = new Player();
    
    bullets = [];
    upgrades = [];
    paused = false;
    ticks = 0;
    level = 1;
    
    upgrades.push(new Upgrade());
}
$(start);
function mainLoop(){
    if(paused)return;
    ctx.clearRect(0,0,800,600);
    
    player.tick();
    player.draw();
    
    bullets.forEach(function(bullet){
        bullet.tick();
        bullet.draw();
    });
    if(bullets[0] && bullets[0].y < -bullets[0].h){
        bullets.shift();
    }
    
    upgrades.forEach(function(upgrade){
        upgrade.tick();
        upgrade.draw();
    });
    
    ticks++;
    
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Level: ", 700, 20);
    ctx.textAlign = "right";
    ctx.fillText(level, 790, 20);
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
        }else if(paused){
            paused = false;
        }else{
            paused = true;
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