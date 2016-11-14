var canvas, ctx, ticks, topLeft, mainLoopIntervalCode;

var player1;

var keyboard = {};
var theme = {
    player1Color: "#A00",
    player2Color: "#00A",
    blockColor: "black",
    color11:"#FDD",
    color12:"#FAA",
    color13:"#F88",
    color14:"#F66",
    color16:"#F44",
    color21:"#DDF",
    color22:"#AAF",
    color23:"#88F",
    color24:"#66F",
    color26:"#44F",
    color3: "#FFF",
    zoneText: "#000",
    glowText: "#0F0",
    darkGlowText:"#0C0",
    background: "#FAECFF"
};
var sprite = {};
var stopped = false;
var paused = false;
var blocks, zones, zoneTexts, p1Points, p2Points
var p1wins = 0;
var p2wins = 0;
var loopMode = "selectStage"

function win(isp1){
    paused = true;
    
    if(isp1)p1wins++;
    else p2wins++;
    
    $("#score").html(p1wins + " - " + p2wins);
    
    stopped = true;
    ctx.font = "50px Ubuntu";
    ctx.fillText((isp1?"Red":"Blue")+" Wins!", 400, 550);
}
function tie(){
    paused = true;
    stopped = true;
    ctx.font = "30px Ubuntu";
    ctx.fillText("That's odd... They're identical!!!", 400, 550);
}

function init(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    ctx = canvas.getContext("2d");
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
}

function start(){
    
    loopMode = "playing";
    
    console.log("Starting game...");
    
    player1 = new Player(1);
    player2 = new Player(2);
    
    blocks = map.blocks;
    zoneTexts = map.zoneTexts;
    zones = map.zones;
    
    for(var i = 0; i < zones.length; i++){
        zoneTexts[i].zone = zones[i];
        zones[i].text = zoneTexts[i];
    }
    
    topLeft = {x:0,y:0};
    
    ctx.font = "30px Ubuntu";
    
    stopped=false;
    
    p1points = 400;
    p2points = 400;
    
    ticks = 1801;
    
    ctx.textAlign = "center";
    
    paused = true;
    
    mainLoop(true);
}
$(init);

function selectStageDraw(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "black";
    
    ctx.textAlign = "right";
    ctx.font = "90px Ubuntu";
    ctx.fillText("W: ", 160, 100)
    ctx.fillText("A: ", 160, 200)
    ctx.fillText("S: ", 160, 300)
    
    ctx.textAlign = "left";
    ctx.font = "50px Ubuntu";
    ctx.fillText("Original", 160, 100)
    ctx.fillText("Maze", 160, 200)
    ctx.fillText("Pyramid", 160, 300)
    
    ctx.textAlign = "center";
}

function mainLoop(burnScreen){
    
    if(paused && !burnScreen)return;
    
    ctx.clearRect(0,0,800,600);
    
    if(loopMode != "playing"){
        switch(loopMode){
        
        case "selectStage":
            selectStageDraw();
            break;
        
        }
        return;
    }
    
    ctx.font = "30px Ubuntu"
    for(var zone of zones){
        zone.tick();
    }
    for(var i = zones.length; i--; i >=0){
        zones[i].draw();
    }
    
    player1.tick();
    
    player2.tick();
    
    ctx.fillStyle = "#444";
    ctx.fillRect(400,0,1,600);
    for(var block of blocks){
        block.draw();
    }
    
    player1.draw();
    player2.draw();
    
    p1points += player1.points/5;
    p1points -= player2.points/5;
    
    if(p1points > 800)
        p1points = 800;
    if(p1points < 0)
        player1Poits = 0;
        
    p2points = 800 - p1points;
    
    ctx.fillStyle = "#F44";
    ctx.fillRect(0, 580, p1points, 20);
    
    ctx.fillStyle = "#33F";
    ctx.fillRect(p1points, 580, p2points, 20);
    
    ctx.fillStyle = "white";
    ctx.fillRect(399, 570, 3, 30);
    
    ticks--;
    
    player1.points = 0;
    player2.points = 0;
    
    ctx.fillStyle = "white";
    if(ticks < 300){
        ctx.font = "80px Ubuntu"
    }
    ctx.fillText(Math.round(ticks/6)/10, ticks<300?400:50, ticks<300?520:550);
    
    if(ticks === 0){
        if(p1points > p2points){
            win(true);
        }else if(p2points > p1points){
            win(false);
        }else{
            tie();
        }
    }
    
    if(rectangularCollisionTest(player1, player2)){
        var p1In = player1.x + player1.w > 400;
        var p2In = player2.x < 400;
        if(p1In && p2In){
            player1.velocity.x = -10;
            player2.velocity.x = 10;
            player1.x -=20;
            player2.x +=20;
            ctx.font = "30px Ubuntu"
            ctx.fillText("Don't cross the beams!", 400, 500)
            clearInterval(mainLoopIntervalCode);
            setTimeout(function(){
                mainLoopIntervalCode = setInterval(mainLoop, 16);
            }, 1000);
        }else if(p1In){
            win(false);
        }else if(p2In){
            win(true);
        }
    }
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
        if(loopMode == "selectStage"){
            map = maps.original;
            start();
        }
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        if(loopMode == "selectStage"){
            map = maps.maze;
            start();
        }
        break;
    case 83:
        keyboard.s=true;
        if(loopMode == "selectStage"){
            map = maps.pyramid;
            start();
        }
        break;
    case 32:
        if(stopped){
            start();
            console.log("Starting game...")
            paused=false;
        }else if(paused && loopMode == "playing"){
            console.log("Unpausing game...")
            paused = false;
        }else if(loopMode == "playing"){
            console.log("Pausing game...")
            ctx.font = "50px Ubuntu"
            ctx.fillText("Paused", 400, 520);
            paused = true;
        }
        break;
    case 77:
        if(paused && !stopped && loopMode == "playing"){
            loopMode = "selectStage";
            mainLoop(true);
        }else if(loopMode == "selectStage"){
            loopMode = "playing";
            mainLoop(true);
        }
        break;
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
        keyboard.s=false;
        break;
    case 77:
        break;
    }
});

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