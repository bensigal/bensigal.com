//Reference to canvas DOM object
var canvas;
//Context used to draw on the canvas
var ctx;
//Time the game started
var startTime;
//Last frame's timestamp
var lastTime;
//What scene the canvas is currently showing. "game" is currently the only option.
var scene = "game";

//When the page is done loading...
$(function(){
    
    //Get the canvas element
    canvas = $("#canvas")[0];
    //Ensure width and height are set correctly
    canvas.width = 800;
    canvas.height = 600;
    //Get the context used to draw on the canvas
    ctx = canvas.getContext("2d");
    
    startGame();
    
    startTime = new Date().getTime();
    
});

//Called every time we need to show a frame
function frame(){
    
    //Clear the screen
    ctx.clearRect(0,0,800,600);
    
    //If lastTime has not yet been set, set it.
    if(!lastTime){
        lastTime = new Date().getTime();
    }
    //Seconds since last frame
    var dt = new Date().getTime() - lastTime;
    
    try{
        
        switch(scene){
        case "game":
            gameFrame(dt);
            break;
        }
        
    }catch(e){
        alert(e.stacktrace);
    }
    
    //When the browser is ready for a new frame, reset the canvas
    window.requestAnimationFrame(frame);
}