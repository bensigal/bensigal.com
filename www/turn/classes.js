var player = {
    init: function(){
        this.x = 50;
        this.y = 500;
        this.w = 20;
        this.h = 20;
        this.color = "#00F";
        this.moving = false;
        this.health = this.maxHealth;
    },
    draw: function(){
        ctx.fillStyle = this.color;
        if(this.moving){
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }else{
            ctx.fillRect(50, 500, 20, 20);
        }
    },
    tick: function(dt){
        if(this.moving){
            this.t += dt;
            this.y = this.pattern.y(this.t);
            this.x = this.pattern.x(this.t);
            ctx.fillText((this.t - this.pattern.target)/this.pattern.r, 100, 100);
            if(this.t > this.pattern.end){
                this.moving = false;
                finishAttack();
            }
        }
    },
    adoptPattern: function(pattern){
        this.pattern = pattern;
        this.t = 0;
        this.moving = true;
        this.hasAttacked = false;
    },
    hit: function(){
        if(!this.moving || this.hasAttacked)return;
        this.hasAttacked = true;
        shadow.spawn(this.x, this.y, this.w, this.h);
        //How far away divided by maximum far away. "-1" means early as allowed, 0 is perfect, and 1 is as late as allowed
        var rsAway = (this.t - this.pattern.target)/this.pattern.r;
        console.log(rsAway);
        if(rsAway <= -1){
            hitMessage = "So early you missed";
            damageMultiplier = 0 
        }else if(rsAway <= -0.75){
            hitMessage = "Far too early - Half damage";
            damageMultiplier = 0.5;
        }else if(rsAway <= -0.5){
            hitMessage = "Too early - 75% damage";
            damageMultiplier = 0.75;
        }else if(rsAway <= -0.25){
            hitMessage = "Slightly early - Full damage";
            damageMultiplier = 1;
        }else if(rsAway <= 0.25){
            hitMessage = "Perfect! 150% damage!";
            damageMultiplier = 1.5;
        }else if(rsAway <= 0.5){
            hitMessage = "Slightly late - Full damage";
            damageMultiplier = 1;
        }else if(rsAway <= 0.75){
            hitMessage = "Too late - 75% damage";
            damageMultiplier = 0.75;
        }else if(rsAway <= 1){
            hitMessage = "Far too early - Half damage";
            damageMultiplier = 0.5;
        }else{
            hitMessage = "So late you missed";
            damageMultiplier = 0;
        }
        this.pattern.damage(damageMultiplier);
    },
    maxHealth: 50,
};
var message = {
    show: false,
    draw: function(){
        if(!this.show)return;
        ctx.fillStyle = "black";
        ctx.font = "18px Ubuntu";
        ctx.fillText(this.message, 20, 550);
    },
    create: function(message, callback){
        this.message = message;
        this.show = true;
        this.callback = callback;
    }
};
var shadow = {
    spawn: function(x, y){
        this.x = x;
        this.y = y;
        this.show = true;
    },
    draw: function(){
        if(this.show){
            ctx.fillStyle = "#66F";
            ctx.fillRect(this.x, this.y, 20, 20);
        }
    }
};
var movementPatterns = {
    test:{
        x: t => 730 - Math.abs(680 - t/4),
        y: function(t){
            return 0.00423 * Math.pow(this.x(t) - 393, 2);
        },
        target: 2720,
        end: 5440,
        r: 80,
        baseDamage: 10,
        damage: function(multiplier){
            enemy.takeDamage(this.baseDamage * multiplier)
            message.create(hitMessage+"! Total damage: "+(this.baseDamage*multiplier)+".", enemy.attack);
        }
    }
};
var enemy = {
    x: 730,
    y: 500,
    w: 20,
    h: 20,
    color: "#F00",
    takeDamage: function(damage){
        this.health -= damage;
    },
    draw: function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    },
    init: function(){
        this.health = (level + 4) * 10;
        this.attack = function(){
            var damage = 4 + Math.floor(Math.random()*level);
            player.health -= damage;
            message.create("Enemy does "+damage+" damage!"+PSTC, nextTurn);
        };
    }
};