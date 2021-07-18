class ZoneText{
    constructor(x, y, onlyGlow){
        this.x = x;
        this.y = y;
        this.onlyGlow = onlyGlow;
    }
    draw(glow){
        if(!glow && this.onlyGlow)return;
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
                if(/*scoringPlayer.points > this.points ||*/ !(scoringPlayer.points)){//Commented allows lower point value to take over
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

class Player{
    constructor(playerNumber){
        
        this.playerNumber = playerNumber;
        
		//Load starting position from map based on player number
        this.x = map.startingPositions[this.playerNumber-1][0];
        this.y = map.startingPositions[this.playerNumber-1][1];
        
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
    getMaximumY(){ //Find the effective floor
        var maximums = [];
        if(this.velocity.y > 0)
        for(var block of blocks){
            if(this.x + this.w > block.x && this.x < block.x + block.w//Bottom edge could be inside block
                && this.y < block.y //top edge isn't
                && !(block.passThrough && this.falling) //Not a jump-throughable platform that you're passing through
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
    getMinimumY(){ //Find the effective ceiling of this mobile entity.
        if(this.velocity.y < 0)
        for(var block of blocks){
            if(this.x + this.w > block.x && this.x < block.x + block.w//Top edge could be inside block
                && this.y + this.h > block.y + block.h //Bottom edge isn't
                && !(block.passThrough) //Not hitting ceiling of platform platform
            ){
                return block.y + block.h;
            }
        }
        return 0;
    }
    touchingWallOnLeft(){
        if(this.futureX < 0){
            return 0;
        }
        if(this.velocity.x < 0)
        for(var block of blocks){
            if(block.passThrough)continue;
            if(this.futureX < block.x + block.w && this.futureX > block.x && this.y + this.h > block.y && this.y < block.y + block.h //Left edge inside block
                && this.futureX + this.w > block.x + block.w //Right edge isn't
            ){
                return block.x + block.w;
            }
        }
        return false;
    }
    touchingWallOnRight(){
        if(this.futureX > 800 - this.w){
            return 800 - this.w;
        }
        if(this.velocity.x > 0)
        for(var block of blocks){
            if(block.passThrough)continue;
            if(this.futureX + this.w > block.x && this.futureX + this.w < block.x + block.w && this.y + this.h > block.y && this.y < block.y + block.h //Right edge inside block
                && this.futureX < block.x //Left edge isn't
            ){
                return block.x - this.w;
            }
        }
        return false;
    }
    tick(){
        
        this.movingLeft = (this.playerNumber==1 && keyboard.a) || (this.playerNumber==2 && keyboard.left);
        this.movingRight= (this.playerNumber==1 && keyboard.d) || (this.playerNumber==2 && keyboard.right);
        this.falling    = (this.playerNumber==1 && keyboard.s) || (this.playerNumber==2 && keyboard.down);
        
        if(this.movingLeft){
            this.velocity.x -= 0.3;
        }
        if(this.movingRight){
            this.velocity.x += 0.3;
        }
        if(map.w100SlowZones && (this.x < 100 || this.x > 700 - this.w) && this.velocity.y > 3.6){
            this.velocity.y = 3.6;
        }
        if(this.falling){
            this.velocity.y += 0.8;
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
            if(this.futureX - this.x < -0.02)this.velocity.x *= -0.5;
        }
        if(this.touchingWallOnRight() !== false){
            this.futureX = this.touchingWallOnRight() - 1;
            if(this.futureX - this.x > 0.02)this.velocity.x *= -0.5;
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
class Platform extends Block{
    constructor(x, y, w){
        super(x, y, w, 3);
        this.passThrough = true;
    }
}