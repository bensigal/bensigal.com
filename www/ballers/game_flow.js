//Game by Benjamin Sigal. Play as the large circle in the middle. A small dot orbits you. Use it to destroy the lines chasing you.

//Reference to the HTML object.
var canvas,
//Reference to the object used to draw on the canvas
ctx, 
//how many ticks have passed
ticks, grenadeTicks,
//Space was pressed for aiming
hasStartedAiming,
//Game objects
balls, meter, hills, targetBall, nextBall, walls,
//Which part of the playing scene is taking place. String.
step,
//Active whoever is playing, 1 or 2
activePlayer,
//Status of each player
p1BallsLeft, p2BallsLeft,
//"local" or "online"
multiplayerMode,
//who won, 1 or 2
winner,
//String corresponding to what should be displayed
//Determines function(s) to call each tick
scene;

//Menu options
var options = [
    ["local multiplayer", "online multiplayer", "tutorial"],
    ["map option 1", "map option 2", "back"]
];
//Height of dashboard above field of play
var fieldTop = 130;
//Menu status
var depth = 0, optionSelected = 0;
//Store status of mouse and which keys are down
var keyboard = {};
var mouse = {};

var p1Score = 0;
var p2Score = 0;

//Earliest time the next tick should occur, initialized to current time and incremented by 16ms every tick
var nextTick = new Date().getTime();

//Called on document ready
$(function(){
    
    initCanvas();
    mainLoop();
    scene = "menu";
    
});

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
        case "game":
            draw();
            tick();
            break;
        case "menu":
            drawMenu();
            break;
        case "podium":
            drawPodium();
            break;
        }
        
    }catch(e){
        
        console.error(e.name + ": " + e.message + "\n" + e.stack);
        
    }
        
    nextTick += 16;
    if(nextTick + 500 < new Date().getTime())nextTick = new Date().getTime();
    if(nextTick < new Date().getTime()){
        mainLoop();
    }else{
        window.requestAnimationFrame(mainLoop);
    }
}

function draw(){
    
    hills.forEach(function(hill){
        hill.draw();
    });
    
    switch(step){
    case "aiming":
        meter.draw();
        break;
    case "throwing":
        break;
    case "finished":
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText("Player " + (calculateScore() > 0 ? 1 : 2) + 
            " wins " + Math.abs(calculateScore()) + 
            " point"+ (Math.abs(calculateScore()) > 1 ? "s" : "") + "!", 400, 350);
        break;
    }
    
    calculateScore();
    balls.forEach(function(ball){
        ball.draw();
    });

   
    drawTopBar();
    drawScore(calculateScore());
    drawRemainingBalls(p1BallsLeft,p2BallsLeft);
    
}

function tick(){
    
    switch(step){
    case "aiming":
        if (keyboard.down && nextBall.pos.y < canvas.height - 7 && !keyboard.space){
            nextBall.pos.y += 3;
        }
        if (keyboard.up && nextBall.pos.y > fieldTop + 75 && !keyboard.space){
            nextBall.pos.y -= 3;
        }
        meter.tick();
        break;
    case "throwing":
        stoppedBalls = 0;
        balls.forEach(function(ball){
            ball.tick();
        });
        hills.forEach(function(hill){
            hill.tick(balls);
        });
        checkForCollisions(balls);
        if(stoppedBalls == balls.length)ballsStopped();
        break;
    case "finished":

        break;
    }
    
}

//Number of balls closer to the target than the opponent's closest.
//Positive for player 1, negative for player 2
function calculateScore(){

    if(!targetBall)return 0;

    var p1MinDistance = Infinity;
    var p2MinDistance = Infinity;
    //Find the minimum distance to target for each player
    balls.forEach(function(ball){
        var dist = ball.pos.distanceTo(targetBall.pos);
        if(ball.player == 1){
            if(dist < p1MinDistance){
                p1MinDistance = dist;
            }
        }
        else if(ball.player == 2){
            if(dist < p2MinDistance){
                p2MinDistance = dist;
            }
        }
    });
    
    var loserMinDistance = p1MinDistance < p2MinDistance ? p2MinDistance : p1MinDistance;
    var winner = p1MinDistance < p2MinDistance ? 1 : 2;
    var score = 0;

    balls.forEach(function(ball){
        ball.winning = false;
        //If the other player but not the target ball
        if(ball.player == winner && winner !== 0){
            if(ball.pos.distanceTo(targetBall.pos) < loserMinDistance){
                score++;
                //Whether or not the green ring is shown
                if((ball != nextBall || step != "aiming") && balls.length > 2) ball.winning = true;
            }
        }
    });
    if(winner == 2) score *= -1;

    return score;
    
}
    

function throwBall(){
    step = "throwing";
    nextBall.vel = new Vector(meter.progress*nextBall.throwSpeed, meter.angle);
}

function grenadeExplodes(){
    step = "explosion";
    balls.forEach(function(ball){
        ball.vel = new Vector(nextBall.power/nextBall.pos.distanceTo(ball.pos)/ball.mass, nextBall.pos.angleTo(ball.pos));
    });
}

function ballsStopped(){
    step = "aiming";
    activePlayer = calculateScore() > 0 ? 2 : 1;
    if(p1BallsLeft === 0) activePlayer = 2;
    if(p2BallsLeft === 0) activePlayer = 1;
    if(p1BallsLeft + p2BallsLeft === 0) return noBallsLeft();

    if(activePlayer == 1) p1BallsLeft--;
    if(activePlayer == 2) p2BallsLeft--;
    nextBall = new Ball(Vector.xy(20, 300), "normalBall", activePlayer);
    balls.push(nextBall);
    meter = new PowerMeter();
}

function noBallsLeft(){
    step = "finished";
    if(calculateScore() > 0) p1Score += calculateScore();
    if(calculateScore() < 0) p2Score -= calculateScore();
    if(p1Score >= 5) winner = 1;
    if(p2Score >= 5) winner = 2;
}

function initCanvas(){
    //Reference to canvas DOM element
    canvas = $("#canvas")[0];
    
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white";
    
    //Object used to draw on canvas
    ctx = canvas.getContext("2d");
    
    //When the mouse moves or clicks, store the location of the mouse
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
}

function initGame(){
    targetBall = new Ball(Vector.xy(600, 300),"targetBall",0);
    activePlayer = p1Score < p2Score ? 2 : 1;
    nextBall = new Ball(Vector.xy(20, 300), "normalBall", activePlayer);
    balls = [
        targetBall,
        nextBall
        /*new Ball(Vector.xy(100, 300)),
        new Ball(Vector.xy(200, 300)),
        new Ball(Vector.xy(150, 400)),
        new Ball(Vector.xy(100, 500)),
        new Ball(Vector.xy(200, 500)) */
    ];
    meter = new PowerMeter();
    hills = map.hills;
    walls = map.walls;
    scene = "game";
    step = "aiming";
    p1BallsLeft = activePlayer == 1 ? 3 : 4;
    p2BallsLeft = activePlayer == 2 ? 3 : 4;
    hasStartedAiming = false;
}