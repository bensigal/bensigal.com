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
        
        if(this.velocity.amplitude === 0 && step == "explosion"){
            ballStopped();
        }
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
        this.power = 300;
        
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
        
        this.angle += this.velocity.amplitude * 0.02;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if(this.y > canvas.height - this.r) this.velocity.y *= -1;
        if(this.y < this.r)                 this.velocity.y *= -1;
        if(this.x > canvas.width  - this.r) this.velocity.x *= -1;
        if(this.x < this.r)                 this.velocity.x *= -1;
        
        this.velocity.amplitude *= 0.985;
        
        if(grenadeTicks > 240) grenadeExplodes();
    }
    
}