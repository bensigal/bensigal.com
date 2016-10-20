var canvas, ctx, ticks, topLeft, mainLoopIntervalCode;

var player1;

var keyboard = {};
var theme = {
    player1Color: "#A00",
    player2Color: "#00A",
    blockColor: "black",
    color11:"#FDD",
    color12:"#FBB",
    color13:"#F99",
    color14:"#F77",
    color21:"#DDF",
    color22:"#BBF",
    color23:"#99F",
    color24:"#77F",
    color3: "#F9E9FF",
    zoneText: "#000",
    glowText: "#0F0",
    darkGlowText:"#0C0",
}
var sprite = {};
var stopped = false;
var paused = true;
var blocks, zones, zoneTexts, p1Points, p2Points;

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    player1 = new Player(1);
    player2 = new Player(2);
    
    
    //In order from lowest to highest where conflicts may occur
    blocks = [
        //Bottom left/right square
        new Block(  0, 500, 100, 100),
        new Block(700, 500, 100, 100),
        //Small squares above the corners
        new Block(  0, 425,  25,  25),
        new Block(775, 425,  25,  25),
        //Floor of 2 zone
        new Block(100, 400, 100, 200),
        new Block(600, 400, 100, 200),
        //Center floor
        new Block(300, 400, 200, 200),
        //"Flag" in corners
        new Block(100, 375,  25,  25),
        new Block(675, 375,  25,  25),
        //"Flagpole" in corners
        new Block( 75, 350,  50,  25),
        new Block(675, 350,  50,  25),
        //Floor of 1 zone
        new Block(200, 300, 100, 300),
        new Block(500, 300, 100, 300),
        //Floor of 3 zone
        new Block(  0, 200, 100,  50),
        new Block(700, 200, 100,  50),
        //Center platform
        new Block(350, 200, 100,  50),
        //Inner wall of 3 zone
        new Block(100,   0,  25, 150),
        new Block(675,   0,  25, 150),
        //1 zone platform
        new Block(215, 125,  70,  25),
        new Block(515, 125,  70,  25),
    ];
    
    zoneTexts = [
        new ZoneText(250, 220),
        new ZoneText(150, 220),
        new ZoneText( 50, 120),
        new ZoneText( 50, 485),
        
        new ZoneText(550, 220),
        new ZoneText(650, 220),
        new ZoneText(750, 120),
        new ZoneText(750, 485),
    ];
    
    //In order from lowest point value to highest for each player
    zones = [
        new Zone(200, 0, 100, 500, 1, 1),
        new Zone(100, 0, 100, 500, 1, 2),
        new Zone(0, 0, 100, 200, 1, 3),
        new Zone(0, 450, 100, 50, 1, 4),
        
        new Zone(500, 0, 100, 500, 2, 1),
        new Zone(600, 0, 100, 500, 2, 2),
        new Zone(700, 0, 100, 200, 2, 3),
        new Zone(700, 450, 100, 50, 2, 4),
    ];
    
    for(var i = 0; i < zones.length; i++){
        zoneTexts[i].zone = zones[i];
        zones[i].text = zoneTexts[i];
    }
    
    topLeft = {x:0,y:0};
    
    ctx = canvas.getContext("2d");
    
    ctx.font = "30px Ubuntu";
    
    stopped=false;
    
    p1points = 400;
    p2points = 400;
    
    ticks = 1801;
    
    ctx.textAlign = "center";
    
    //Render once
    mainLoop();
}
$(start);

class ZoneText{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    draw(glow){
        ctx.fillStyle = glow?(this.zone.points>2?theme.glowText:theme.darkGlowText):theme.zoneText;
        ctx.fillText(this.zone.points, this.x, this.y);
    }
}

class Zone{
    
    constructor(x, y, w, h, playerNumber, points){
        
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        
        this.playerNumber = playerNumber;
        this.points = points;
        
    }
    
    get color(){
        return theme["color"+this.playerNumber+this.points];
    }
    
    tick(){
        this.glow=false;
        var scoringPlayer = this.playerNumber==1?player2:player1;
        if(scoringPlayer.x < this.x + this.w && scoringPlayer.x + scoringPlayer.w > this.x && 
            scoringPlayer.y < this.y + this.h && scoringPlayer.y + scoringPlayer.h > this.y){
                if(scoringPlayer.points > this.points || !(scoringPlayer.points)){
                    scoringPlayer.points = this.points;
                    this.glow = true;
                }
        }
    }
    
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.text.draw(this.glow);
    }
}

