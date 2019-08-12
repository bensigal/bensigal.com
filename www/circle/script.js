//Game by Benjamin Sigal. Play as the large circle in the middle. A small dot orbits you. Use it to destroy the lines chasing you.

//Reference to the HTML object.
var canvas,
//Reference to the object used to draw on the canvas
ctx, 
mainLoopInterval, 
//how many ticks have passed
ticks, 
player;

var keyboard = {};
var mouse = {};
var stopped = false;
var enemies;
//How many ticks before the next enemy should appear
var level = 120;
var nextEnemy, killed, originalPlayers, players, menuTicks, menuLoopInterval, gameType, scene, enemyBaseSpeed;
//List of options for the menu at the beginning
var options = [
    ["singleplayer", "multiplayer"],
    ["easy", "classic", "impossible", "back"]
];
var onMenu = true;
var optionSelected = 0;
//How far in the options menu you are
var depth = 0;

//Called when the game begins
function resetGame(){
    
    enemyBaseSpeed = 1;
    switch(scene){
    case "singleplayer":
        originalPlayers = [new Player(0)];
        break;
    case "multiplayer":
        originalPlayers = [new Player(1), new Player(2)];
        break;
    }
    players = originalPlayers.slice(0);
    
    ticks = -1;//game finishes loop, this is asynchronous really. make sure the first enemy spawns
    enemies = [];
    nextEnemy = 0;
    killed = 0;
    
}

//Enter was pressed while on the menu
function selectMenuOption(index){
    optionSelected = 0;
    //If you were on back, go back
    if(options[depth][index]=="back")return depth--;
    
    switch(depth){
    //If on the first page of options, set singleplayer/multiplayer and go to next page
    case 0:
        scene=options[0][index];
        depth++;
        break;
    //If on second page, set the difficulty according to which is selected and start game.
    case 1:
        difficulty = options[1][index];
        resetGame();
        onMenu = false;
        break;
    }
}

$(function(){
    //Reference to canvas object
    canvas = $("#canvas")[0];
    
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white"
    
    //Object used to draw on canvas
    ctx = canvas.getContext("2d");
    
    //Call mainLoop at 60fps
    mainLoopInterval = setInterval(mainLoop, 16);
    
    stopped=false;
    paused =false;
    
    scene = "menu";
    menuTicks=0;
    
    //When the mouse moves or clicks, store the location of the mouse
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
});
//Called while on menu
function menuLoop(){
    ctx.clearRect(0,0,800,600);
    menuTicks++;
    
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    
    //Draw each option for whatever you're on
    options[depth].forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 300 + 40 * (index-options.length/2));
    });
}

//Called each frame
function mainLoop(){
    
    if(paused)return;
    //If on menu, draw menu instead
    if(onMenu)return menuLoop();
    
    //If multiplayer and one person is dead, speed things up a bit
    if(scene == "multiplayer" && players.length == 1 && enemyBaseSpeed < 2)enemyBaseSpeed+=0.001;
    
    //Clear the canvas
    ctx.clearRect(0,0,800,600);
    
    //Update how fast enemies appear based on difficulty
    switch(difficulty){
    case "classic":
        level = Math.round( 15 + 60 * Math.pow(1.1, (ticks + 120)/-300) );
        break;
    case "easy":
        level = Math.round( 20 + 120* Math.pow(1.1, (ticks + 120)/-200) );
        break;
    case "impossible":
        level = Math.round( 10 + 30 * Math.pow(1.1, (ticks + 120)/-100) );
        break;
    }
    if(scene == "multiplayer"){
        level = Math.round(level/2);
    }
    
    //If it's time to spawn an enemy, spawn it and store when the next should be spawned based
    //on level ticks from now.
    if(ticks >= nextEnemy){
        enemies.push(new Enemy());
        nextEnemy = ticks + level;
    }
    
    //Draw how many enemies have been killed in grey in the center of the screen
    ctx.fillStyle = "#EFEFEF";
    ctx.font = "400px Arial";
    ctx.textAlign = "center";
    ctx.fillText(killed, 400, 400);
    
    //Draw the level in the top right
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "start";
    ctx.fillText(level, 40, 60);
    
    //Draw instructions
    ctx.fillText("Arrow keys to move you (the large circle). Hold space to extend. P to pause. Avoid the lines, destroy them with your moon.", 20, 580);
    
    //For each player (whether or not dead) draw it
    originalPlayers.forEach(function(player){
        player.tick();
        player.draw();
    });
    
    //Draw each enemy
    enemies.forEach(function(element){
        element.tick();
        element.draw();
    });
    
    //If there are no living players, reset the game (but don't clear the screen)
    if(players.length === 0){
        resetGame(gameType);
        paused=true;
    }
    
    //Remove dead enemies from the array
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].dead){
            enemies.splice(i, 1);
            i--;
            killed++;
        }
    }
    //If a player died, remove them from the array and set the lines chasing them to chase someone.
    if(players[0].dead){
        players.splice(0,1);
        if(players[0]){
            enemies.forEach(function(enemy){
                enemy.player = players[0];
            });
        }
    }else if(players[1] && players[1].dead){
        players.splice(1,1);
        enemies.forEach(function(enemy){
            enemy.player = players[0];
        });
    }
    for(i = 0; i < players.length; i++){
        if(players[i].dead){
            players.splice(i, 1);
            i--;
        }
    }
    
    
    ticks++;
}

//Detect keypresses
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
    case 32:
        keyboard.space = true;
    case 13:
        //enter
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
        //p
        if(stopped){
            break;
        }else if(paused){
            paused = false;
        }else if(!onMenu){
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