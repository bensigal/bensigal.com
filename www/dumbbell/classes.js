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
        this.speed = 0.03;
        this.velocity = new Velocity(0,0,0,0);
    }
    tick(dt){
        this.x += this.velocity.x*dt;
        this.y += this.velocity.y*dt;
        
        if(this.x < this.r || this.x > 800 - this.r){
            this.x -= this.velocity.x;
            this.velocity.x *= -0.75;
        }
        if(this.y < this.r || this.y > 600 - this.r){
            this.y -= this.velocity.y;
            this.velocity.y *= -0.75;
        }
        
        this.velocity.amplitude *= Math.pow(0.05, dt/1000);
        
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
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
}

class Enemy{
    
    constructor(){
        var startingAngle = Math.random()*2*Math.PI;
        this.x = Math.cos(startingAngle)*600 + 400;
        this.y = Math.sin(startingAngle)*600 + 400;
        this.dead = false;
        this.r = 5;
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
    tick(dt){
        this.angle = (Math.atan2(this.y - this.player.y, this.x - this.player.x)+Math.PI)%(Math.PI*2);
        this.x += Math.cos(this.angle)*enemyBaseSpeed*(this.fast?2:1)*dt/16;
        this.y += Math.sin(this.angle)*enemyBaseSpeed*(this.fast?2:1)*dt/16;
        this.x2 = this.x - Math.cos(this.angle)*50;
        this.y2 = this.y - Math.sin(this.angle)*50;
        
        players.forEach(function(player){
            if(distance(this.x, this.y, player.x, player.y) < player.r + this.r){
                playerDead = true;
                paused = true;
            }
        }, this);
        
        if(pointLineCollision(this.x, this.y, players[0].x, players[0].y, players[1].x, players[1].y, this.r + dt/4)){
            enemies.splice(enemies.indexOf(this), 1);
            killed++;
        }
    }
    draw(){
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    
}

var abilities = {
    speedup:{
        init:function(){
            player.speed += 0.2;
        }
    }
}