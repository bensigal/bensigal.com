class UpgradeType{
    
    constructor(description, price, onBuy, multipleTimes){
        this.description = description;
        this.price = price;
        this.onBuy = onBuy;
        this.multipleTimes = multipleTimes;
        this._available = true;
    }
    
    available(){
        return this._available;
    }
    
    buy(){
        if(!this.multipleTimes){
            this._available = false;
        }
        this.onBuy();
    }
    
}

var upgradeTypes = {
    
    life1: new UpgradeType("Extra Life", 20, ()=>{player.lives++}, true),
    
    speed1: new UpgradeType("A Bit Faster", 10, ()=>{player.speed = 3}),
    speed2: new UpgradeType("Faster", 40,       ()=>{player.speed = 5}),
    speed3: new UpgradeType("Much Faster", 200, ()=>{player.speed = 8}),
    speed4: new UpgradeType("Way Faster", 1000, ()=>{player.speed = 15}),
    
    reload1: new UpgradeType("Slow Reload", 10,        ()=>{player.reloadTime = 7}),
    reload2: new UpgradeType("Alright Reload", 40,     ()=>{player.reloadTime = 5}),
    reload3: new UpgradeType("Fast Reload", 200,       ()=>{player.reloadTime = 3}),
    reload4: new UpgradeType("Super Fast Reload", 1000,()=>{player.reloadTime = 1}),
    reload5: new UpgradeType("Instant Reload", 4000,   ()=>{player.reloadTime = 0}),
};

class Upgrade{
    
    constructor(){
        
        this.selectType();
        this.x = Math.floor(Math.random()*700);
        this.w = 100;
        this.y = 0;
        this.h = 30;
        
    }
    
    draw(){
        
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.stroke();
        ctx.closePath();
        
        ctx.textAlign = "center";
        ctx.font = "14px Arial";
        ctx.fillText(this.type.description, this.x + this.w/2, this.y + 14);
        ctx.fillText("$" + this.type.price, this.x + this.w/2, this.y + 29);
        
    }
    
    tick(){
        this.y += 2;
        if(rectangularCollisionTest(this, player)){
            if(player.money >= this.type.price){
                player.money -= this.type.price;
                this.type.buy();
                this.destroyAndGetNewUpgrade();
            }
        }
        if(this.y > 600){
            this.destroyAndGetNewUpgrade();
        }
    }
    
    destroyAndGetNewUpgrade(){
        upgrades.pop();
        upgrades.push(new Upgrade());
    }
    
    selectType(){
        
        if(level < 5){
            
            var type = {available: () => false};
            
            while(true){
                var seed = Math.floor(Math.random()*5);
                switch(seed){
                case 0:
                case 1:
                case 2:
                    type = upgradeTypes.life1;
                    break;
                case 3:
                    type = upgradeTypes.speed1;
                    break;
                case 4:
                    type = upgradeTypes.reload1;
                    break;
                }
                if(type.available()){
                    this.type = type;
                    break;
                }
            }
            
        }
        
    }
    
}

class Bullet{
    
    constructor(x){
        this.x = x - 1;
        this.y = 530;
        this.w = 1;
        this.h = 5;
    }
    
    tick(){
        this.y -= 3;
    }
    
    draw(){
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    
}

/*
Represented as a triangle on screen (equilateral).
Actual hitbox is a square inscribed in the triangle.
For reference, this means that the side length of the triangle
is (2+sqrt(3))/sqrt(3) times the length of the side of square.
The height of the triangle is (2+sqrt(3))/2
*/
class Player{
    
    constructor(){
        //These values are for the hitbox
        this.x = 390;
        this.w = 20;
        this.y = 550;
        this.h = this.w;
        //Horizontal speed
        this.speed = 2;
        //Ticks spent before next fire
        this.reloadTime = 10;
        this.lastFire = -Infinity;
        
        this.money = 1000;
    }
    
    draw(){
        //Top corner
        ctx.moveTo(this.x + this.w/2, this.y + this.h - this.w * (2+Math.sqrt(3))/2);
        
        ctx.beginPath();
        //Lines to Right, Left, Top.
        ctx.lineTo(this.x + this.w + 1/Math.sqrt(3), this.y + this.h);
        ctx.lineTo(this.x - 1/Math.sqrt(3), this.y + this.h);
        ctx.lineTo(this.x + this.w/2, this.y + this.h - this.w * (2+Math.sqrt(3))/Math.sqrt(3));
        
        ctx.closePath();
        ctx.stroke();
        
        //Hitbox
        //ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    
    tick(){
        if(keyboard.left){
            this.x -= this.speed;
        }else if(keyboard.right){
            this.x += this.speed;
        }
        if(this.x < 2){
            this.x = 2;
        }
        if(this.x > 798){
            this.x = 798;
        }
        if(keyboard.up && ticks - this.lastFire > this.reloadTime + 1){
            bullets.push(new Bullet(this.x + this.w/2));
            this.lastFire = ticks;
        }
    }
    
}