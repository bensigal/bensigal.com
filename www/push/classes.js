class Wall{
    
    constructor(index){
        this.index = index;
        this.y = index*66
        this.x = 390;
        this.h = 65;
        this.w = 20;
        this.color = "#999";
        this.moving = 0;
    }
    tick(){
        this.x += this.moving;
        if(this.x < 0){
            p2Score++;
            this.x = 390;
            this.color = "#999"
            this.moving = 0;
            if(p2Score == 4){
                paused=true;
                drawAll();
                resetGame();
            }
        }
        if(this.x > 780){
            p1Score++;
            this.x = 390;
            this.color = "#999"
            this.moving = 0;
            if(p1Score == 4){
                paused=true;
                drawAll();
                resetGame();
            }
        }
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    
}

class Player{
    
    constructor(index){
        this.index = index;
        switch(index){
        case 1:
            this.y=66*2 + 23;
            this.color = "#CC0000";
            this.darkColor = "#770000"
            break;
        case 2:
            this.y=66*6 + 23;
            this.color = "#0000CC";
            this.darkColor = "#000055"
            break;
        }
        this.speed = 1;
        this.velocity = 0;
    }
    fire(){
        var index = Math.floor((this.y+10)/66);
        index = Math.max(index, 0);
        index = Math.min(index, walls.length-1);
        walls[index].moving = this.index==1?1:-1;
        walls[index].color = this.color;
    }
    tick(){
        this.y += this.velocity;
        this.velocity *= 0.8;
        if(Math.abs(this.velocity) < 0.01)this.velocity = 0;
        
        if(this.y < 0 || this.y > 600 - 20){
            this.y -= this.velocity;
            this.velocity *= -0.75;
        }
        if(keyboard.down && this.index != 1 || keyboard.s && this.index != 2){
            this.velocity += this.speed;
        }
        if(keyboard.up && this.index != 1 || keyboard.w && this.index != 2){
            this.velocity -= this.speed;
        }
        if((keyboard.left && this.index == 2 || keyboard.d && this.index==1) && !this.firing){
            this.firing = 60;
        }
        if(this.firing){
            this.firing--;
            this.velocity = 0;
            if(!this.firing){
                this.fire();
            }
        }
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.index==1?0:780, this.y, 20, 20);
        ctx.fillStyle = this.darkColor;
        ctx.fillRect(400, this.y+10, 400*(this.index==1?-1:1), 1)
        ctx.fillStyle = "green";
        ctx.fillRect(this.index==1?0:780, this.y, 20, this.firing/3);
    }
    
}