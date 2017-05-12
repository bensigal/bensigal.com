class Player{
    
    constructor(index){
        this.r = 10;
        this.x=400;
        this.y = 300;
        this.color = "black";
        this.speed = 0.35;
        this.velocity = new Velocity(1,1, 0, 0, 0.93);
        var jtay = new PointDestroyer(this, 6, 0.6);
        this.tickAbilities = [jtay];
        this.pointDestroyers = [jtay];
    }
    tick(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if(this.x < this.r || this.x > 800 - this.r){
            this.x -= this.velocity.x;
            this.velocity.x *= -0.75;
        }
        if(this.y < this.r || this.y > 600 - this.r){
            this.y -= this.velocity.y;
            this.velocity.y *= -0.75;
        }
        
        this.velocity.tick();
        
        //Keyboard
        if(keyboard.down && keyboard.right){
            this.velocity.y += this.speed/Math.sqrt(2);
            this.velocity.x += this.speed/Math.sqrt(2);
        }else if(keyboard.down && keyboard.left){
            this.velocity.y += this.speed/Math.sqrt(2);
            this.velocity.x -= this.speed/Math.sqrt(2);
        }else if(keyboard.up && keyboard.right){
            this.velocity.y -= this.speed/Math.sqrt(2);
            this.velocity.x += this.speed/Math.sqrt(2);
        }else if(keyboard.up && keyboard.left){
            this.velocity.y -= this.speed/Math.sqrt(2);
            this.velocity.x -= this.speed/Math.sqrt(2);
        }else{
            if(keyboard.down){
                this.velocity.y += this.speed;
            }if(keyboard.up){
                this.velocity.y -= this.speed;
            }if(keyboard.right){
                this.velocity.x += this.speed;
            }if(keyboard.left){
                this.velocity.x -= this.speed;
            }
        }
        
        this.tickAbilities.forEach(function(element){
            element.tick();
            element.draw();
        });
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
}
class PointDestroyer{
    
    constructor(player, radiiFromPlayer, rps, w, h, startingIndex){
        this.radiiFromPlayer = radiiFromPlayer;
        this.rps = rps;
        this.w = w || 4;
        this.h = h || 4;
        this.startingIndex = startingIndex || 0;
        this.player = player;
    }
    tick(){
        //Per second (60 ticks), go 2pi radians rps times
        this.angle = this.rps*Math.PI*2*(ticks+this.startingIndex)/60;
        if(keyboard.space){
            this.startingIndex-=0.7;
        }
        this.x = this.player.x + Math.cos(this.angle)*this.player.r*this.radiiFromPlayer - this.w/2;
        this.y = this.player.y + Math.sin(this.angle)*this.player.r*this.radiiFromPlayer - this.h/2;
    }
    draw(){
        ctx.fillStyle="black";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
    
}

class Enemy{
    
    constructor(){
        var startingAngle = Math.random()*2*Math.PI;
        this.x = Math.cos(startingAngle)*500 + 400;
        this.y = Math.sin(startingAngle)*500 + 400;
        this.dead = false;
        this.player = players[0]
    }
    tick(){
        this.angle = (Math.atan2(this.y - this.player.y, this.x - this.player.x)+Math.PI)%(Math.PI*2);
        this.x += Math.cos(this.angle);
        this.y += Math.sin(this.angle);
        this.x2 = this.x - Math.cos(this.angle)*50;
        this.y2 = this.y - Math.sin(this.angle)*50;
        players.forEach(function(player){
            player.pointDestroyers.forEach(function(element){
                if(pointLineCollision(element.x, element.y, this.x, this.y, this.x2, this.y2, 5)){
                    this.dead = true;
                }
                //console.log(pointDistanceFromLine(element.x, element.y, this.x, this.y, this.x2, this.y2, 2));
            },this);
        }, this);
        players.forEach(function(player){
            /* picky picky picky 
            if(pointDistanceFromLine(player.x, player.y, this.x, this.y, this.x2, this.y2) < player.r){
                player.dead = true;
            }else */if(distance(this.x, this.y, player.x, player.y) < player.r){
                player.dead = true;
            }else if(distance(this.x2, this.y2, player.x, player.y) < player.r){
                player.dead = true;
            }
        }, this);
    }
    draw(){
        ctx.strokeStyle = "black";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
    
}

var abilities = {
    speedup:{
        init:function(){
            player.speed += 0.2;
        }
    }
}