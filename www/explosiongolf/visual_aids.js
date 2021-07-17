class PowerMeter{
    
    constructor(){
        
        this.angle = 0;
        this.pos = Vector.xy(20, 300);
        this.length = 50;
        this.progress = 0.05;
        this.progressIncreasing = true;
        
    }
    
    tick(){
        
        if(keyboard.down && this.angle < Math.PI/2)
            this.angle += 0.03;
        if(keyboard.up && this.angle > -Math.PI/2)
            this.angle -= 0.03;
        
        this.x = grenade.x + Math.cos(this.angle)*15;
        this.y = grenade.y + Math.sin(this.angle)*15;
        
        if(keyboard.space){
            this.progress += this.progressIncreasing ? 0.025 : -0.025;
            if(this.progress < 0.05){
                this.progress = 0.05;
                this.progressIncreasing = true;
            }
            if(this.progress > 1){
                this.progress = 1;
                this.progressIncreasing = false;
            }
        }
        
    }
    
    draw(){
        var lineOneAngle = this.angle - Math.PI/12;
        var lineTwoAngle = this.angle + Math.PI/12;
        
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        
        ctx.moveTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        ctx.lineTo(this.pos.x + Math.cos(lineOneAngle)*(this.length+3) + Math.sin(lineOneAngle) * 2, 
            this.y + Math.sin(lineOneAngle)*(this.length+3) - Math.cos(lineOneAngle) * 2);
        
        ctx.arc(this.pos.x, this.pos.y, this.length+3, lineOneAngle, lineTwoAngle+0.05);
        
        ctx.moveTo(this.pos.x + Math.cos(lineTwoAngle)*(this.length+3) - Math.sin(lineTwoAngle) * 2, 
            this.pos.y + Math.sin(lineTwoAngle)*(this.length+3) + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x - Math.sin(lineTwoAngle) * 2, this.pos.y + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        
        ctx.stroke();
        ctx.closePath();
        
        ctx.lineWidth = "1px";
        
        for(var i = 2; i <= Math.floor(this.progress*this.length); i++){
            ctx.strokeStyle = "rgb(255, " + Math.floor(255-i*255/this.length) +", 20)";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, i, lineOneAngle, lineTwoAngle);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
}