function mainLoop(){
    ctx.clearRect(0,0,800,600);
    
    ctx.font = "30px Ubuntu"
    for(var zone of zones){
        zone.tick();
        zone.draw();
    }
    
    player1.tick();
    
    player2.tick();
    
    ctx.fillStyle = "#444";
    ctx.fillRect(400,0,1,600);
    for(var block of blocks){
        block.draw();
    }
    
    player1.draw();
    player2.draw();
    
    p1points += player1.points/5;
    p1points -= player2.points/5;
    
    if(p1points > 800)
        p1points = 800;
    if(p1points < 0)
        player1Poits = 0;
        
    p2points = 800 - p1points;
    
    ctx.fillStyle = "#F44";
    ctx.fillRect(0, 580, p1points, 20);
    
    ctx.fillStyle = "#33F";
    ctx.fillRect(p1points, 580, p2points, 20);
    
    ctx.fillStyle = "white";
    ctx.fillRect(399, 570, 3, 30);
    
    ticks--;
    
    player1.points = 0;
    player2.points = 0;
    
    ctx.fillStyle = "white";
    if(ticks < 300){
        ctx.font = "80px Ubuntu"
    }
    ctx.fillText(Math.round(ticks/6)/10, ticks<300?400:50, ticks<300?470:550);
    if(ticks === 0){
        clearInterval(mainLoopIntervalCode);
        stopped=true;
    }
    
    if(rectangularCollisionTest(player1, player2)){
        var p1In = player1.x + player1.w > 400;
        var p2In = player2.x < 400;
        if(p1In && p2In){
            player1.velocity.x = -10;
            player2.velocity.x = 10;
            player1.x -=20;
            player2.x +=20;
            ctx.font = "30px Ubuntu"
            ctx.fillText("Don't cross the beams!", 400, 500)
            clearInterval(mainLoopIntervalCode);
            setTimeout(function(){
                mainLoopIntervalCode = setInterval(mainLoop, 16);
            }, 1000);
        }else if(p1In){
            clearInterval(mainLoopIntervalCode);
            ctx.font = "50px Ubuntu"
            ctx.fillText("Player 2 Wins!", 400, 520)
            stopped = true;
        }else if(p2In){
            clearInterval(mainLoopIntervalCode);
            ctx.font = "50px Ubuntu"
            ctx.fillText("Player 1 Wins!", 400, 520);
            stopped = true;
        }
    }
}

