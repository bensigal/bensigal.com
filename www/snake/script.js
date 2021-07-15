var canvas, ctx, topLeft, head, snakeSquares, previousDirection, growing, food, stewart=false, paused=false;
var keyboard = {};
var sprite = {};
var enemies;
var player;
var squares;
var head;
var direction;
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
    }
};
var theme = themes.basic;
var nextTick = 0;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    growing=9;
    topLeft = {x:0,y:0};
    food = new sprite.Food(10,10);
    
    ctx = canvas.getContext("2d");
    direction  = "right";
    snakeSquares = [{x:3,y:3}];
    ticks   = 0;
    
    squares = [];
    
    for(var i = 0; i < 80; i++){
        var squareArray = [];
        for(var j = 0; j < 60; j++){
            squareArray.push(new sprite.Square(i,j));
        }
        squares.push(squareArray);
    }
    
    nextTick = new Date().getTime();
    
    stopped=false;
    
    window.requestAnimationFrame(mainLoop);
}
$(start);
function mainLoop(){
    if(paused || stopped || nextTick > new Date().getTime()){
        window.requestAnimationFrame(mainLoop);
        return;
    }
    
    ctx.clearRect(0,0,800,600);
    
    for(var i = 0; i < 60; i++){
        squares[0][i].state = "wall";
        squares[79][i].state = "wall";
    }
    for(i = 1; i < 79; i++){
        squares[i][0].state = "wall";
        squares[i][59].state = "wall";
        for(var j = 1; j < 59; j++){
            squares[i][j].state = "empty";
        }
    }
    squares[food.x][food.y].state = "food";
    
    var toBeChecked;
    if(snakeSquares)
    switch(direction){
    case "right":
        toBeChecked = squares[snakeSquares[0].x+1][snakeSquares[0].y];break;
    case "left":
        toBeChecked = squares[snakeSquares[0].x-1][snakeSquares[0].y];break;
    case "down":
        toBeChecked = squares[snakeSquares[0].x][snakeSquares[0].y+1];break;
    case "up":
        toBeChecked = squares[snakeSquares[0].x][snakeSquares[0].y-1];break;
    }
    
    snakeSquares.unshift({x:toBeChecked.x,y:toBeChecked.y});
    if(!growing)snakeSquares.pop();
    snakeSquares.forEach(function(square, index){
        if(index === 1){
            squares[square.x][square.y].state = "second";
        }else if(index){
            squares[square.x][square.y].state = "body";
        }
    });
    if(!toBeChecked || toBeChecked.state == "body" || toBeChecked.state=="wall"){
        stopped = true;
        ctx.fillStyle = "red";
        ctx.font="100px";
        ctx.fillText("SNAKE!",220,200);
        setTimeout(function(){
            ctx.font="100px";
            ctx.fillStyle = "red";
            ctx.fillText("SNAKE!",220,300);
        },750);
        setTimeout(function(){
            ctx.font="100px";
            ctx.fillStyle = "red";
            ctx.fillText("SNAAAAAKE!",80,400);
        },1500);
    }
    else if(toBeChecked.state == "food"){
        while(true){
            food.x = Math.floor(Math.random()*80);
            food.y = Math.floor(Math.random()*60);
            if(squares[food.x][food.y].state == "empty"){
                break;
            }
        }
        if(!growing)growing++;
        growing+=10;
        
    }
    snakeSquares[0].state = "head";
    ticks++;
    squares.forEach(function(squareArray){
        squareArray.forEach(function(square){
            square.draw();
        });
    });
    previousDirection = direction;
    if(growing){growing--;}
    ctx.font="30px Georgia";
    ctx.fillStyle="#0A0";
    ctx.fillText(snakeSquares.length,700,30);
    
    nextTick += 33;
    if(nextTick < new Date().getTime())
        mainLoop();
    else
        window.requestAnimationFrame(mainLoop);
}
$(document).keydown(function(e){
    e.preventDefault();
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        if(previousDirection!="right")
        direction="left";
        break;
    case 38:
        keyboard.up = true;
        if(previousDirection!="down")
        direction="up";
        break;
    case 39:
        keyboard.right = true;
        if(previousDirection!="left")
        direction="right";
        break;
    case 40:
        keyboard.down = true;
        if(previousDirection!="up")
        direction="down";
        break;
    case 87:
        if(previousDirection!="down")
        direction="up";
        keyboard.w=true;
        break;
    case 68:
        keyboard.d=true;
        if(previousDirection!="left")
        direction="right";
        break;
    case 65:
        keyboard.a=true;
        if(previousDirection!="right")
        direction="left";
        break;
    case 83:
        keyboard.s=true
        if(previousDirection!="up")
        direction="down";
        break;
    }
    if(e.keyCode==32 && stopped){
        start();
    }else if(e.keyCode==32){
        paused = !paused;
    }
});
$(document).mousedown(function(e){
    if(stopped){
        start();
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

sprite.Sprite = function(x,y){
    this.x=x;
    this.y=y;
}
sprite.Square = function(x,y){
    this.x = x;
    this.y = y;
    this.realX = x*10+1;
    this.realY = y*10+1;
    this.w = 8;
    this.h = 8
    this.state = "empty"
    this.draw=function(){
        switch(this.state){
        case "head":
        case "second":
        case "body":
        case "wall":
            ctx.fillStyle="black"
            ctx.fillRect(this.realX, this.realY, this.w, this.h);
            break;
        case "food":
            ctx.fillStyle="#00F"
            ctx.fillRect(this.realX,this.realY,this.w,this.h);
            break;
        case "empty":
            break;
        }
    }
}
sprite.Food = function(x,y){
    this.x=x;
    this.y=y;
    this.realX = x*10+1;
    this.realY=y*10+1;
    this.w = 8;
    this.h = 8;
    this.draw = function(){
        ctx.fillStyle="#00F"
        ctx.fillRect(this.realX,this.realY,this.w,this.h)
    }
}