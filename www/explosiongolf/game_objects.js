class Ball{
    
    constructor(pos){
        this.vel = new Vector(0, 0);
        this.pos = pos || Vector.xy(400, 300);
        this.r = 12;
        this.friction = 0.08;
        this.collides = true;
        this.mass = 1;
    }
    
    tick(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        if(this.pos.y > canvas.height - this.r) {this.vel.y *= -1; this.pos.y = canvas.height-this.r}
        if(this.pos.y < this.r)                 {this.vel.y *= -1; this.pos.y = this.r}
        if(this.pos.x > canvas.width  - this.r) {this.vel.x *= -1; this.pos.x = canvas.width-this.r}
        if(this.pos.x < this.r)                 {this.vel.x *= -1; this.pos.x = this.r}
        
        this.vel.amplitude -= this.friction;
        this.vel.amplitude *= 0.995;
        
        if(this.vel.amplitude === 0 && step == "explosion" && !this.isBeingPushed){
            stoppedBalls++;
        }
        
        this.isBeingPushed = false;
    }
    
    draw(){
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
}

class Grenade{
    
    constructor(){
        this.vel = new Vector(0, 0);
        this.pos = Vector.xy(20, 300);
        this.collides = true;
        this.mass = 1;
        
        this.imageWidth = 25;
        this.r = 12;
        this.angle = 0;
        this.friction = 0.08;
        
        this.throwSpeed = 10;
        this.power = 800;
        
        this.image = $("#grenade")[0];
    }
    
    draw(){
        /*
        ctx.fillStyle = "#0B3";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        */
        ctx.rotate(this.angle);
        
        var normalCoordinatesX = this.pos.x;
        var normalCoordinatesY = this.pos.y;
        
        //i hate trig
        var newX = normalCoordinatesX * Math.cos(this.angle) + normalCoordinatesY * Math.sin(this.angle);
        var newY = -normalCoordinatesX * Math.sin(this.angle) + normalCoordinatesY * Math.cos(this.angle);
        
        ctx.drawImage(this.image, newX - this.imageWidth/2, newY - this.imageWidth/2, this.imageWidth, this.imageWidth);
        
        ctx.rotate(-this.angle);
    }
    
    tick(){
        
        grenadeTicks++;
        
        this.angle += this.vel.amplitude * 0.03;
        
        this.pos = this.pos.plus(this.vel);
        
        if(this.pos.y > canvas.height - this.r) {this.vel.y *= -1; this.pos.y += this.vel.y;}
        if(this.pos.y < this.r)                 {this.vel.y *= -1; this.pos.y += this.vel.y;}
        if(this.pos.x > canvas.width  - this.r) {this.vel.x *= -1; this.pos.x += this.vel.y;}
        if(this.pos.x < this.r)                 {this.vel.x *= -1; this.pos.x += this.vel.y;}
        
        this.vel.amplitude -= this.friction;
        this.vel.amplitude *= 0.995;
        
        if(grenadeTicks > 240) grenadeExplodes();
    }
    
}

class Hill{
    
    constructor(x, y, w, h, dv){
        
        //Change in vel every tick
        this.dv = dv;
        
        this.pos = Vector.xy(x, y);
        this.w = w;
        this.h = h;
        
    }
    
    draw(){
        
        ctx.fillStyle = "#DDD";
        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        
        for(var x = 50; x <= this.w - 50; x+= 50){
            for(var y = 50; y <= this.h - 50; y += 50){
                ctx.strokeStyle = "#A6A";
                ctx.beginPath();
                ctx.moveTo(this.pos.x + x - 10*Math.cos(this.dv.direction), this.pos.y + y - 10*Math.sin(this.dv.direction));
                var arrowhead = {
                    x: this.pos.x + x + 10*Math.cos(this.dv.direction),
                    y: this.pos.y + y + 10*Math.sin(this.dv.direction)
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
            if(item.pos.x > this.pos.x && item.pos.x < this.pos.x + this.w){
                if(item.pos.y > this.pos.y && item.pos.y < this.pos.y + this.h){
                    item.vel.x += this.dv.x;
                    item.vel.y += this.dv.y;
                    if(item instanceof Ball){
                        item.isBeingPushed = true;
                    }
                }
            }
        }, this);
        
    }
    
}