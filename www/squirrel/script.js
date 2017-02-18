var canvas, ctx, topLeft, mainLoopIntervalCode;

var keyboard = {};
var sprite = {};
var enemies;
var player;
var log = "";
var startingStartingSpeed = 8;
var startingSpeed;
var diffMod = 1.2;
var levelGap = 200;
var speed;
var level;
var ticks;
var stewart;
var stopped = false;
var lastKeys=[];
var themes = {
    basic:{
        player:"black",
        background:"white",
        enemy:"#F00",
        powerup:"#1F4",
        dead:"#F33",
        text:"black",
        outline:"black",
        stewart:"#00F"
    },
    xwing:{
        player:null,
        background:"black",
        enemy:"#F00",
        powerup:"#1F4",
        dead: "#400",
        text:"white",
        outline:"white",
        stewart:null
    }
}
var theme = themes.basic;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background
    
    topLeft = {x:0,y:0};
    
    ctx = canvas.getContext("2d");
    
    enemies = [];
    ticks   = 0;
    level   = 1;
    powerup = {};
    startingSpeed=startingStartingSpeed;
    
    player  = new sprite.Player();
    stewart = new sprite.Stewart();
    
    for(var i = 0; i < 8; i+=4){
        enemies.push(new sprite.Enemy(i/2,i))
    }
    for(var i = 0; i < 8; i+=4){
        enemies.push(new sprite.Enemy(i/2,i-7))
    }
    for(var i = 0; i < 8; i+=4){
        enemies.push(new sprite.Enemy(i/2,i-14))
    }
    for(var i = 0; i < 8; i+=4){
        enemies.push(new sprite.Enemy(i/2,i-21))
    }
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
    stopped=false;
}
$(start);
function mainLoop(){
    ctx.clearRect(0,0,800,600)
    ticks++;
    speed = startingSpeed + Math.sqrt(level)*diffMod
    
    var hit = false;
    
    player.tick();
    stewart.tick();
    
    if(stewart.playing){
        stewart.draw();
    }
    
    enemies.forEach(function(enemy){
        enemy.tick();
        hit=hit||rectangularCollisionTest(player,enemy, true, true);
    });
    
    hit=hit||rectangularCollisionTest(player, stewart, true);
    
    if(hit){
        ctx.fillStyle=theme.dead;
        //ctx.fillRect(0,0,800,600);
        stopped=true;
        clearInterval(mainLoopIntervalCode)
    }
    player.draw();
    
    enemies.forEach(function(enemy){
        enemy.draw(hit);
    });
    
    if(powerup.active){
        powerup.draw();
        if(rectangularCollisionTest(player,powerup)){
            powerup.award();
        }
    }
    
    log=Math.floor(ticks/6)
    ctx.font = "30px Georgia"
    ctx.fillStyle = theme.text
    ctx.fillText(log,650,30);
    ctx.fillText("Level: "+level, 650, 80)
    
    if(ticks%levelGap === 0){
        level++;
        if(level%3===0){
            powerupLevel = level/3;
            powerup.powerupLevel=powerupLevel;
            powerup.active=true;
            powerup.x=powerupLevel *50 + 127;
            powerup.y=powerupLevel *20 + 87;
            powerup.w=40
            powerup.h=40
            powerup.draw=function(){
                ctx.fillStyle=theme.powerup;
                ctx.drawImage($("#orange")[0],this.x,this.y,this.w,this.h);
            }
            powerup.award=function(){
                this.active=false;
                startingSpeed = -2// - this.powerupLevel;
                hyperInterval = setInterval(function(){
                    ctx.font = "72px Georgia"
                    ctx.textAlign = "center";
                    ctx.fillText("HYPER!!!", 400, 300);
                }, 100);
                setTimeout(function(){
                    startingSpeed=startingStartingSpeed;
                    clearInterval(hyperInterval);
                },this.powerupLevel*500 + 2000);
            }
        }
        if(level > 15){
            var index = level - 15;
            enemies[index] = new MovingEnemy(5,5)
        }
    }
}
sprite.Player = function(){
    
    this.x=20;
    this.y=30;
    
    this.w=100;
    this.h=50;
    
    this.speed = 5;
    
    this.tick= function(){
        
        if(keyboard.up){
            this.y-=this.speed;
        }
        if(keyboard.down){
            this.y+=this.speed;
        }
        if(keyboard.right){
            this.x+=this.speed;
        }
        if(keyboard.left){
            this.x-=this.speed;
        }
        
        if(this.x > 800-this.w/2) this.x=800-this.w/2;
        if(this.x < 0) this.x = 0;
        if(this.y < 0) this.y = 0;
        if(this.y > 600-this.h/2) this.y=600-this.h/2;
        
    }
    this.draw = function(){
        ctx.drawImage($("#xwing")[0],this.x,this.y,this.w,this.h);
    }
}
$(document).keydown(function(e){
    e.preventDefault();
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 38:
        keyboard.up = true;
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
        break;
    case 87:
        stewart.playing=true;
        keyboard.w=true;
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        break;
    case 83:
        keyboard.s=true
        break;
    }
    if(e.keyCode==32 && stopped){
        start();
    }
    
    lastKeys.push(e.keyCode);
    
    if(lastKeys[0]==37){
        if(lastKeys[1]==39){
            if(lastKeys[2]==38){
                if(lastKeys[3]==40){
                    if(stopped){
                        start();
                    }
                }
                if(lastKeys[3])
                    lastKeys=[];
            }else if(lastKeys[2])
                lastKeys=[];
        }else if(lastKeys[1])
            lastKeys=[];
    }else if(lastKeys[0])
        lastKeys=[];
});
$(document).keyup(function(e){
    switch(e.keyCode){
    case 37:
        keyboard.left = false;
        break;
    case 38:
        keyboard.up = false;
        break;
    case 39:
        keyboard.right = false;
        break;
    case 40:
        keyboard.down = false;
        break;
    case 87:
        keyboard.w=false;
        break;
    case 68:
        keyboard.d=false;
        break;
    case 65:
        keyboard.a=false;
        break;
    case 83:
        keyboard.s=false
        break;
    }
})

