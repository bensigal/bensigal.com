var canvas, ctx, mainLoopInterval, ticks, lastTime, timePassed;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];
var enemies;
var options = [
    ["very easy", "easy", "classic", "hard", "implausible", "impossible"]
];
var onMenu = true;
var optionSelected = 0;
var depth = 0;
var enemyBaseSpeed = 1;
var destroyer = {
    draw: function(){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(players[0].x, players[0].y);
        ctx.lineTo(players[1].x, players[1].y);
        ctx.stroke();
        ctx.closePath();
    }
};

function resetGame(){
    enemies = [];
    lastSpawnTime = 0;
    level = 0;
    timePassed = 0;
    players = [new Player(1), new Player(2)];
    killed = 0;
    playerDead = false;
}
function selectMenuOption(index){
    difficulty = index;
    scene = "playing";
}
$(function(){
    lastTime = new Date().getTime();
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white"
    
    ctx = canvas.getContext("2d");
    
    stopped=false;
    paused =false;
    
    scene = "menu";
    menuTicks=0;
    
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
        case "menu":
            menuLoop(dt, timestamp);
            break;
        case "playing":
            mainLoop(dt, timestamp);
            break;
        }
    }catch(e){
        console.error(e.stack)
    }
    window.requestAnimationFrame(animationFrame);
}
function menuLoop(){
    menuTicks++;
    
    ctx.fillStyle = "black";
    ctx.font = "12px Arial"
    
    options[depth].forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 200 + 40 * (index))
    });
}
function mainLoop(dt, timestamp){
    
    if(playerDead && !paused){
        resetGame();
    }
    if(paused){
        dt = 0;
    }
    timePassed += dt;
    
    switch(difficulty){
    case 0:
        level = (2.5 + 50/(timePassed/1000 + 10))*1000;
        break;
    case 1:
        level = (1.2 + 12/(timePassed/1000 + 10))*1000;
        break;
    case 2:
        level = (0.8 + 8/(timePassed/1000 + 10))*1000;
        break;
    case 3:
        level = (0.4 + 4/(timePassed/1000 + 10))*1000;
        break;
    case 4:
        level = (0.2 + 2/(timePassed/1000 + 10))*1000;
        break;
    case 5:
        level = (0.25 * Math.pow(1/2, timePassed/10000)) * 1000; //starts at 1, halves every 10 seconds. This is impossible, as it will start spawning every tick.
        break;
    }
    
    if(timestamp - lastSpawnTime > level){
        lastSpawnTime = timestamp;
        enemies.push(new Enemy());
    }
    
    ctx.fillStyle = "#EFEFEF";
    ctx.font = "400px Arial";
    ctx.textAlign = "center";
    ctx.fillText(killed, 400, 400);
    
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "start";
    ctx.fillText("Arrow Keys / WASD to move the balls. Don't let the small dots hit you, destroy them with the line.", 20, 580)
    
    players.forEach(function(player){
        player.tick(dt);
        player.draw();
    });
    
    destroyer.draw();
    
    enemies.forEach(function(element){
        element.tick(dt);
        element.draw();
    });
    
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
    case 77:
        if(paused)
        scene = "menu";
        break;
    case 32:
        keyboard.space = true;
    case 13:
        if(stopped){
            break;
        }else if(paused){
            paused = false;
        }
        if(scene == "menu"){
            selectMenuOption(optionSelected);
        }
        break;
    case 80:
        if(stopped){
            break;
        }else if(paused){
            paused = false;
        }else if(scene != "menu"){
            paused = true;
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

//Probably hugely inefficient, couldn't think of an easier way to do it
function pointDistanceFromLine(px,py,lx1,ly1,lx2,ly2){
    var lineSlope = (ly2-ly1)/(lx2-lx1);
    
    // y - y1 = m(x - x1)
    // y = mx - mx1 + y1
    //when x=0, y=-mx1+y1
    
    //Where the given line intersects the y axis
    var lineYInt = -lineSlope * lx1 + ly1;
    
    //Slope of any line perpendicular to given
    var perpendicularSlope = -1/lineSlope;
    
    //Where the y-intercepts are of the lines that go through the two given endpoints and are perpendicular to the given line.
    var perpindicularYInt1 = -perpendicularSlope * lx1 + ly1
    var perpindicularYInt2 = -perpendicularSlope * lx2 + ly2
    
    //Which is bigger and smaller
    var maxPerpendicularYInt = Math.max(perpindicularYInt1, perpindicularYInt2);
    var minPerpendicularYInt = Math.min(perpindicularYInt1, perpindicularYInt2);
    
    //The y-intercept of the line perpendicular to given, through point
    var pointPerpendicularYInt = -perpendicularSlope * px + py;
    
    if(pointPerpendicularYInt > maxPerpendicularYInt || pointPerpendicularYInt < minPerpendicularYInt){
        //the perpendicular through the given point does not go through the given line
        return false;
    }
    //Intersection of point's 
    //y= (mPerp)x+(pointPerpendicularYInt)
    //y= (m)x+(lineYInt)
    //(m)x + lineYInt = (mPerp)x + (pointPerpendicularYInt)
    //mx-mPerpx = pointPerpendicularYInt - lineYInt
    //x = (pointPerpendicularYInt-lineYInt)/((m)-(mPerp))
    //y = (m)x + lineYInt
    var intersectionX = (pointPerpendicularYInt-lineYInt)/(lineSlope - perpendicularSlope);
    var intersectionY = lineSlope*intersectionX + lineYInt;
    //By perpendicular bisector theorem or  something like that, intersection is closest point on line to given point
    //console.log(distance(intersectionX, intersectionY, px, py))
    return distance(intersectionX, intersectionY, px, py);
}

//Is point within tolerance of the line?
function pointLineCollision(px,py,lx1,ly1,lx2,ly2,tolerance){
    var result = pointDistanceFromLine(px,py,lx1,ly1,lx2,ly2);
    if(result === false)return false;
    return result < tolerance;
}

function distance(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}