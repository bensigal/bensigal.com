class FeaturePart{
    
    constructor(id, x, y, options){
        this.options = options || {};
        this.x = x;
        this.y = y;
        this.id = id;
    }
    
}

FeaturePart.SIMPLE_ENEMY = 0;
FeaturePart.MONEY_1 = 1;

class Money extends RectangleSprite{
    
    constructor(x, y, value){
        super(x, y, 0, 0, 0);
        this.value = value;
        this.w = 38;
        this.h = 38;
    }
    draw(){
        ctx.drawImage(goldImage, this.x, this.y, this.w, this.h);
    }
    
    tick(){
        if(rectangularCollisionTest(this, player)){
            money += this.value;
            this.destroy = true;
        }
        this.x -= 2;
        if(this.x < -this.w){
            this.destroy = true;
        }
    }
    
}

class Enemy extends RectangleSprite{
    
    constructor(x, y, w, h){
        super(x, y, w, h, theme.enemy);
        this.destroy = false;
    }
    
    tick(){
        if(rectangularCollisionTest(this, player)){
            loseLife();
            this.destroy = true;
        }
    }
    destroyIfNecessary(){
        if(this.destroy)
            enemies.splice(enemies.indexOf(this), 1);
    }
    
}

class SimpleEnemy extends Enemy{
    
    constructor(x, y){
        super(x, y, 20, 20);
    }
    tick(){
        super.tick();
        this.x -= 2;
        if(this.x < -this.w){
            this.destroy = true;
        }
    }
    
}

class BoundaryPhysicsRectangleSprite extends PhysicsRectangleSprite{
    
    constructor(){
        super(...arguments);
    }
    getMaximumY(){
        return 600 - this.h;
    }
    getMinimumY(){
        return 0;
    }
    getMaximumX(){
        return 800 - this.w;
    }
    getMinimumX(){
        return 0;
    }
    
}

class Player extends BoundaryPhysicsRectangleSprite{
    
    
    constructor(){
        super(100, 100, 20, 20, "black", new Velocity(0, 0, 0.05, 0.5, 0.95));
        this.lives = 5;
        this.jumpHeight = 10;
        this.horizontalSpeed = 0.4;
        this.hoverSpeed = 0;
    }
    
    tick(){
        super.tick();
        switch(this.hoverType){
        case Player.SHAKY_HOVER:
            if(this.velocity.y > 3.5 && keyboard.up){
                this.velocity.y = -5
            }
            break;
        }
        if(keyboard.right){
            this.velocity.x += this.horizontalSpeed;
        }
        if(keyboard.left){
            this.velocity.x -= this.horizontalSpeed;
        }
        if(keyboard.up){
            if(this.getMaximumY() <= this.y){
                this.velocity.y -= this.jumpHeight;
            }else{
                this.velocity.y -= this.hoverSpeed;
            }
        }
    }
    
}
Player.SHAKY_HOVER = 0;


class BackgroundElement{
    
    constructor(x){
        this.x = x;
        this.angle = Math.random() * Math.PI
    }
    draw(){
        ctx.strokeStyle = "#999"
        ctx.beginPath();
        ctx.moveTo(this.x, 600);
        ctx.lineTo(this.x+Math.cos(this.angle)*50, 600 - Math.sin(this.angle)*50);
        ctx.closePath();
        ctx.stroke();
    }
    tick(){
        this.x--;
        if(this.x < 0){
            this.x+=800;
        }
    }
}