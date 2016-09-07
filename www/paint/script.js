var canvas, ctx, topLeft, mainLoopIntervalCode, ticksLeft;
var keyboard = {};
var sprite = {};
var ticks;
var squares;
var numRows = 40;
var numColumns = 30;
var squareWidth = 20;
var squareHeight = 20;

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
    
    ticks=30*30 + 1; //One tick is run for setup
    ticksLeft = 0;
    
    ctx = canvas.getContext("2d");
    
    player1  = new sprite.Player(true);
    player2  = new sprite.Player(false);
    
    powerup = new sprite.Powerup(1);
    
    squares = [];
    for(var i = 0; i < numRows; i++){
        squares.push([]);
        for(var j = 0; j < numColumns; j++){
            squares[i].push(new sprite.Square(i,j));
        }
    }
    mainLoop();
    ctx.fillStyle = "white";
    ctx.fillRect(250,250,300,100);
    ctx.fillStyle = "black";
    ctx.font = "30px Georgia";
    ctx.fillText("Press space to start.", 270, 283);
    ctx.font = "20px Georgia";
    ctx.fillText("Instructions are at the ", 303, 315);
    ctx.fillText("bottom of the page.", 315, 337);
    stopped=true;
}
$(start);
function victory(isp1){
    stopped=true;
    clearInterval(mainLoopIntervalCode);
    ctx.font="100px Impact";
    ctx.fillStyle = theme.text;
    ctx.fillText(isp1?"PLAYER 1 WINS":"PLAYER 2 WINS", 120, 100);
}
function tiedGame(){
    stopped=true;
    clearInterval(mainLoopIntervalCode);
    ctx.font="100px Impact";
    ctx.fillStyle = theme.text;
    ctx.fillText("TIE", 338, 100);
}
function mainLoop(){
    ctx.clearRect(0,0,800,600); 
    ticks--;
    
    player1.tick();
    player2.tick();
    
    powerup.tick();
    
    if(ticksLeft){
        ticksLeft--;
    }
    
    squares.forEach(function(squareArray){
        squareArray.forEach(function(square){
            square.draw();
        });
    });
    
    ctx.fillStyle = "white";
    ctx.fillRect(399,0,2,600);
    ctx.fillStyle = "#3F3"
    ctx.fillRect(0,0,ticksLeft*7,10)
    
    //Circular Collision
    if(distanceBetweenPlayers() < player1.r + player2.r){
        var p1in2 = player1.x > 390;
        var p2in1 = player2.x < 410;
        
        if(!p1in2 && !p2in1){
            player1.xVel *= -4;
            player1.yVel *= -4;
            player2.xVel *= -4;
            player2.yVel *= -4;
        }else if(!p1in2){
            victory(true);
        }else if(!p2in1){
            victory(false);
        }
    }
    
    powerup.draw();
    
    player1.draw();
    player2.draw();
    
    ctx.fillStyle = ticks < 30*10 ? "white" : "#33F"
    
    var secondsPassed = Math.floor(ticks/30);
    var tenthsPlace = Math.floor(ticks/3)%10;
    
    ctx.font = "30px Georgia";
    ctx.fillText(secondsPassed+"."+tenthsPlace, 700, 540)
    
    var p1score = 0;
    var p2score = 0;
    
    squares.forEach(function(row){
        row.forEach(function(square){
            p1score+= square.isp1;
            p2score+=!square.isp1;
        })
    })
    
    ctx.fillText(p1score + "-" + p2score, 660, 580)
    
    if(ticks == 0){
        if(p1score > p2score){
            victory(true);
        }else if(p2score > p1score){
            victory(false);
        }else{
            tiedGame();
        }
    }
    if(ticks == 30 * 20){
        if(!powerup.showing){
            powerup.setId(2);
        }
    }
    if(ticks == 30 * 10){
        if(!powerup.showing){
            powerup.setId(3);
        }
    }
}
function distanceBetweenPlayers(){
    //That geometry tho...
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
            this.xVel -= this.xVel*this.speed*this.bonusSpeedMod
        }else if(this.xVel < 0.01){
            this.xVel -= this.xVel*this.speed*this.bonusSpeedMod
        }else{
            this.xVel = 0;
        }
        if(this.yVel > 0.01){
            this.yVel -= this.yVel*this.speed*this.bonusSpeedMod
        }else if(this.yVel < 0.01){
            this.yVel -= this.yVel*this.speed*this.bonusSpeedMod
        }else{
            this.yVel = 0;
        }
        //Move based on velocity;
        this.x+=this.xVel;
        this.y+=this.yVel;
        //Determine which side of stage are on, calculate speed modifier (changes max speed)
        if((this.isp1 && this.x < 400) || (!this.isp1 && this.x > 400)){
            this.bonusSpeedMod = 0.5;
        }else{
            this.bonusSpeedMod = 1;
        }
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
        
        rowIndex    = Math.floor(this.x/squareHeight);
        columnIndex = Math.floor(this.y/squareWidth);
        
        squares[rowIndex][columnIndex].setOwnership(this.isp1);
        
        if(this.r > 15){
            squares[rowIndex - 1][columnIndex].setOwnership(this.isp1);
            squares[rowIndex + 1][columnIndex].setOwnership(this.isp1);
            squares[rowIndex][columnIndex - 1].setOwnership(this.isp1);
            squares[rowIndex][columnIndex + 1].setOwnership(this.isp1);
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
sprite.Square = function(row, column){
    this.row = row;
    this.column = column;
    this.x = row*squareWidth;
    this.y = column*squareHeight;
    this.w = squareWidth;
    this.h = squareHeight;
    this.isp1 = true;
    this.setOwnership = function(isp1){
        this.isp1 = isp1;
        this.fillStyle = isp1?theme.player1square:theme.player2square;
    }
    this.draw = function(){
        ctx.fillStyle = this.fillStyle
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.fillStyle = theme.grid;
        ctx.fillRect(this.x-1,this.y-1,1,squareHeight);
        ctx.fillRect(this.x-1,this.y-1,squareWidth,1);
    }
    this.setOwnership(this.row < numRows/2)
}
sprite.Powerup = function(){
    this.id = 1;
    this.x = 400;
    this.y = 300;
    this.r = 10;
    this.showing = true;
    this.setId = function(id){
        this.id = id;
        this.showing = true;
        if(id == 2){
            this.y = 100;
        }else if(id == 3){
            this.y = 500;
        }
    }
    this.draw = function(){
        if(!this.showing)return;
        ctx.fillStyle=theme.powerup
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    this.tick = function(){
        if(this.showing){
            
            var touchingPlayer = null;
            
            var player1IsTouching = Math.sqrt(
                Math.pow(this.x - player1.x, 2) +
                Math.pow(this.y - player1.y, 2)
            ) < this.r + player1.r
            
            var player2IsTouching = Math.sqrt(
                Math.pow(this.x - player2.x, 2) +
                Math.pow(this.y - player2.y, 2)
            ) < this.r + player2.r
            
            if(player1IsTouching && player2IsTouching)return;
            
            if(player1IsTouching){
                touchingPlayer = player1;
            }
            if(player2IsTouching){
                touchingPlayer = player2;
            }
            
            if(!touchingPlayer)return;
            
            switch(this.id){
            case 1: case 3:
                var callback = function(touchingPlayer, isNegative){
                    touchingPlayer.r++;
                    if(isNegative)touchingPlayer.r-=2;
                }
                for(var i = 0; i < 20; i++){
                    setTimeout(function(){
                        callback(touchingPlayer);
                    }, i*20);
                    setTimeout(function(){
                        callback(touchingPlayer, true);
                    }, i*20 + 2000);
                }
                ticksLeft = 30*2;
                break;
            /*case 2:
                touchingPlayer.speed /=2;
                touchingPlayer.acceleration *=2;
                setTimeout(function(){
                    touchingPlayer.speed *= 2;
                    touchingPlayer.acceleration /= 2;
                }, 5000)
                ticksLeft = 30*5;
                break;*/
            case 2:
                var notTouchingPlayer = touchingPlayer.isp1?player2:player1;
                notTouchingPlayer.speed *=3;
                setTimeout(function(){
                    notTouchingPlayer.speed /=3;
                }, 2500)
                ticksLeft = 30*2.5;
            }
            this.showing = false;
            
        }
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