class Player{
    constructor(playerNumber){
        
        this.playerNumber = playerNumber;
        
        this.x = this.playerNumber==1?340:440;
        this.y = 380;
        
        this.w = 20;
        this.h = 20;
        
        this.velocity = new Velocity(0, 0);
        
        this.totalPoints = 0;
        this.points = 0;
        
    }
    get color(){
        return this.playerNumber==1?theme.player1Color:theme.player2Color;
    }
    get onGround(){
        return this.y >= this.getMaximumY();
    }
    getMaximumY(){
        var maximums = [];
        if(this.velocity.y > 0)
        for(var block of blocks){
            if(this.x + this.w > block.x && this.x < block.x + block.w//Bottom edge could be inside block
                && this.y < block.y //top edge isn't
            ){
                maximums.push(block.y - this.h);
            }
        }
        var minimumMaximum = 600 - this.h;
        maximums.forEach(function(element){
            if(element < minimumMaximum){
                minimumMaximum = element;
            }
        });
        return minimumMaximum;
    }
    getMinimumY(){
        if(this.velocity.y < 0)
        for(var block of blocks){
            if(this.x + this.w > block.x && this.x < block.x + block.w//Top edge could be inside block
                && this.y + this.h > block.y + block.h //Bottom edge isn't
            ){
                return block.y + block.h;
            }
        }
        return 0;
    }
    touchingWallOnLeft(){
        if(this.x < 0){
            return 0;
        }
        if(this.velocity.x < 0)
        for(var block of blocks){
            if(this.x < block.x + block.w && this.x > block.x && this.y + this.h > block.y && this.y < block.y + block.h //Left edge inside block
                && this.x + this.w > block.x + block.w //Right edge isn't
            ){
                return block.x + block.w;
            }
        }
        return false;
    }
    touchingWallOnRight(){
        if(this.x > 800 - this.w){
            return 800 - this.w;
        }
        if(this.velocity.x > 0)
        for(var block of blocks){
            if(this.x + this.w > block.x && this.x + this.w < block.x + block.w && this.y + this.h > block.y && this.y < block.y + block.h //Right edge inside block
                && this.x < block.x //Left edge isn't
            ){
                return block.x - this.w;
            }
        }
        return false;
    }
    tick(){
        
        if((this.playerNumber==1 && keyboard.a) || (this.playerNumber==2 && keyboard.left)){
            this.velocity.x -= 0.3;
        }
        if((this.playerNumber==1 && keyboard.d) || (this.playerNumber==2 && keyboard.right)){
            this.velocity.x += 0.3;
        }
        if((this.playerNumber==1 && keyboard.w) || (this.playerNumber==2 && keyboard.up)){
            if(this.onGround){
                this.velocity.y -= 15;
            }
        }
        
        this.futureX = this.x + this.velocity.x;
        this.futureY = this.y + this.velocity.y;
        
        this.velocity.reduceAmplitude(0.95)
        
        var minimumMaximum = this.getMaximumY();
        
        if(this.touchingWallOnLeft() !== false){
            this.futureX = this.touchingWallOnLeft() + 1;
            this.velocity.x *= -0.5;
        }
        if(this.touchingWallOnRight() !== false){
            this.futureX = this.touchingWallOnRight() - 1;
            this.velocity.x *= -0.5;
        }
        
        if(this.futureY > minimumMaximum && this.y <= minimumMaximum){
            this.futureY = minimumMaximum;
            this.velocity.y = 0;
        }else if(this.futureY < minimumMaximum){
            this.velocity.y += 0.5;
        }
        
        if(this.futureY < this.getMinimumY()){
            this.futureY = this.getMinimumY();
            this.velocity.y = 1;
        }
        
        this.x = this.futureX
        this.y = this.futureY;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Velocity{
    constructor(amplitude, direction){
        this._amplitude = amplitude;
        this.direction = direction;
    }
    reduceAmplitude(value, minimum){
        this.amplitude *= value;
    }
    get amplitude(){
        return this._amplitude;
    }
    set amplitude(value){
        if(Math.abs(value) < 0.1){
            value = 0;
        }
        this._amplitude = value;
        return value;
    }
    get y(){
        return this.amplitude * Math.sin(this.direction);
    }
    get x(){
        return this.amplitude * Math.cos(this.direction);
    }
    set x(postX){
        if(Math.abs(postX) < 0.05){
            this.amplitude = this.y;
            this.direction = this.y>0?Direction.DOWN:Direction.UP;
            return;
        }
        var preX = this.x;
        var preY = this.y;
        this.amplitude = Math.sqrt(postX*postX + preY*preY);
        this.direction = Math.atan(preY/postX);
        if(postX < 0){
            this.direction += Math.PI;
        }
    }
    set y(postY){
        if(Math.abs(postY) < 0.05){
            this.amplitude = this.x;
            this.direction = this.x>0?Direction.RIGHT:Direction.LEFT;
            return;
        }
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        
        this.amplitude = Math.sqrt(preX*preX + postY*postY);
        this.direction = Math.atan(postY/preX);
        if(preX < 0){
            this.direction += Math.PI;
        }
    }
}

class Direction{
    
}
//Thanks, trig.
Direction.UP    = 3*Math.PI/2;
Direction.DOWN  = Math.PI/2;
Direction.RIGHT = 0;
Direction.LEFT  = Math.PI;

class Block{
    constructor(x, y, w, h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }
    draw(){
        ctx.fillStyle = theme.blockColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);
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
        keyboard.w=true;
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        break;
    case 83:
        keyboard.s=true;
        break;
    case 32:
        if(stopped){
            start();
            mainLoopIntervalCode = setInterval(mainLoop, 16);
            paused=false;
        }else if(paused){
            mainLoopIntervalCode = setInterval(mainLoop, 16);
            paused = false;
        }else{
            clearInterval(mainLoopIntervalCode);
            paused = true;
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
        keyboard.s=false;
        break;
    }
});

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