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
var optionSelected = 0;
//How far in the options menu you are
var depth = 0;
//Earliest time the next tick should occur, initialized to current time and incremented by 16ms every tick
var nextTick = new Date().getTime();

//Called when the game begins
function resetGame(){
    
    enemyBaseSpeed = 1;
    switch(gameType){
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
        gameType = options[0][index];
        depth++;
        break;
    //If on second page, set the difficulty according to which is selected and start game.
    case 1:
        difficulty = options[1][index];
        resetGame();
        scene = "playing";
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
    
    mainLoop();
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
    
    if(nextTick > new Date().getTime()){
        window.requestAnimationFrame(mainLoop);
        return;
    }
    
    //Clear the canvas
    ctx.clearRect(0,0,800,600);
    
    try{
        switch(scene){
        case "playing":
            draw();
            tick();
            break;
        case "finished":
        case "paused":
            draw();
            break;
        case "menu":
            menuLoop();
            break;
        }
    }catch(e){
        console.error(e.name + ": " + e.message + "\n" + e.stack);
    }
    nextTick += 16;
    if(nextTick < new Date().getTime()){
        mainLoop();
    }else{
        window.requestAnimationFrame(mainLoop);
    }
}

function draw(){
    
    //Draw how many enemies have been killed in grey in the center of the screen
    ctx.fillStyle = "#EFEFEF";
    ctx.font = "400px Arial";
    ctx.textAlign = "center";
    ctx.fillText(killed, 400, 400);
    
    //Draw each enemy
    enemies.forEach(function(element){
        element.draw();
    });
    //For each player (whether or not dead) draw it
    originalPlayers.forEach(function(player){
        player.draw();
    });
    
    //Draw instructions
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Arrow keys to move you (the large circle). Hold space to extend. P to pause. Avoid the lines, destroy them with your moon.", 400, 580);
}

function tick(){
    
    //If multiplayer and one person is dead, speed things up a bit
    if(scene == "multiplayer" && players.length == 1 && enemyBaseSpeed < 2)enemyBaseSpeed+=0.001;
    
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
    
    //For each player (whether or not dead) tick it
    originalPlayers.forEach(function(player){
        player.tick();
    });
    
    //Tick each enemy
    enemies.forEach(function(element){
        element.tick();
    });
    
    //If there are no living players, the game is over
    if(players.length === 0){
        scene = "finished";
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
    if(players[0] && players[0].dead){
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