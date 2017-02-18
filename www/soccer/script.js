var canvas, ctx, topLeft, mainLoopIntervalCode, ticksLeft;
var keyboard = {};
var sprite = {};
var ticks;

var themes = {
    basic:{
        player1:"#F33",
        player2:"#33F",
        player1square:"#600",
        player2square:"#006",
        powerup:"#3F3",
        background:"white",
        text:"white",
        grid:"#505",
    }
};
var theme = themes.basic;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    ctx = canvas.getContext("2d");
    
    player1  = new sprite.Player(true);
    player2  = new sprite.Player(false);
    
    stopped=true;
    
    mainLoop();
}
$(start);

function mainLoop(){
    ctx.clearRect(0,0,800,600);
    
    player1.tick();
    player2.tick();
    
    //Circular Collision
    if(distanceBetweenPlayers() < player1.r + player2.r){
        var p1in2 = player1.x > 390;
        var p2in1 = player2.x < 410;
        
        if(!p1in2 && !p2in1){
            player1.xVel *= -4;
            player1.yVel *= -4;
            player2.xVel *= -4;
            player2.yVel *= -4;
        }
    }
    
    player1.draw();
    player2.draw();
}
function distanceBetweenPlayers(){
    //pythagorean
    return Math.sqrt(
        Math.pow(player1.x - player2.x, 2) +
        Math.pow(player1.y - player2.y, 2)
    )
}
sprite.Player = function(isp1){
    
    this.x=isp1?50:750;
    this.y=300;
    
    this.r=10;
    this.isp1 = isp1;
    
    this.speed = 1/15;
    this.bonusSpeedMod = 0.75;
    this.acceleration = 0.6
    
    this.tick=function(){
        
        if(isp1){
            if(keyboard.w){
                this.yVel-=this.acceleration;
            }
            if(keyboard.s){
                this.yVel+=this.acceleration;
            }
            if(keyboard.d){
                this.xVel+=this.acceleration;
            }
            if(keyboard.a){
                this.xVel-=this.acceleration;
            }
        }else{
            if(keyboard.up){
                this.yVel-=this.acceleration;
            }
            if(keyboard.down){
                this.yVel+=this.acceleration;
            }
            if(keyboard.right){
                this.xVel+=this.acceleration;
            }
            if(keyboard.left){
                this.xVel-=this.acceleration;
            }
        }
        
        //Slow down; stop if going really slowly.
        if(this.xVel > 0.01){
            this.xVel -= this.xVel*this.speed
        }else if(this.xVel < 0.01){
            this.xVel -= this.xVel*this.speed
        }else{
            this.xVel = 0;
        }
        if(this.yVel > 0.01){
            this.yVel -= this.yVel*this.speed
        }else if(this.yVel < 0.01){
            this.yVel -= this.yVel*this.speed
        }else{
            this.yVel = 0;
        }
        //Move based on velocity;
        this.x+=this.xVel;
        this.y+=this.yVel;
        
        //If on edge, bounce
        if(this.x > 800 - this.r){
            this.x=800 - this.r;
            this.xVel = - this.xVel
        }
        if(this.x < this.r){
            this.x=this.r;
            this.xVel = - this.xVel
        }
        if(this.y > 600 - this.r){
            this.y=600 - this.r;
            this.yVel = - this.yVel
        }
        if(this.y < this.r){
            this.y=this.r;
            this.yVel = - this.yVel
        }
    }
    this.draw = function(){
        ctx.fillStyle=this.isp1?theme.player1:theme.player2
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
}
$(document).keydown(function(e){
    var didntMatter = false;
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
    default:
        didntMatter = true;
    }
    if(!didntMatter){
        e.preventDefault();
    }
    if(e.keyCode==32 && stopped){
        e.preventDefault();
        start();
        mainLoopIntervalCode = setInterval(mainLoop, 33);
        stopped = false;
    }
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
});