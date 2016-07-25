var canvas, ctx, mainLoopIntervalCode, cursor;

$(function(){
    
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background = "black";
    
    ctx = canvas.getContext("2d");
    
    cursor = new Cursor();
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
});