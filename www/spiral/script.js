var canvas, ctx;

$(function(){
    
    window.onerror = function(message, source, lineno, colno, error){
        alert(message+"Found in "+source+" at line "+lineno+", column "+colno+". "+error);
        return true;
    };
    
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 495;
    canvas.style.background="white";
    
    ctx = canvas.getContext("2d");
    
    var currentX = 0;
    var currentWidth = 800;
    var currentY = 0;
    var currentHeight = currentWidth/1.6180339887;
    
    var times = Number(prompt("times?"))
    
    while(times--){
        
        currentX+=currentHeight;
        currentWidth -= currentHeight;
        
        /*ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(currentX, currentY, currentWidth, currentHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "black";*/
        
        ctx.beginPath();
        ctx.arc(currentX, currentY+currentHeight, currentHeight, Math.PI, 3*Math.PI/2);
        ctx.stroke();
        ctx.closePath();
        
        if(!(times--))break;
        
        currentY+=currentWidth;
        currentHeight -= currentWidth;
        
        /*ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(currentX, currentY, currentWidth, currentHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "black";*/
        
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentWidth, 3*Math.PI/2, 0);
        ctx.stroke();
        ctx.closePath();
        
        if(!(times--))break;
        
        currentWidth -= currentHeight;
        
        /*ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(currentX, currentY, currentWidth, currentHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "black";*/
        
        ctx.beginPath();
        ctx.arc(currentX+currentWidth, currentY, currentHeight, 0, Math.PI/2);
        ctx.stroke();
        ctx.closePath();
        
        if(!(times--))break;
        
        currentHeight -= currentWidth;
        
        /*ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(currentX, currentY, currentWidth, currentHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "black";*/
        
        ctx.beginPath();
        ctx.arc(currentX+currentWidth, currentY+currentHeight, currentWidth, Math.PI/2, Math.PI);
        ctx.stroke();
        ctx.closePath();
        
    }
    
});