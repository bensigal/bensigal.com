var Cursor = function(){
    
    this.angle = 0;
    this.draw = function(){
        this.drawTarget();
    }
    this.drawTarget = function(){
        
        this.angle += 0.03;
        //this.angle %= Math.PI * 2;
        
        ctx.strokeStyle = "#FF0000";
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, this.angle, this.angle+Math.PI*2/3);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, this.angle+Math.PI, this.angle+Math.PI*5/3);
        ctx.stroke();
        ctx.closePath();
        
        var accentuatedAngle = (this.angle * 1.2) % Math.PI*2;
        var innerAngle = Math.PI*2 - accentuatedAngle;
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, innerAngle, innerAngle+Math.PI*2/3);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, innerAngle+Math.PI, innerAngle+Math.PI*5/3);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, innerAngle, innerAngle+Math.PI*2/3);
        ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, innerAngle+Math.PI, innerAngle+Math.PI*5/3);
        ctx.stroke();
        ctx.closePath();
    }
    
}