class Balance{
    
    constructor(index){
        
        this.index = index;
        this.y = 150;
        this.x = 400;
        this.angle = 0;
        this.weights = [new Weight(0,0, this)];
        
    }
    
    tick(dt){
        this.weights.forEach(function(weight){
            this.angle += dt*weight.relX*weight.relX*(Math.pow(this.angle, 4) + 0.02) / 2000000
            weight.tick(dt);
        }, this);
    }
    
    draw(){
        
        ctx.lineWidth = 5;
        
        ctx.beginPath();
        ctx.moveTo(this.x + 200*Math.cos(this.angle), this.y + 200*Math.sin(this.angle));
        ctx.lineTo(this.x - 200*Math.cos(this.angle), this.y - 200*Math.sin(this.angle));
        ctx.stroke();
        ctx.closePath();
        
        this.weights.forEach(function(weight){
            weight.draw();
        });
        
    }
    
}

class Weight{
    
    constructor(playerIndex, balanceIndex, balance){
        this.playerIndex = playerIndex;
        this.balanceIndex = balanceIndex;
        this.balance = balance
        this.relX = 100;
    }
    
    draw(){
        ctx.fillRect(
            this.balance.x + this.relX*Math.cos(balance.angle) - 20,
            this.balance.y + this.relX*Math.sin(balance.angle),
            40,
            40
        );
    }
    
    tick(dt){
        if(keyboard.left){
            this.relX -= speed*dt;
        }
        if(keyboard.right){
            this.relX += speed*dt;
        }
        if(this.relX < -100)this.relX = -100;
        if(this.relX > 100)this.relX = 100;
    }
    
}