//Reference to DOM Canvas element
var canvas;
//Context used to draw on canvas
var ctx;

//Where the last touch/mouse was
var lastKnownX;
var lastKnownY;

//Last time a change was registered for touch/mouse
var lastTimeUpdated = new Date().getTime();

$(function(){
    
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    
    //Listen to touch/mouse and where it is
    window.ontouchstart = touchListener;
    window.ontouchmove = touchListener;
    document.onmousedown = touchListener;
    document.onmousemove = touchListener;
    
    //When the screen next needs to know what to look like, tell it
    window.requestAnimationFrame(frame);
});

function frame(){
    
    //Set height and width of canvas to the whole window
    canvas.style.width = $(window).width() + "px";
    canvas.style.height = $(window).height() + "px";
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    
    //Lines will be yellow
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "yellow";
    
    //Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Draw a test rectangle
    //ctx.fillRect(lastKnownX, lastKnownY, 50, 50);
    
    //In a rectangular grid, every 50 pixels...
    for(var i = 10; i < canvas.width; i+=50){
        for(var j = 10; j < canvas.height; j+=50){
            
            //Calculate the angle from this point towards the mouse/touch
            var angleForward = Math.atan2(lastKnownY - j, lastKnownX - i);
            var angleClockwise = angleForward + Math.PI*2/3;
            var angleCounterClockwise = angleForward - Math.PI*2/3;
            
            ctx.beginPath();
            //Start at front point (20px towards mouse from grid point)
            ctx.moveTo(i + 20*Math.cos(angleForward), j + 20*Math.sin(angleForward));
            //Move to 10px to 120 degrees clockwise of the grid point
            ctx.lineTo(i + 10*Math.cos(angleClockwise), j + 10*Math.sin(angleClockwise));
            //Move to 10px to 120 degrees counterclockwise of the grid point
            ctx.lineTo(i + 10*Math.cos(angleCounterClockwise), j + 10*Math.sin(angleCounterClockwise));
            //End at front point (20px towards mouse from grid point)
            ctx.lineTo(i + 20*Math.cos(angleForward), j + 20*Math.sin(angleForward));
            
            ctx.fill();
            ctx.closePath();
            
        }
    }
    
    //When ready for another frame, call this function again.
    window.requestAnimationFrame(frame);
}

//Update lastKnown to new information
function touchListener(e){
    
    lastTimeUpdated = new Date().getTime();
    if(e.touches){
        lastKnownX = e.touches.item(0).clientX;
        lastKnownY = e.touches.item(0).clientY;
    }else{
        lastKnownX = e.clientX;
        lastKnownY = e.clientY;
    }
}