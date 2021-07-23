class Ball{
    
    constructor(pos,type,player){

        //"targetBall", "normalBall", or "grenade"
        this.type = type;

        //1, 2 based on owner of ball, or 0 if the target
        this.player = player;
        this.vel = new Vector(0, 0);
        this.pos = pos || Vector.xy(400, 300);

        //Is closer to the target than any of the opponent's balls
        this.winning = false;
        
        //Grenade properties
        this.throwSpeed = 12;
        this.power = 17000;
        this.exploded = false;
        this.frame = 46;

    }

    get image(){
        switch(this.type){
        case "grenade":
            return $("#grenade")[0];
        }
    }

    //Constant deceleration, in pixels per tick squared
    get friction(){
        return 0.03;
    }

    get mass(){
        switch(this.type){
        case "targetBall":
            return 200;
        case "grenade":
            return 40;
        default:
            return 100;
        }
    }

    get r(){
        switch(this.type){
        case "targetBall":
            return 8;
        default:
            return 12;
        }
    }

    get color(){
        switch(this.player){
        case 1:
            return "red";
        case 2:
            return "blue";
        default:
            return "black";
        }
    }
    
    tick(){
        
        if((this.vel.amplitude === 0 && !this.isBeingPushed && this.type != "grenade") || this.exploded){
            stoppedBalls++;
        }

        if(this.exploded)return;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        //Bounce at any of the play area edges
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
		
        //Check with each wall object for collisions
        walls.forEach(function(wall){
            //Position of each corner
			var wallCorners = [
				Vector.xy(wall.pos.x, wall.pos.y),
				Vector.xy(wall.pos.x, wall.pos.y + wall.h),
				Vector.xy(wall.pos.x + wall.w, wall.pos.y),
				Vector.xy(wall.pos.x + wall.w, wall.pos.y + wall.h)
			];
			//right side of ball is inside wall, bounce horizontally
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
        
        //Constant deceleration
        this.vel.amplitude -= this.friction;
        //Drag proportional to velocity
        this.vel.amplitude *= 0.995;

        if(this.type == "grenade"){
            this.angle = this.angle || 0;
            this.angle += this.vel.amplitude*0.03;
            this.grenadeTicks = this.grenadeTicks || 0;
            this.grenadeTicks++;
            if(this.grenadeTicks > 240){
                this.exploded = true;
                grenadeExplodes();
            }
        }
        
        this.isBeingPushed = false;
    }
    
    draw(){
        switch(this.type){
        case "grenade":
            if(this.exploded){
                this.initialTick = this.initialTick || ticks;
                if(ticks - this.initialTick > 30) return;
                ctx.strokeStyle = "rgba(0,0,0,"+(30 - ticks + this.initialTick)/30+")";
                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, 12*(ticks - this.initialTick), 0, Math.PI*2);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.translate(this.pos.x, this.pos.y);
                ctx.rotate(this.angle);
                
                ctx.drawImage($("#grenade")[0],  -12.5, -12.5, 25, 25);
                
                ctx.rotate(-this.angle);
                ctx.translate(-this.pos.x, -this.pos.y);
            }
            break;
        default:
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        //Green circle if ball is currently worth a point
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

        this.frame = 0;
        
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

        this.frame++;
        
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
