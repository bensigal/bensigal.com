var canvas, ctx, mainLoopIntervalCode, player, ticks;

var keyboard = {};
var stopped = false;
var lastKeys=[];

var themes = {
    basic:{
        player:"black",
        background:"white",
        sword: "red",
    }
}
var theme = themes.basic;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background
    
    ticks = 0;
    
    ctx = canvas.getContext("2d");
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
    player = new Player();
    
    stopped=false;
}
$(start);

function mainLoop(){
    
    ctx.clearRect(0,0,800,600)
    
    player.draw();
    
    ticks++;
    
}

class Player{
    
    constructor(){
        this.x = 50;
        this.y = 500;
        this.w = 50;
        this.h = 50;
        
        this.sword = new Sword(this);
    }
    
    draw(){
        this.sword.draw();
        ctx.fillStyle = theme.player;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    
}

class Sword{
    
    constructor(player){
        this.player = player;
        this.angle = 0;
        this.visible = false;
        this.behavior = "reset"
    }
    
    get x(){
        return this.player.x + this.player.w/2
    }
    
    get y(){
        return this.player.y + this.player.h/2
    }
    
    draw(){
        
        if(!this.visible){
            return;
        }
        switch(this.behavior){
        case "down":
            if(this.angle > Math.PI*2){
                this.angle = 0;
            }else if(this.angle === 0){
                this.length -= 15;
                if(this.length < 25){
                    this.stroke("reset");
                }
            }else{
                this.angle += 0.07;
            }
            break;
        case "up":
            if(this.angle < 0){
                this.angle = 0;
            }else if(this.angle === 0){
                this.length -= 15;
                if(this.length < 25){
                    this.stroke("reset");
                }
            }else{
                this.angle -= 0.07;
            }
            break;
        }
        
        ctx.strokeStyle = theme.sword;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y + Math.sin(this.angle) * this.length)
        ctx.stroke();
        ctx.closePath();
    }
    
    stroke(behavior){
        
        //Starting conditions
        switch(behavior){
        case "down":
        case "up":
            if(this.behavior != "reset")return;
            break;
        }
        
        this.behavior = behavior;
        
        switch(behavior){
        case "down":
            this.visible=true;
            this.length = 100;
            this.angle = 3*Math.PI/2;
            break;
        case "up":
            this.visible=true;
            this.length = 100;
            this.angle = Math.PI/2;
            break;
        case "reset":
            this.visible = false;
        }
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
        player.sword.stroke("up");
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
        player.sword.stroke("down");
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
    case 32:
        if(stopped){
            start();
        }
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
})

function rectangularCollisionTest(a,b){
    
    var al = a.x;
    var ar = a.x+a.w;
    var at = a.y;
    var ab = a.y+a.h;
    
    var bl = b.x;
    var br = b.x+b.w;
    var bt = b.y;
    var bb = b.y+b.h;
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    )
}