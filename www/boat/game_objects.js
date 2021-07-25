
class Mine{
    
    constructor(pos){

        this.pos = pos;
        this.r = mineRadius;

    }
    
    tick(){
        
    }
    
    draw(){

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        
    }
    
}

class Boat{

    constructor(pos){
        this.pos = pos || Vector.xy(25,300);
        this.vel = new Vector(0,0);
        this.speed = 1;
        this.maxSpeed = 5
        this.acceleration = 0.05;
        this.r = 12;
        
    }

    tick(){
        this.pos.x += this.vel.x + (drift.x/3);
        this.pos.y += this.vel.y + (drift.y/3);

        if (this.pos.x <= 0){
            scene = "loss";
        }

        if(collidesWithMinesOrCoast(this)){
            scene = "loss";
        }

        if (this.pos.x >= 800){
            console.log("winer")
            scene = "win";
        }

    }

    draw(){
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

}
