class Player{
	
	constructor(){
		
		this.width 	= 30;
		this.height = 30;
		this.x 		= 400;
		this.y 		= 300;
		
		this.speed	= 1/8;
		
		this.color 	= "blue";
		
	}
	
	draw(){
		//draw a rectangle centered at x, y and of width, height.
		ctx.fillStyle = this.color;
		ctx.fillRect(
			this.x - this.width/2,
			this.y - this.height/2,
			this.width,
			this.height
		);
	}
	
	tick(dt){
		
		//In per milliseconds
		var yVel = 0;
		var xVel = 0;
		
		//Store whether or not to slow down horizontal movement
		var verticalMovement = true;
		
		if(keyboard.down && !keyboard.up){
			yVel = this.speed;
		}else if(keyboard.up && !keyboard.down){
			yVel = -this.speed;
		}else{
			verticalMovement = false;
		}
		
		if(keyboard.left && !keyboard.right){
			yVel /= Math.sqrt(2);
			xVel  = verticalMovement ? 
				-this.speed/Math.sqrt(2) : -this.speed;
		}
		else if(keyboard.right && !keyboard.left){
			yVel /= Math.sqrt(2);
			xVel  = verticalMovement ? 
				this.speed/Math.sqrt(2) : this.speed;
		}
		
		this.x += xVel * dt;
		this.y += yVel * dt;
		
	}
}