var friction = 0.99;

class Rectangle{
	constructor(x, y, w, h, cornerDefined){
		
		this.w 			= w;
		this.h 			= h;
		
		if(cornerDefined){
			
			this.setX(x + w/2);
			this.setY(y + h/2);
			
		}else{
			
			this.setX(x);
			this.setY(y);
			
		}
		
	}
	
	checkCollisionWith(other, reverseCheck){
		
		//If the left side or the right side of this is in its x range...
		if((this.leftX > other.leftX && this.leftX < other.rightX) || 
		(this.rightX < other.rightX && this.rightX > other.leftX)){
			//If the top or bottom is in its y range...
			if((this.topY > other.topY && this.topY < other.bottomY) ||
			(this.bottomY > other.topY && this.bottomY < other.bottomY)){
				
				return true;
				
			}
			
		}
		//If haven't checked the other way around, do so.
		return !reverseCheck ? other.checkCollisionWith(this, true) : false;
	}
	
	checkIfSideCollidesWith(side, other){
		switch(side){
		case "bottom":
			return this.bottomY	> other.topY 	&& this.bottomY	< other.bottomY;
		case "top":
			return this.topY   	> other.topY 	&& this.topY	< other.bottomY;
		case "left":
			return this.leftX 	> other.leftX 	&& this.leftX	< other.rightX;
		case "right":
			return this.rightX 	> other.leftX	&& this.rightX	< other.rightX;
		}
	}
	
	setX(x){
		this.x = x;
		this.leftX = this.x - this.w/2;
		this.rightX= this.x + this.w/2;
	}
	
	setY(y){
		this.y = y;
		this.topY = this.y - this.h/2;
		this.bottomY = this.y + this.h/2;
	}
	
	fillRect(){
		ctx.fillRect(this.leftX, this.topY, this.w, this.h);
	}
	
}

class Creature extends Rectangle{
	
	constructor(x, y, w, h){
		
		super(x, y, w, h);
		
		this.xVel 	= 0;
		this.yVel 	= 0;
		
	}
	
	tick(dt){
		
		if(dt < 0) return;
		
		this.xVel *= Math.pow(friction, dt);
		this.yVel *= Math.pow(friction, dt);
		
		//Stop from going too fast
		if(this.xVel > 0.3){
			this.xVel = 0.3;
		}else if(this.xVel < -0.3){
			this.xVel = -0.3;
		}
		if(this.yVel > 0.3){
			this.yVel = 0.3;
		}else if(this.yVel < -0.3){
			this.yVel = -0.3;
		}
		
		this.setX(this.x + this.xVel * dt);
		this.setY(this.y + this.yVel * dt);
		
		var collidedWalls = [];
		walls.forEach(function(wall){
			if(wall.checkCollisionWith(this)){
				collidedWalls.push(wall);
			}
		}, this);
		
		collidedWalls.forEach(function(collidedWall){
			
			var b = this.checkIfSideCollidesWith("bottom"	, collidedWall);
			var t = this.checkIfSideCollidesWith("top"		, collidedWall);
			var r = this.checkIfSideCollidesWith("right"	, collidedWall);
			var l = this.checkIfSideCollidesWith("left"		, collidedWall);
			
			if((b && !t && this.yVel > 0) || (t && !b && this.yVel < 0)){
				this.setY(this.y - this.yVel * dt);
				this.yVel = 0;
			}
			if((r && !l && this.xVel > 0) || (l && !r && this.xVel < 0)){
				this.setX(this.x - this.xVel * dt);
				this.xVel = 0;
			}
		}, this);
		
	}
	
}

class Player extends Creature{
	
	constructor(){
		
		super(400, 300, 30, 30);
		
		this.speed	= 1/20;
		
		this.color 	= "blue";
		
	}
	
	draw(){
		//draw a rectangle centered at x, y and of width, height.
		ctx.fillStyle = this.color;
		this.fillRect();
	}
	
	tick(dt){
		
		var yAccel = 0;
		var xAccel = 0;
		
		//Store whether or not to slow down horizontal movement
		var verticalMovement = true;
		
		if(keyboard.down && !keyboard.up){
			yAccel = this.speed;
		}else if(keyboard.up && !keyboard.down){
			yAccel = -this.speed;
		}else{
			verticalMovement = false;
		}
		
		if(keyboard.left && !keyboard.right){
			yAccel /= Math.sqrt(2);
			xAccel  = verticalMovement ? 
				-this.speed/Math.sqrt(2) : -this.speed;
		}
		else if(keyboard.right && !keyboard.left){
			yAccel /= Math.sqrt(2);
			xAccel  = verticalMovement ? 
				this.speed/Math.sqrt(2) : this.speed;
		}
		
		this.xVel += xAccel;
		this.yVel += yAccel;
		
		super.tick(dt);
		
	}
}

class Wall extends Rectangle{
	constructor(x, y, w, h){
		super(x, y, w, h, true);
	}
	draw(){
		ctx.fillStyle = "black";
		this.fillRect();
	}
}
Wall.add = function(x, y, w, h){
	var wall = new Wall(x, y, w, h);
	walls.push(wall);
	drawLayers.background.push(wall);
}
	