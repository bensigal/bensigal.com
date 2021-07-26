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
    wind = new Wind();
    boat = new Boat();
    windMeter = new PowerMeter(wind);
    boatMeter = new PowerMeter(boat);
    boatMeter.ready = false;

    map = new Map(generateTopCoast(), generateBottomCoast());
    map.generateMines();
    
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

    wind.draw()
    
    map.mines.forEach(mine => mine.draw());
    
    

}

//Cause state changes in game
function tick(){
    ticks ++
    switch(step){
        case "planning":
            drift = boat.vel;
            if (!boatMeter.ready){
                boatMeter.tick();
            }
            if (!windMeter.ready){
                windMeter.tick();
            }
            windMeter.draw()
            boatMeter.draw()
            if (boatMeter.ready && windMeter.ready){
                i = 10
                step = "action";
            }
            break;
        case "action":
            timerStart = timerStart || ticks;
            pilotBoat();
            boat.tick();
            //do we keep this and if so how can we make it actually work right.
           /* if (ticks-timerStart < i){
                if (boat.speed <= boat.maxSpeed){
                    console.log(boat.speed)
                    //boat.speed *= boat.acceleration * meter.progress;
                    i += 10;
                }
            }*/
            if (ticks - timerStart > 180){
                step = "planning";
                boatMeter.ready = false;
                timerStart = null;
            }
            break;
        }
}

//Number of balls closer to the target than the opponent's closest.
//Positive for player 1, negative for player 2


//Called when space is released while meter is active
//NOT called when receiving a throw from the server
function pilotBoat(){
    console.log(boat.vel)
    boat.vel = new Vector(boatMeter.progress, boatMeter.angle);
    //boat.vel = new Vector(boat.speed, meter.angle);
    console.log("after " + boat.vel)
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
