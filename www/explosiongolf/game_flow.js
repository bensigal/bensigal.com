//Game by Benjamin Sigal. Play as the large circle in the middle. A small dot orbits you. Use it to destroy the lines chasing you.

//Reference to the HTML object.
var canvas,
//Reference to the object used to draw on the canvas
ctx, 
//how many ticks have passed
ticks, grenadeTicks,
//Game objects
balls, meter, grenade, hills,
//Which part of the playing scene is taking place. String.
step,
//String corresponding to what should be displayed
//Determines function(s) to call each tick
scene;

//Store status of mouse and which keys are down
var keyboard = {};
var mouse = {};
//Earliest time the next tick should occur, initialized to current time and incremented by 16ms every tick
var nextTick = new Date().getTime();

//Called on document ready
$(function(){
    
    initCanvas();
    initGame();
    mainLoop();
    
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
        }
        
    }catch(e){
        
        console.error(e.name + ": " + e.message + "\n" + e.stack);
        
    }finally{
        
        nextTick += 16;
        if(nextTick < new Date().getTime()){
            mainLoop();
        }else{
            window.requestAnimationFrame(mainLoop);
        }
        
    }
}

function draw(){
    
    hills.forEach(function(hill){
        hill.draw();
    });
    
    switch(step){
    case "aiming":
        meter.draw();
        grenade.draw();
        break;
    case "throwing":
        grenade.draw();
        break;
    }
    
    balls.forEach(function(ball){
        ball.draw();
    });
    
}

function tick(){
    
    switch(step){
    case "aiming":
        meter.tick();
        break;
    case "throwing":
        balls.forEach(function(ball){
            ball.tick();
        });
        grenade.tick();
        hills.forEach(function(hill){
            hill.tick([grenade]);
        });
        checkForCollisions([grenade].concat(balls));
        break;
    case "explosion":
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

function throwGrenade(){
    step = "throwing";
    grenade.vel = new Vector(meter.progress*grenade.throwSpeed, meter.angle);
    grenadeTicks = 0;
}

function grenadeExplodes(){
    step = "explosion";
    balls.forEach(function(ball){
        ball.vel = new Vector(grenade.power/grenade.pos.distanceTo(ball.pos), grenade.pos.angleTo(ball.pos));
    });
}

function ballsStopped(){
    step = "aiming";
    grenade = new Grenade();
    meter = new PowerMeter();
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
    balls = [
        new Ball(Vector.xy(100, 100)),
        new Ball(Vector.xy(200, 100)),
        new Ball(Vector.xy(150, 200)),
        new Ball(Vector.xy(100, 300)),
        new Ball(Vector.xy(200, 300)),
        new Ball(Vector.xy(150, 400)),
        new Ball(Vector.xy(100, 500)),
        new Ball(Vector.xy(200, 500))
    ];
    meter = new PowerMeter();
    grenade = new Grenade();
    hills = map.hills;
    scene = "game";
    step = "aiming";
}