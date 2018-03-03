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

class CircleSprite{
    constructor(x, y, r, color){
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color || "black";
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
}

class PhysicsCircleSprite extends CircleSprite{
    constructor(x, y, r, mass, color, velocity){
        super(x, y, r, color);
        this.mass = mass;
        this.velocity = velocity || new Velocity(0, 0, 0);
    }
    tick(dt){
        this.velocity.tick(dt);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
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
    constructor(gravity, x, y){
        //gravity is in p/s^2, not ms
        this.gravity = gravity;
        this.x = x || 0;
        this.y = y || 0;
    }
    tick(dt){
        if(dt >= 0){
            this.y += this.gravity * dt/1000;
        }else{
            this.y += this.gravity;
        }
    }
    get angle(){
        return Math.atan2(this.y, this.x);
    }
    get amplitude(){
        return Math.sqrt(this.y*this.y + this.x*this.x)
    }
}