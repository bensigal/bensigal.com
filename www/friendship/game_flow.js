
var nextTick = new Date().getTime();
var mouse = {
    x:0,
    y:0
}
//determines which tick and draw functions are called
//values: splash, menu, game
var scene = "splash";
//determines what's happening during the game scene
//values: aiming, windup, playing
var step = "aiming";
var canvas, ctx;


//Called on document ready
$(function(){
    
    initCanvas();
    //initSocket();
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
        case "splash":
            drawSplash();
            break;
        case "menu":
            drawMenu();
            break;
        case "game":
            tick();
            draw();
            break;
        default:
            alert("Scene error");
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

function tick(){
    if(step == "aiming" || step == "windup"){
        powerMeter.tick();
    }
}

function draw(){
    ctx.fillText("GAME SCENE", 400, 30);
    if(step == "aiming" || step == "windup"){
        powerMeter.draw();
    }
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
    
    scene = "game";

    initPhysics();
    

}