sprite.Sprite = function(x,y){
    this.x=x;
    this.y=y;
}
sprite.TestSprite = function(x,y){
    this.x=x;
    this.y=y;
    this.draw = function(){
        ctx.fillRect(x,y,100,100)
    }
}
sprite.Enemy = function(pos,xpos){
    this.y = 0;
    this.setPos = function(pos){
        this.pos=pos;
        this.y=pos*60
    }
    this.pos = 0;
    this.setPos(pos);
    this.x = 790 - xpos*100
    this.w = 90;
    this.h = 60;
    this.tick = function(){
        this.x-=speed;
        if(this.x < -this.w){
            this.x = 800;
            this.setPos(Math.floor(Math.random()*10))
        }
    }
    this.draw = function(hit){
        
        ctx.drawImage($("#broccoli")[0],this.x,this.y + 5,this.w,this.h - 10);
        
    }
}
sprite.MovingEnemy = function(pos,xpos){
    this.y = 0;
    this.setPos = function(pos){
        this.pos=pos;
        this.y=pos*30
    }
    this.pos = 0;
    this.setPos(pos);
    this.x = 790 - xpos*100
    this.w = 10;
    this.h = 30;
    this.movingUp=5
    this.tick = function(){
        this.x-=speed;
        if(this.x < -10){
            this.x = 790;
            this.setPos(Math.floor(Math.random()*20))
            this.movingUp = 0
        }
        if(this.movingUp > 0){
            this.y+=2;
            this.movingUp--
        }else if(this.movingUp > -30){
            this.y-=2;
            this.movingUp--
        }else{
            this.movingUp=30;
        }
        
    }
    this.draw = function(hit){
        if(!hit){
            ctx.fillStyle = theme.enemy;
            ctx.fillRect(this.x,this.y,this.w,this.h);
        }
        ctx.strokeStyle = theme.outline
        ctx.strokeRect(this.x,this.y,this.w,this.h);
        
    }
}
function rectangularCollisionTest(a,b, isAXwing, isBBroccoli){
    
    var al = a.x;
    var ar = a.x+a.w;
    var at = a.y;
    var ab = a.y+a.h;
    if(isAXwing){
        ar-=40
        al+=20
        ab-=20;
        at+=20;
    }
    
    var bl = b.x;
    var br = b.x+b.w;
    var bt = b.y;
    var bb = b.y+b.h;
    if(isBBroccoli){
        bt += 15;
    }
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    )
}
sprite.Stewart = function(){
    this.x=0
    this.y=590
    this.w=10
    this.h=30
    this.tick=function(){
        if(keyboard.w){
            this.y-=1;
        }
        if(keyboard.s){
            this.y+=1;
        }
        if(keyboard.d){
            this.x+=1;
        }
        if(keyboard.a){
            this.x-=1;
        }
        
        if(this.x > 790)this.x=790;
        if(this.x < 0)this.x=0;
        if(this.y < 0)this.y=0;
        if(this.y > 590)this.y=590;
    }
    this.draw=function(){
        ctx.fillStyle=theme.stewart
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}