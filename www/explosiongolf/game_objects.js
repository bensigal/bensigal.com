class Ball{
    
    constructor(){
        this.velocity = new Velocity(0, 0);
        this.x = 400;
        this.y = 300;
        this.r = 10;
    }
    
    tick(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if(this.y > canvas.height - this.r) this.velocity.y *= -1;
        if(this.y < this.r)                 this.velocity.y *= -1;
        if(this.x > canvas.width  - this.r) this.velocity.x *= -1;
        if(this.x < this.r)                 this.velocity.x *= -1;
        
        this.velocity.amplitude *= 0.986;
        
        if(this.velocity.amplitude === 0 && step == "explosion" && !this.isBeingPushed){
            ballStopped();
        }
        
        this.isBeingPushed = false;
    }
    
    draw(){
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
}

class Grenade{
    
    constructor(){
        this.velocity = new Velocity(0, 0);
        this.x = 20;
        this.y = 300;
        this.imageWidth = 25;
        this.r = 10;
        this.angle = 0;
        
        this.throwSpeed = 10;
        this.power = 400;
        
        this.image = $("#grenade")[0];
    }
    
    draw(){
        /*
        ctx.fillStyle = "#0B3";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        */
        ctx.rotate(this.angle);
        
        var normalCoordinatesX = this.x;
        var normalCoordinatesY = this.y;
        
        //i hate trig
        var newX = normalCoordinatesX * Math.cos(this.angle) + normalCoordinatesY * Math.sin(this.angle);
        var newY = -normalCoordinatesX * Math.sin(this.angle) + normalCoordinatesY * Math.cos(this.angle);
        
        ctx.drawImage(this.image, newX - this.imageWidth/2, newY - this.imageWidth/2, this.imageWidth, this.imageWidth);
        
        ctx.rotate(-this.angle);
    }
    
    tick(){
        
        grenadeTicks++;
        
        this.angle += this.velocity.amplitude * 0.03;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if(this.y > canvas.height - this.r) {this.velocity.y *= -1; this.y += this.velocity.y;}
        if(this.y < this.r)                 {this.velocity.y *= -1; this.y += this.velocity.y;}
        if(this.x > canvas.width  - this.r) {this.velocity.x *= -1; this.x += this.velocity.y;}
        if(this.x < this.r)                 {this.velocity.x *= -1; this.x += this.velocity.y;}
        
        this.velocity.amplitude *= 0.985;
        
        if(grenadeTicks > 240) grenadeExplodes();
    }
    
}

class Hill{
    
    constructor(x, y, w, h, dv){
        
        //Change in velocity every tick
        this.dv = dv;
        
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
    }
    
    draw(){
        
        ctx.fillStyle = "#DDD";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        for(var x = 50; x <= this.w - 50; x+= 50){
            for(var y = 50; y <= this.h - 50; y += 50){
                ctx.strokeStyle = "#A6A";
                ctx.beginPath();
                ctx.moveTo(this.x + x - 10*Math.cos(this.dv.direction), this.y + y - 10*Math.sin(this.dv.direction));
                var arrowhead = {
                    x: this.x + x + 10*Math.cos(this.dv.direction),
                    y: this.y + y + 10*Math.sin(this.dv.direction)
                };
                ctx.lineTo(arrowhead.x, arrowhead.y);
                ctx.lineTo(arrowhead.x + 4*Math.cos(this.dv.direction+Math.PI-0.5), arrowhead.y + 4*Math.sin(this.dv.direction+Math.PI-0.5));
                ctx.moveTo(arrowhead.x, arrowhead.y);
                ctx.lineTo(arrowhead.x + 4*Math.cos(this.dv.direction+Math.PI+0.5), arrowhead.y + 4*Math.sin(this.dv.direction+Math.PI+0.5));
                ctx.closePath();
                ctx.stroke();
            }
        }
        
    }
    
    tick(items){
        
        //items contains everything that might be affected by the hill
        items.forEach(function(item){
            if(item.x > this.x && item.x < this.x + this.w){
                if(item.y > this.y && item.y < this.y + this.h){
                    item.velocity.x += this.dv.x;
                    item.velocity.y += this.dv.y;
                    if(item instanceof Ball){
                        item.isBeingPushed = true;
                    }
                }
            }
        }, this);
        
    }
    
}