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
