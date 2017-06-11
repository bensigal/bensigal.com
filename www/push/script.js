var canvas, ctx, mainLoopInterval, ticks, player;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];
var enemies;
var players, menuTicks, menuLoopInterval, gameType, scene, walls, p1Score, p2Score;
var options = [
    ["begin"]
];
var onMenu = true;
var optionSelected = 0;
var depth = 0;

//DEBUG
window.onerror=function(msg){
    alert(msg);
    return false;
}

function resetGame(){
    
    players = [new Player(1), new Player(2)];
    
    walls = [];
    for(var i = 0; i < 9; i++){
        walls.push(new Wall(i));
    }
    
    ticks = -1;//game finishes loop, this is asynchronous really. make sure the first enemy spawns
    
    p1Score = 0;
    p2Score = 0;
    
}
function selectMenuOption(index){
    optionSelected = 0;
    if(options[depth][index]=="back")return depth--;
    resetGame();
    onMenu = false;
}
$(function(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 594;
    canvas.style.background="white"
    
    ctx = canvas.getContext("2d");
    
    mainLoopInterval = setInterval(mainLoop, 16);
    
    stopped=false;
    paused =false;
    
    scene = "menu";
    menuTicks=0;
    
});
function menuLoop(){
    ctx.clearRect(0,0,800,594);
    menuTicks++;
    
    ctx.fillStyle = "black";
    ctx.font = "12px Arial"
    
    options[depth].forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 300 + 40 * (index-options.length/2))
    });
}
function drawAll(){
    
    ctx.clearRect(0,0,800,594);
    
    ctx.fillStyle = "#DFDFDF";
    ctx.font = "400px Arial";
    ctx.fillText(p1Score, 200, 300);
    ctx.fillText(p2Score, 600, 300);
    
    players.forEach(function(player){
        player.draw();
    });
    
    walls.forEach(function(wall){
        wall.draw();
    });
    
}
function mainLoop(){
    if(paused)return;
    if(onMenu)return menuLoop();

    drawAll();
    
    players.forEach(function(player){
        player.tick();
    });
    
    walls.forEach(function(wall){
        wall.tick();
    });

    ticks++;
}
$(document).keydown(function(e){
    var defaultBehavior = false;
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 38:
        keyboard.up = true;
        if(onMenu){
            optionSelected = Math.max(0, optionSelected-1);
        }
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
        if(onMenu){
            optionSelected = Math.min(options[depth].length-1, optionSelected+1);
        }
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
    case 13:
        if(stopped){
            break;
        }else if(paused){
            paused = false;
        }
        if(onMenu){
            selectMenuOption(optionSelected);
        }
        break;
    case 80:
        if(stopped){
            break;
        }else if(paused){
            paused = false;
        }else if(!onMenu){
            paused = true;
        }
        break;
    default:
        defaultBehavior=true;
        break;
    }
    if(!defaultBehavior){
        e.preventDefault();
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