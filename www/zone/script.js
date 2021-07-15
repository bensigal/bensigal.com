var canvas, ctx, ticks, topLeft, mainLoopIntervalCode;

var player1, player2;

var player1Handicap = 0;
var player2Handicap = 0;

var nextTick = new Date().getTime();

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
    color19:"#F00",
    color21:"#DDF",
    color22:"#AAF",
    color23:"#88F",
    color24:"#66F",
    color26:"#44F",
    color29:"#00F",
    color3: "#FFF",
    zoneText: "#000",
    glowText: "#0F0",
    darkGlowText:"#0C0",
    background: "#FAECFF"
};
var sprite = {};
var blocks, zones, zoneTexts, p1Points, p2Points;
var p1wins = 0;
var p2wins = 0;
var winner = "none";
var loopMode = "selectStage";

function init(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    ctx = canvas.getContext("2d");
    
    mainLoop();
}

function mainLoop(burnScreen){
    
    if(nextTick > new Date().getTime()){
        window.requestAnimationFrame(mainLoop);
        return;
    }
    
    ctx.clearRect(0,0,800,600);
    
    switch(loopMode){
    
    case "playing":
        drawMap();
        tick();
        break;
    case "finished":
    case "paused":
        drawMap();
        break;
    case "selectStage":
        selectStageDraw(burnScreen);
        break;
    }
    
    nextTick += 16;
    if(nextTick < new Date().getTime()){
        mainLoop();
    }
    else
        window.requestAnimationFrame(mainLoop);
    
}

function start(){
    
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
    
    ticks = 1201;
    
    ctx.textAlign = "center";
    
    mainLoop();
    
    winner = "none";
}
$(init);

function selectStageDraw(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "black";
    
    ctx.textAlign = "right";
    ctx.font = "90px Ubuntu";
    ctx.fillText("W: ", 160, 100);
    ctx.fillText("S: ", 160, 200);
    ctx.fillText("A: ", 160, 300);
    ctx.fillText("D: ", 160, 400);
    
    ctx.textAlign = "left";
    ctx.font = "50px Ubuntu";
    ctx.fillText("Original", 160, 100);
    ctx.fillText("Modified", 160, 200);
    ctx.fillText("Payoff", 160, 300);
    ctx.fillText("Maze", 160, 400);
    
    ctx.textAlign = "center";
    
    nextTick += 16;
    if(nextTick < new Date().getTime())
        mainLoop();
    else
        window.requestAnimationFrame(mainLoop);
}

function tick(){
    for(var zone of zones){
        zone.tick();
    }
    
    player1.tick();
    
    player2.tick();
    
    p1points += player1Handicap/5
    p1points -= player2Handicap/5
    
    p1points += player1.points/5;
    p1points -= player2.points/5;
    
    if(p1points > 800)
        p1points = 800;
    if(p1points < 0)
        p1points = 0;
        
    
    ticks--;
    
    player1.points = 0;
    player2.points = 0;
    
    if(ticks <= 0){
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
            nextTick += 1000;
        }else if(p1In){
            win(false);
        }else if(p2In){
            win(true);
        }
    }
    
    if(map.w100SlowZones){
        ctx.strokeStyle = "#0F3";
        ctx.beginPath();
        var x = 50+Math.sin(ticks/15)*50
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 450);
        ctx.moveTo(800-x, 0);
        ctx.lineTo(800-x, 450);
        ctx.closePath();
        ctx.stroke();
    }
}

function drawMap(){
    
    ctx.font = "30px Ubuntu";
    for(var i = zones.length; i--; i >=0){
        zones[i].draw();
    }
    
    ctx.fillStyle = "#444";
    ctx.fillRect(400,0,1,600);
    for(var block of blocks){
        block.draw();
    }
    
    player1.draw();
    player2.draw();
    
    p2points = 800 - p1points;
    
    ctx.fillStyle = "#F44";
    ctx.fillRect(0, 580, p1points, 20);
    
    ctx.fillStyle = "#33F";
    ctx.fillRect(p1points, 580, p2points, 20);
    
    ctx.fillStyle = "white";
    ctx.fillRect(399, 570, 3, 30);
    
    ctx.font = "30px Ubuntu";
    ctx.fillStyle = "white";
    if(ticks < 300){
        ctx.font = "80px Ubuntu";
    }
    ctx.fillText(Math.round(ticks/6)/10, ticks<300?400:50, ticks<300?510:550);
    
    if(loopMode == "paused"){
        ctx.font = "30px Ubuntu"
        ctx.fillText("Space to Unpause", 400, 520);
        nextTick += 16;
        if(nextTick < new Date().getTime()){
            mainLoop();
            console.log("Catchup")
        }
        else
            window.requestAnimationFrame(mainLoop);
        return;
    }
    
    ctx.font = "50px Ubuntu";
    switch(winner){
    case "1":
        ctx.fillText("Red Wins!", 400, 555);
        break;
    case "2":
        ctx.fillText("Blue Wins!", 400, 555);
        break;
    case "tie":
        ctx.fillText("It's a tie!", 400, 555);
        break;
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
            map = maps.modified;
            start();
            loopMode = "paused";
        }
        break;
    case 81:
        keyboard.q = true;
        if(loopMode == "selectStage" && e.altKey){
            var response = prompt("Enter a code");
            response = response.split("-");
            if(response[0] == "handicap"){
                if(response[1]=="left"){
                    player1Handicap = response[2];
                }
                else if(response[1]=="right"){
                    player2Handicap = response[2];
                }
            }
            if(response[0] == "reset"){
                player1Handicap = 0;
                player2Handicap = 0;
            }
        }
        break;
    case 68:
        keyboard.d=true;
        if(loopMode == "selectStage"){
            map = maps.modified;
            start();
            loopMode = "paused";
        }
        break;
    case 65:
        keyboard.a=true;
        if(loopMode == "selectStage"){
            map = maps.modified;
            start();
            loopMode = "paused";
        }
        break;
    case 83:
        keyboard.s=true;
        if(loopMode == "selectStage"){
            map = maps.modified;
            start();
            loopMode = "paused";
        }
        break;
    case 32:
        if(loopMode == "finished"){
            start();
            loopMode = "playing";
        }else if(loopMode == "paused"){
            loopMode = "playing";
        }else if(loopMode == "playing"){
            loopMode = "paused";
        }
        break;
    case 77:
        if(loopMode == "paused" || loopMode == "finished"){
            loopMode = "selectStage";
        }else if(loopMode == "selectStage"){
            loopMode = "paused";
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

function win(isp1){
    
    winner = isp1?"1":"2";
    
    if(isp1)p1wins++;
    else p2wins++;
    
    $("#score").html(p1wins + " - " + p2wins);
    
    loopMode = "finished";
}
function tie(){
    winner = "tie";
    loopMode = "finished";
}

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