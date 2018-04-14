var canvas, ctx, mainLoopInterval, ticks, lastTime, timePassed, level;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];
var waitingForAttackChoice = true;
const PSTC = " Press space to continue.";

function resetGame(){
    timePassed = 0;
    level = 1;
    player.init();
    enemy.init();
}

$(function(){
    window.onerror = function(message, source, lineno, colno, error){
        alert(message+"Found in "+source+" at line "+lineno+", column "+colno+". "+error);
        return true;
    };
    lastTime = new Date().getTime();
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white";
    
    ctx = canvas.getContext("2d");
    
    scene = "game";
    
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    
    resetGame();
    window.requestAnimationFrame(animationFrame);
});
function finishAttack(){
    shadow.show = false;
    message.message += " Press space to continue.";
}
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
        console.error(e.message);
        console.log(e.stack);
    }
    window.requestAnimationFrame(animationFrame);
}
function mainLoop(dt, timestamp){
    
    timePassed += dt;
    player.tick(dt);
    
    message.draw();
    shadow.draw();
    player.draw();
    enemy.draw();
    
    ctx.font = "20px 'Ubuntu Mono'";
    ctx.fillStyle = "black";
    ctx.fillText("Player health: "+player.health, 40, 40);
    ctx.fillText("Enemy health: "+enemy.health, 40, 80);
    
}
function activateAttack(key){
    if(player.moving || !waitingForAttackChoice)return;
    waitingForAttackChoice = false;
    player.adoptPattern(movementPatterns.test);
}
function nextTurn(){
    message.create("Choose an attack! W: Jump, A: Charge, S: Backstab, D: Do nothing");
    waitingForAttackChoice = true;
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
        activateAttack("w");
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        break;
    case 83:
        keyboard.s=true;
        break;
    case 32:
        keyboard.space = true;
        if(player.moving){
            player.hit();
        }else if(message.callback){
            message.callback();
        }
        break;
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