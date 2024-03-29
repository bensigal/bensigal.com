class Ball{
    
    constructor(pos,ballType,player){
        this.vel = new Vector(0, 0);
        this.pos = pos || Vector.xy(400, 300);
        this.r = 12;
        this.friction = 0.03;
        this.collides = true;
        this.mass = 100;
        this.ballType = ballType;
        this.player = player;
        this.throwSpeed = 12;
        this.exploded = false;
        this.winning = false;

        //Player 1 has green balls, player two has blue ball (lol XD)
        if(player == 1){
            this.color = "red";
        }else{
            this.color = "blue";
        }

        // This is for setting the properties of a ball based on the ballType. Defualt is a effectless ball that is not the target.
        switch(ballType){
            case "targetBall":
                this.r = 8;
                this.mass = 200;
                this.color = "black";
            break;
            case "grenade":
                this.power = 10000;
                this.mass = 10;
                break;
            default:
                this.r = 12;
                this.mass = 100;
        }
        
    }
    
    tick(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        if(this.pos.y > canvas.height - this.r) {
			this.vel.y *= -1; 
			this.pos.y = canvas.height-this.r;
		}
        if(this.pos.y < fieldTop + this.r){    
			this.vel.y *= -1; 
			this.pos.y = fieldTop + this.r;
		}
        if(this.pos.x > canvas.width  - this.r) {
			this.vel.x *= -1; 
			this.pos.x = canvas.width-this.r;
		}
        if(this.pos.x < this.r){               
			this.vel.x *= -1; 
			this.pos.x = this.r;
		}
		
        walls.forEach(function(wall){
			//right side of ball is inside wall, bounce horizontally
			var wallCorners = [
				Vector.xy(wall.pos.x, wall.pos.y),
				Vector.xy(wall.pos.x, wall.pos.y + wall.h),
				Vector.xy(wall.pos.x + wall.w, wall.pos.y),
				Vector.xy(wall.pos.x + wall.w, wall.pos.y + wall.h)
			];
            if((this.pos.x + this.r > wall.pos.x && this.pos.x < wall.pos.x + wall.w) && 
			(this.pos.y > wall.pos.y && this.pos.y < wall.pos.y + wall.h)){
				console.log("Wall side collision");
				this.vel.x *= -1;
				this.pos.x = wall.pos.x - this.r
			}
			//left side of ball is inside wall, bounce horizontally
            else if((this.pos.x > wall.pos.x && this.pos.x - this.r < wall.pos.x + wall.w) && 
			(this.pos.y > wall.pos.y && this.pos.y < wall.pos.y + wall.h)){
				console.log("Wall side collision");
				this.vel.x *= -1;
				this.pos.x = wall.pos.x + wall.w + this.r;
			}
			//top side of ball is inside wall, bounce vertically
            else if((this.pos.x > wall.pos.x && this.pos.x < wall.pos.x + wall.w) && 
			(this.pos.y > wall.pos.y && this.pos.y - this.r < wall.pos.y + wall.h)){
				console.log("Wall side collision");
				this.vel.y *= -1;
				this.pos.y = wall.pos.y + wall.h + this.r;
			}
			//bottom side of ball is inside wall, bounce vertically
            else if((this.pos.x > wall.pos.x && this.pos.x < wall.pos.x + wall.w) && 
			(this.pos.y + this.r > wall.pos.y && this.pos.y < wall.pos.y + wall.h)){
				console.log("Wall side collision");
				this.vel.y *= -1;
				this.pos.y = wall.pos.y - this.r;
			}
			//Check each corner
			else{
				wallCorners.forEach(function(corner){
					if(corner.distanceTo(this.pos) > this.r) return;
					console.log("Corner collision");
					var reflectionAngle = this.pos.angleTo(corner) + Math.PI/2;
					var newAngle = 2*reflectionAngle - this.vel.angle;
					this.vel.angle = newAngle;
					this.pos = this.pos.plus(
						new Vector(this.pos.distanceTo(corner), corner.angleTo(this.pos)));
				}, this);
			}
        }, this);
        
        this.vel.amplitude -= this.friction;
        this.vel.amplitude *= 0.995;
        
        if(this.vel.amplitude === 0 && !this.isBeingPushed && (this.ballType != "grenade" || this.exploded)){
            stoppedBalls++;
        }

        if(this.ballType == "grenade"){
            grenadeTicks++;
            if(grenadeTicks > 240){
                grenadeExplodes();
            }
        }
        
        this.isBeingPushed = false;
    }
    
    draw(){
        switch(this.ballType){
        case "grenade":
            if(this.exploded) return;
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.angle);
            
            ctx.drawImage(this.image,  -this.imageWidth/2, -this.imageWidth/2, this.imageWidth, this.imageWidth);
            
            ctx.rotate(-this.angle);
            ctx.translate(-this.pos.x, -this.pos.y);
            break;
        default:
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        if(this.winning){
            ctx.strokeStyle = "#0D0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
}

class Wall{
    
    constructor(x, y, w, h){
        this.pos = Vector.xy(x, y);
        this.w = w;
        this.h = h;
    }
    
    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    }
    
}

class Hill{
    
    constructor(x, y, w, h, dv){
        
        //Change in vel every tick
        this.dv = dv;
        
        this.pos = Vector.xy(x, y);
        this.w = w;
        this.h = h;
        
    }
    
    draw(){
        
        ctx.fillStyle = "#DDD";
        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        
        for(var x = 50; x <= this.w - 50; x+= 50){
            for(var y = 50; y <= this.h - 50; y += 50){
                ctx.strokeStyle = "#A6A";
                ctx.beginPath();
                ctx.moveTo(this.pos.x + x - 10*Math.cos(this.dv.angle), this.pos.y + y - 10*Math.sin(this.dv.angle));
                var arrowhead = {
                    x: this.pos.x + x + 10*Math.cos(this.dv.angle),
                    y: this.pos.y + y + 10*Math.sin(this.dv.angle)
                };
                ctx.lineTo(arrowhead.x, arrowhead.y);
                ctx.lineTo(arrowhead.x + 4*Math.cos(this.dv.angle+Math.PI-0.5), arrowhead.y + 4*Math.sin(this.dv.angle+Math.PI-0.5));
                ctx.moveTo(arrowhead.x, arrowhead.y);
                ctx.lineTo(arrowhead.x + 4*Math.cos(this.dv.angle+Math.PI+0.5), arrowhead.y + 4*Math.sin(this.dv.angle+Math.PI+0.5));
                ctx.closePath();
                ctx.stroke();
            }
        }
        
    }
    
    tick(items){
        
        //items contains everything that might be affected by the hill
        items.forEach(function(item){
            if(item.pos.x > this.pos.x && item.pos.x < this.pos.x + this.w){
                if(item.pos.y > this.pos.y && item.pos.y < this.pos.y + this.h){
                    item.vel.x += this.dv.x;
                    item.vel.y += this.dv.y;
                    if(item instanceof Ball){
                        item.isBeingPushed = true;
                    }
                }
            }
        }, this);
        
    }
    
}