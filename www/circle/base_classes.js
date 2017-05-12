class RectangleSprite{
    constructor(x, y, w, h, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color || "black";
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Direction{
    static by2pi(direction){
        if(direction < 0){
            direction+=(Math.floor(direction/2/Math.PI)*Math.PI*-2);
        }else{
            direction = direction%(2*Math.PI);
        }
        return direction;
    }
}
Direction.RIGHT = 0;
Direction.UP = Math.PI * 3 / 2;
Direction.LEFT = Math.PI;
Direction.DOWN = Math.PI / 2;

class Velocity{
    constructor(amplitude, direction, amplitudeTolerance, gravity, friction){
        this.friction = friction || 0;
        this.gravity = gravity || 0;
        this._amplitude = amplitude;
        this._direction = direction;
        if(amplitudeTolerance === false || amplitudeTolerance === 0){
            this.amplitudeTolerance = 0;
        }else if(amplitudeTolerance){
            this.amplitudeTolerance = amplitudeTolerance;
        }else{
            this.amplitudeTolerance = 0.1;
        }
    }
    reduceAmplitude(value, minimum){
        this.amplitude *= value;
    }
    get amplitude(){
        return this._amplitude;
    }
    set amplitude(value){
        if(Math.abs(value) < this.amplitudeTolerance){
            value = 0;
        }
        this._amplitude = value;
        return value;
    }
    get direction(){
        return this._direction;
    }
    set direction(value){
        return (this._direction = value % (Math.PI * 2))
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
    tick(){
        if(this.gravity){
            this.y += this.gravity;
        }
        if(this.friction){
            this.reduceAmplitude(this.friction);
        }
    }
}

//"Abstract" class. Requires methods getMaximumY, getMinimumY, getMaximumX, getMinimumX.
class PhysicsRectangleSprite extends RectangleSprite{
    
    constructor(x, y, w, h, color, velocity){
        super(x, y, w, h, color);
        this.velocity = velocity || new Velocity(0,0);
    }
    get onGround(){
        return this.y >= this.getMaximumY();
    }
    
    get direction(){
        return this._direction;
    }
    set direction(value){
        return (this._direction = value % (Math.PI*2));
    }
    tick(){
        this.velocity.tick();
        
        var futureX = this.x + this.velocity.x;
        var futureY = this.y + this.velocity.y;
        
        //this.velocity.reduceAmplitude(this.velocity.friction);
        
        var minimumMaximum = this.getMaximumY();
        
        if(futureY > this.getMaximumY() && this.y <= this.getMaximumY()){
            futureY = this.getMaximumY();
            this.velocity.y = 0;
        }
        
        if(futureY < this.getMinimumY()){
            futureY = this.getMinimumY();
            this.velocity.y = 1;
        }
        
        if(futureX < this.getMinimumX()){
            futureX = this.getMinimumX();
            this.velocity.x *= -0.5;
        }
        if(this.getMaximumX() < futureX){
            futureX = this.getMaximumX();
            this.velocity.x *= -0.5;
        }
        
        this.x = futureX
        this.y = futureY;
    }
    
}