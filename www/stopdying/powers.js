class Power{
	constructor(icon, cooldownLength, activate, draw, tick){
		
		this.activateable = false
		this.cooldown = 0;
		
		this.cooldownLength = cooldownLength;
		this.icon = icon;
		
		this.activate 	= activate  || function(){};
		this.drawPower	= drawPower	|| function(){};
		this.tickPower 	= tick		|| function(){};
		
		this.key = null;
	}
	
	tick(dt){
		this.cooldown -= dt;
		if(this.cooldown < 0){
			this.cooldown = 0;
		}
		this.tickPower(dt);
	}
	
	draw(){
		this.drawPower();
		if(typeof icon == "string" && this.key){
			switch(this.key){
			
			}
		}
	}
	
}
var powers = {
	a:new Power
};
