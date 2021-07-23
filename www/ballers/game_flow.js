//Game by Benjamin Sigal. Play as the large circle in the middle. A small dot orbits you. Use it to destroy the lines chasing you.

//Called on document ready
$(function(){
    
    scene = "menu";
    initCanvas();
    initSocket();
    mainLoop();
    
});

//Called each frame
function mainLoop(){
    ticks ++;
    if(nextTick > new Date().getTime()){
        window.requestAnimationFrame(mainLoop);
        return;
    }
    
    //Clear the canvas
    ctx.clearRect(0,0,800,600);
    
    //Determine functions to call based on current scene
    try{
        
        switch(scene){
        case "game":
            draw();
            tick();
            break;
        case "menu":
            drawMenu();
            break;
        case "awaiting join":
            drawWaitRoom();
            break;
        case "podium":
            drawPodium();
            break;
        }
        
    }catch(e){
        
        console.error(e.name + ": " + e.message + "\n" + e.stack);
        
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
    
    hills.forEach(function(hill){
        hill.draw();
    });
    
	walls.forEach(function(wall){
		wall.draw();
	});
	
    calculateScore();
    balls.forEach(function(ball){
        ball.draw();
    });

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 130);
    
    switch(step){
    case "aiming":
        meter.draw();
        break;
    case "throwing":
        break;
    case "finished":
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
		ctx.font = "24px Ubuntu";
        ctx.fillText("Player " + (calculateScore() > 0 ? 1 : 2) + 
            " wins " + Math.abs(calculateScore()) + 
            " point"+ (Math.abs(calculateScore()) > 1 ? "s" : "") + "!", 400, 180);
        break;
	case "awaiting aim":
		ctx.fillStyle = "green";
		ctx.font = "20px Ubuntu";
		ctx.textAlign = "center";
		ctx.fillText("Waiting for other player to throw...", 400, 160);
        break;
    }

    drawTopBar();
    drawScore(calculateScore());
    drawRemainingBalls(p1BallsLeft,p2BallsLeft);
    
}

//Cause state changes in game
function tick(){
    
    switch(step){
    case "aiming":
        if (keyboard.down && nextBall.pos.y < canvas.height - 75 && !keyboard.space){
            nextBall.pos.y += 2;
        }
        if (keyboard.up && nextBall.pos.y > fieldTop + 75 && !keyboard.space){
            nextBall.pos.y -= 2;
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
function throwBall(){
    step = "throwing";
    nextBall.vel = new Vector(meter.progress*nextBall.throwSpeed, meter.angle);
    if(activePlayer == 1){
        p1BallsLeft--;
    }else{
        p2BallsLeft--;
    }
    if(multiplayer)
        sendAimData();
}

function grenadeExplodes(){
    balls.forEach(function(ball){
        if(ball == nextBall)return;
        //Velocity inversely proportional to distance to grenade, opposite direction
        ball.vel = ball.vel.plus(new Vector(
            nextBall.power/nextBall.pos.distanceTo(ball.pos)/ball.mass, 
            nextBall.pos.angleTo(ball.pos)
        ));
        console.log([nextBall.power, nextBall.pos.distanceTo(ball.pos), ball.mass]);
        console.log("explosion hit with pow " + nextBall.power/nextBall.pos.distanceTo(ball.pos)/ball.mass);
    });
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

//Called when setting up a new 
function initGame(){
    ticks = 0;
    targetBall = new Ball(Vector.xy(600, 365),"targetBall",0);
    activePlayer = p1Score < p2Score ? 2 : 1;
    nextBall = new Ball(Vector.xy(20, 365), "normalBall", activePlayer);
    balls = [
        targetBall,
        nextBall
    ];
    meter = new PowerMeter();
    hills = map.hills;
    walls = map.walls;
    scene = "game";
    step = "aiming";
    p1BallsLeft = 4;
    p2BallsLeft = 4;
    hasStartedAiming = false;
    
    if(multiplayer && activePlayer != myPlayerNumber)
        waitForAim();
}