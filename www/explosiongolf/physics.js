class Velocity{
    constructor(amplitude, direction){
        this._amplitude = amplitude;
        this._direction = direction;
    }
    reduceAmplitude(value, minimum){
        this.amplitude *= value;
    }
    get amplitude(){
        return this._amplitude;
    }
    set amplitude(value){
        if(Math.abs(value) < Velocity.amplitudeTolerance){
            value = 0;
        }
        this._amplitude = value;
        return value;
    }
    get direction(){
        return this._direction;
    }
    set direction(value){
        return (this._direction = value % (Math.PI * 2));
    }
    get y(){
        return this.amplitude * Math.sin(this.direction);
    }
    get x(){
        return this.amplitude * Math.cos(this.direction);
    }
    set x(postX){
        if(Math.abs(postX) < Velocity.amplitudeTolerance){
            this.amplitude = this.y;
            this.direction = this.y>0 ? Math.PI/2 : -Math.PI/2;
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
        if(Math.abs(postY) < Velocity.amplitudeTolerance){
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
        this.direction = Math.atan(postY/preX);
        if(preX < 0){
            this.direction += Math.PI;
        }
    }
}
Velocity.amplitudeTolerance = 0.1;