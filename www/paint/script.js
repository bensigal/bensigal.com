var canvas, ctx, topLeft, mainLoopIntervalCode;
var speedMod = 1/15
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
        background:"white",
        text:"white",
        grid:"#505",
    }
}
var theme = themes.basic;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background
    
    ticks=30*60;
    
    ctx = canvas.getContext("2d");
    
    player1  = new sprite.Player(true);
    player2  = new sprite.Player(false);
    
    squares = [];
    for(var i = 0; i < numRows; i++){
        squares.push([]);
        for(var j = 0; j < numColumns; j++){
            squares[i].push(new sprite.Square(i,j));
        }
    }
    mainLoop();
    stopped=true;
}
$(start);
function victory(isp1){
    stopped=true;
    clearInterval(mainLoopIntervalCode);
    ctx.font="100px Impact";
    ctx.fillStyle = theme.text;
    ctx.fillText(isp1?"PLAYER 1 WINS":"PLAYER 2 WINS", 120, 100)
}
function tiedGame(){
    stopped=true;
    clearInterval(mainLoopIntervalCode);
    ctx.font="100px Impact";
    ctx.fillStyle = theme.text;
    ctx.fillText("TIE", 338, 100)
}
function mainLoop(){
    ctx.clearRect(0,0,800,600)
    ticks--;
    
    player1.tick();
    player2.tick();
    
    squares.forEach(function(squareArray){
        squareArray.forEach(function(square){
            square.draw();
        });
    });
    
    ctx.fillStyle = "white";
    ctx.fillRect(399,0,2,600);
    
    //Circular Collision
    if(distanceBetweenPlayers() < player1.r * 2){
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
    
    player1.draw();
    player2.draw();
    
    ctx.fillStyle = ticks < 60*10 ? "white" : "#33F"
    
    var secondsPassed = Math.floor(ticks/60);
    var tenthsPlace = Math.floor(ticks/6)%10;
    
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
    this.y=330;
    
    this.r=10;
    this.isp1 = isp1;
    this.tick=function(){
        
        if(isp1){
            if(keyboard.w){
                this.yVel-=0.3;
            }
            if(keyboard.s){
                this.yVel+=0.3;
            }
            if(keyboard.d){
                this.xVel+=0.3;
            }
            if(keyboard.a){
                this.xVel-=0.3;
            }
        }else{
            if(keyboard.up){
                this.yVel-=0.3;
            }
            if(keyboard.down){
                this.yVel+=0.3;
            }
            if(keyboard.right){
                this.xVel+=0.3;
            }
            if(keyboard.left){
                this.xVel-=0.3;
            }
        }
        
        //Slow down; stop if going really slowly.
        if(this.xVel > 0.01){
            this.xVel -= this.xVel*speedMod
        }else if(this.xVel < 0.01){
            this.xVel -= this.xVel*speedMod
        }else{
            this.xVel = 0;
        }
        if(this.yVel > 0.01){
            this.yVel -= this.yVel*speedMod
        }else if(this.yVel < 0.01){
            this.yVel -= this.yVel*speedMod
        }else{
            this.yVel = 0;
        }
        //Move based on velocity;
        this.x+=this.xVel;
        this.y+=this.yVel;
        //If on edge, bounce
        if(this.x > 790){
            this.x=790;
            this.xVel = - this.xVel
        }
        if(this.x < 10){
            this.x=10;
            this.xVel = - this.xVel
        }
        if(this.y > 590){
            this.y=590;
            this.yVel = - this.yVel
        }
        if(this.y < 10){
            this.y=10;
            this.yVel = - this.yVel
        }
        
        rowIndex    = Math.floor(this.x/squareHeight);
        columnIndex = Math.floor(this.y/squareWidth);
        
        squares[rowIndex][columnIndex].setOwnership(this.isp1);
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
        mainLoopIntervalCode = setInterval(mainLoop, 16);
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