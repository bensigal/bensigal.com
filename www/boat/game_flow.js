//Game by Benjamin Sigal and Nick Wilde

//Called on document ready
$(function(){
    
    ticks = 0;
    timerStart = null;
    scene = "game";
    step = "planning";
    initCanvas();
    initGame();
    //initSocket();
    mainLoop();
    
});

function initGame(){
    drift = 0;
    meter = new PowerMeter();
    meter.ready = false;
    map = new Map(generateTopCoast(), generateBottomCoast());
    map.generateMines();
    boat = new Boat()

}

//Called each frame
function mainLoop(){
    ticks ++;
    if(nextTick > new Date().getTime()){
        window.requestAnimationFrame(mainLoop);
        return;
    }
    
    //Clear the canvas
    ctx.clearRect(0,0,800,600);

    //Blue background
    ctx.fillStyle = "#B5F0FF";
    ctx.fillRect(0, 0, 800, 600);
    
    //Determine functions to call based on current scene
    switch(scene){
    case "game":
        draw();
        tick();
        break;
    case "loss":
        ctx.clearRect(0,0,800,600);
        ctx.font = "30px Arial";
        ctx.fillText("BIG LOOSER", 10, 50);
        break;
    case "win":
        ctx.clearRect(0,0,800,600);
        ctx.font = "30px Arial";
        ctx.fillText("BIG WINNER", 10, 50);
        break;
    }
   

    
    //Ensure ~60 ticks per second, even if the window is not refreshing that fast
    //If more than half a second behind (eg. because tabbed out) don't try to call frames
    //for every single one that was missed
    nextTick += 16;
    if(nextTick + 500 < new Date().getTime())nextTick = new Date().getTime();
    if(nextTick < new Date().getTime()){
        mainLoop();
    }else{
        window.requestAnimationFrame(mainLoop);
    }
}

//Draw the game (not menu or podium or anything)
function draw(){
    /*
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100,50);
    ctx.lineTo(50, 100);
    ctx.lineTo(0, 90);
    ctx.closePath();
    ctx.fill();
    */

    boat.draw()

    map.drawTopCoast();
    map.drawBottomCoast();
    
    map.mines.forEach(mine => mine.draw());
    
    

}

//Cause state changes in game
function tick(){
    ticks ++
    switch(step){
        case "planning":
            drift = boat.vel;
            if (!meter.ready){
                meter.tick();
            }
            meter.draw()
            if (meter.ready){
                i = 10
                step = "action";
            }
            break;
        case "action":
            timerStart = timerStart || ticks;
            pilotBoat();
            boat.tick();
            //do we keep this and if so how can we make it actually work right.
            /*if (ticks-timerStart < i){
                if (boat.speed <= boat.maxSpeed){
                    console.log(boat.speed)
                    boat.speed +=boat.acceleration;
                    i += 10;
                }
            }*/
            if (ticks - timerStart > 180){
                step = "planning";
                meter.ready = false;
                timerStart = null;
            }
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
        if(ball.type == "grenade")return;
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

//Called when space is released while meter is active
//NOT called when receiving a throw from the server
function pilotBoat(){
    boat.vel = new Vector(meter.progress+boat.speed, meter.angle);
}


function ballsStopped(){
    activePlayer = calculateScore() > 0 ? 2 : 1;
    if(p1BallsLeft === 0) activePlayer = 2;
    if(p2BallsLeft === 0) activePlayer = 1;
    if(p1BallsLeft + p2BallsLeft === 0) return noBallsLeft();

    nextBall = new Ball(Vector.xy(20, 300), "normalBall", activePlayer);
    balls.push(nextBall);
    meter = new PowerMeter();
    step = "aiming";
    if(multiplayer && activePlayer != myPlayerNumber)
        waitForAim();
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
