class Player{
    
    constructor(index){
        this.index = index;
        this.r = 10;
        switch(index){
        case 0:
            this.x=400; 
            this.color = "black";
            break;
        case 1:
            this.x=300; 
            this.color = "#CC0000";
            break;
        case 2:
            this.x=500; 
            this.color = "#0000CC";
            break;
        }
        this.y = 300;
        this.speed = 0.35;
        this.velocity = new Velocity(1,1, 0, 0, 0.93);
        var jtay = new PointDestroyer(this, 6, 0.6);
        this.pointDestroyers = [jtay];
    }
    tick(){
        if(this.dead){
            this.r=Math.max(this.r-0.1, 0.1);
            return;
        }
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
        if(keyboard.down && keyboard.right && this.index!=1 || keyboard.s && keyboard.d && this.index!= 2){
            this.velocity.y += this.speed/Math.sqrt(2);
            this.velocity.x += this.speed/Math.sqrt(2);
        }else if(keyboard.down && keyboard.left && this.index!=1 || keyboard.s && keyboard.a && this.index!= 2){
            this.velocity.y += this.speed/Math.sqrt(2);
            this.velocity.x -= this.speed/Math.sqrt(2);
        }else if(keyboard.up && keyboard.right && this.index!=1 || keyboard.w && keyboard.d && this.index!= 2){
            this.velocity.y -= this.speed/Math.sqrt(2);
            this.velocity.x += this.speed/Math.sqrt(2);
        }else if(keyboard.up && keyboard.left && this.index!=1 || keyboard.w && keyboard.a && this.index!= 2){
            this.velocity.y -= this.speed/Math.sqrt(2);
            this.velocity.x -= this.speed/Math.sqrt(2);
        }else{
            if(keyboard.down && this.index != 1 || keyboard.s && this.index != 2){
                this.velocity.y += this.speed;
            }if(keyboard.up && this.index != 1 || keyboard.w && this.index != 2){
                this.velocity.y -= this.speed;
            }if(keyboard.right && this.index != 1 || keyboard.d && this.index != 2){
                this.velocity.x += this.speed;
            }if(keyboard.left && this.index != 1 || keyboard.a && this.index != 2){
                this.velocity.x -= this.speed;
            }
        }
        
        this.pointDestroyers.forEach(function(element, index){
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
        switch(this.player.index){
        case 0:
            this.color="black";
            break;
        case 1:
            this.color="#FF0000";
            break;
        case 2:
            this.color="#0000FF";
            break;
        }
    }
    tick(){
        //Per second (60 ticks), go 2pi radians rps times
        this.angle = this.rps*Math.PI*2*ticks/60+this.startingIndex;
        
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
        if(players.length===0)return;
        this.player = players[Math.floor(Math.random()*players.length)];
        if(difficulty == "impossible" && Math.random() < 0.03)this.fast=true;
        switch(this.player.index){
        case 0:
            this.color = "black";
            break;
        case 1:
            this.color = "#F00";
            break;
        case 2:
            this.color = "#00F";
            break;
        }
    }
    tick(){
        this.angle = (Math.atan2(this.y - this.player.y, this.x - this.player.x)+Math.PI)%(Math.PI*2);
        this.x += Math.cos(this.angle)*enemyBaseSpeed*(this.fast?2:1);
        this.y += Math.sin(this.angle)*enemyBaseSpeed*(this.fast?2:1);
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
            if(distance(this.x, this.y, player.x, player.y) < player.r){
                player.dead = true;
            }else if(distance(this.x2, this.y2, player.x, player.y) < player.r){
                player.dead = true;
            }
        }, this);
    }
    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        if(this.fast){
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x+Math.cos(this.angle + 3)*20, this.y+Math.sin(this.angle + 3)*20)
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x+Math.cos(this.angle + 3.3)*20, this.y+Math.sin(this.angle + 3.3)*20)
        }
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