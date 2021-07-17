class Vector{
    constructor(amplitude, direction){
        this.amplitude = amplitude;
        this.direction = direction;
    }
    get amplitude(){
        return this._amplitude;
    }
    set amplitude(value){
        if(Math.abs(value) < Vector.amplitudeTolerance){
            value = 0;
        }
        if(value < 0){
            value = 0;
        }
        this._amplitude = value;
        return value;
    }
    get direction(){
        return this._direction;
    }
    set direction(value){
        if(value < 0){
            this.direction = value + Math.PI*2;
            return this.direction;
        }
        return (this._direction = value % (Math.PI * 2));
    }
    get y(){
        return this.amplitude * Math.sin(this.direction);
    }
    get x(){
        return this.amplitude * Math.cos(this.direction);
    }
    set x(postX){
        if(Math.abs(postX) < Vector.amplitudeTolerance){
            this.amplitude = this.y;
            this.direction = this.y>0 ? Math.PI/2 : -Math.PI/2;
            return;
        }
        var preX = this.x;
        var preY = this.y;
        this.amplitude = Math.sqrt(postX*postX + preY*preY);
        this.direction = Math.atan2(preY,postX);
    }
    set y(postY){
        if(Math.abs(postY) < Vector.amplitudeTolerance){
            this.amplitude = this.x;
            this.direction = this.x>0 ? 0 : Math.PI;
            return;
        }
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        
        this.amplitude = Math.sqrt(preX*preX + postY*postY);
        this.direction = Math.atan2(postY,preX);
        if(preX < 0){
            this.direction += Math.PI;
        }
    }
    
    plus(other){
        var result = this.clone();
        result.x += other.x;
        result.y += other.y;
        return result;
    }
    
    minus(other){
        var result = this.clone();
        result.x -= other.x;
        result.y -= other.y;
        return result;
    }
    
    distanceTo(other){
        return this.minus(other).amplitude;
    }
    
    clone(){
        return new Vector(this.amplitude, this.direction);
    }
    
    angleTo(other){
        return other.minus(this).direction;
    }
}
Vector.amplitudeTolerance = 0.1;

Vector.xy = function(x, y){
    var result = new Vector(0, 0);
    result.x += x;
    result.y += y;
    return result;
};

function collideBalls(ball1, ball2){
    //velocity of ball1 relative to ball2
    var res = ball1.vel.distanceTo(ball2.vel);
        
        console.log("Applying collision");
    //If balls are getting closer together...
    if (res.x*(ball2.pos.x - ball1.pos.x) + res.y* (ball2.pos.y - ball1.pos.y) >= 0 ) {
        
        var m1 = ball1.mass;
        var m2 = ball2.mass;
        var theta = -Math.atan2(ball2.pos.y - ball1.pos.y, ball2.pos.x - ball1.pos.x);
        
        var v1 = ball1.Vector.clone();
        v1.direction += theta;
        var v2 = ball2.Vector.clone();
        v2.direction += theta;
        
        ball1.vel = Vector.xy(v1.x * (m1 - m2)/(m1 + m2) + v2.x * 2 * m2/(m1 + m2), v1.y);
        ball1.vel.direction -= theta;
        ball2.vel = Vector.xy(v2.y * (m2 - m1)/(m1 + m2) + v1.x * 2 * m1/(m1 + m2), v2.y);
        ball2.vel.direction -= theta;
        
    }
}