class Vector{
    constructor(amplitude, angle){
        this.amplitude = amplitude;
        this.angle = angle;
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
    get angle(){
        return this._angle;
    }
    set angle(value){
        while(value < 0){
            value += Math.PI*2;
        }
        while(value >= Math.PI*2){
            value -= Math.PI*2;
        }
        this._angle = value;
        return this._angle;
    }
    get y(){
        return this.amplitude * Math.sin(this.angle);
    }
    get x(){
        return this.amplitude * Math.cos(this.angle);
    }
    set x(postX){
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        if(preY === 0){
            preY = 0;
        }
        
        this.amplitude = Math.sqrt(postX*postX + preY*preY);
        this.angle = Math.atan2(preY,postX);
    }
    set y(postY){
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        if(preY === 0){
            preY = 0;
        }
        
        this.amplitude = Math.sqrt(preX*preX + postY*postY);
        this.angle = Math.atan2(postY,preX);
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
    
    minusLog(other){
        var result = this.clone();
        result.x -= other.x;
        result.y -= other.y;
        console.log([this.x, this.y, other.x, other.y, result.x, result.y]);
        return result;
    }
    
    distanceTo(other){
        return this.minus(other).amplitude;
    }
    
    clone(){
        return new Vector(this.amplitude, this.angle);
    }
    
    angleTo(other){
        return other.minus(this).angle;
    }
}
Vector.amplitudeTolerance = 0.1;

Vector.xy = function(x, y){
    var result = new Vector(0, 0);
    result.x += x;
    result.y += y;
    return result;
};

function checkForCollisions(){
    //Ball to ball collisions
    for(var i = 0; i < balls.length-1; i++){
        for(var j = i+1; j < balls.length; j++){
            //grenades that exploded do not actually exist
            if(balls[i].exploded || balls[j].exploded) continue;
            //Check if circles touch
            if(balls[i].pos.distanceTo(balls[j].pos) <= balls[i].r + balls[j].r){
                collideBalls(balls[i], balls[j]);
                //can't be inside each other
                while(balls[i].pos.distanceTo(balls[j].pos) <= balls[i].r + balls[j].r){
                    balls[i].pos.x += Math.cos(balls[j].pos.angleTo(balls[i].pos));
                    balls[i].pos.y += Math.sin(balls[j].pos.angleTo(balls[i].pos));
                }
            }
        }
    }
}

function collideBalls(ball1, ball2){
    //velocity of ball1 relative to ball2
    var res = ball1.vel.minus(ball2.vel);
    //If balls are getting closer together...
    if (res.x*(ball2.pos.x - ball1.pos.x) + res.y* (ball2.pos.y - ball1.pos.y) >= 0 ) {
        
        console.log("Ball collision");
        
        var m1 = ball1.mass;
        var m2 = ball2.mass;
        var theta = -Math.atan2(ball2.pos.y - ball1.pos.y, ball2.pos.x - ball1.pos.x);
        
        var v1 = ball1.vel.clone();
        v1.angle += theta;
        var v2 = ball2.vel.clone();
        v2.angle += theta;
        
        ball1.vel = Vector.xy(v1.x * (m1 - m2)/(m1 + m2) + v2.x * 2 * m2/(m1 + m2), v1.y);
        ball1.vel.angle -= theta;
        ball2.vel = Vector.xy(v2.y * (m2 - m1)/(m1 + m2) + v1.x * 2 * m1/(m1 + m2), v2.y);
        ball2.vel.angle -= theta;
        
    }
}