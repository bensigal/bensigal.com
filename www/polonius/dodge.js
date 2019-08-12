var dodger = {
	startingX: 200,
	x: 200,
	y: 250,
	speed: 300,
	draw: function(){
		ctx.drawImage($("#poloniusImage")[0], this.x, this.y);
	},
	tick: function(dt){
		//If left and right buttons pressed move that way based on speed (px/s)
		if(keyboard.left){
			this.x -= this.speed * dt/1000;
		}
		if(keyboard.right){
			this.x += this.speed * dt/1000;
		}
		if(keyboard.up){
			this.y -= this.speed * dt/1000;
		}
		if(keyboard.down){
			this.y += this.speed * dt/1000;
		}
		if(this.x<0)this.x = 0;
		if(this.x>800-dodgeWidths)this.x = 800-dodgeWidths;
		if(this.y<0)this.y = 0;
		if(this.y>450)this.y=450;
		this.draw();
	}
}
var dodgeWidths = 20;
var dodgeHeights = 50;
var millisecondInterval = 2000;
var startTimestamp;
var attackers = [];
var nextAttacker;
var increaseSpeedInterval;
var millisecondsLeft;
var attackerSpeed = 400;
var dodgeLettersLeft;
var nextDodgeLetter;
var currentDodgeText;
var dodgeLetterInterval;

class Attacker{
	constructor(){
		this.x = 800;
		this.y = Math.floor(Math.random()*9)*50;
	}
	tick(dt){
		this.x -= attackerSpeed * dt/1000;
		//If x is too close to dodger
		if(Math.abs(this.x - dodger.x ) < dodgeWidths){
			//If y is too close to dodger
			if(Math.abs(this.y - dodger.y) < dodgeHeights){
				killPlayer();
			}
		}
		ctx.drawImage($("#swordImage")[0], this.x - 10, this.y - 10);
	}
}

function killPlayer(){
	setTimeout(function(){prepareNarration(2)}, 1000);
	dodgeDead = true;
}

function prepareDodge(){
	scene = "dodge";
	dodgeDead = false;
	sceneReady = false;
	dodger.x = dodger.startingX;
	attackers = [];
	
	startTimestamp = new Date().getTime();
	millisecondsLeft = 20000
	
	nextAttacker = startTimestamp - 1000;
	millisecondInterval = 1000;
	attackerSpeed = 300;
	
	currentDodgeText = "";
	dodgeLettersLeft = "Wait, Hamlet, please don't kill the great Polonius!".split("").reverse();
	dodgeLetterInterval = 20000/dodgeLettersLeft.length;
	nextDodgeLetter = new Date().getTime();// + dodgeLetterInterval;
	
	if(increaseSpeedInterval)clearInterval(increaseSpeedInterval);
	increaseSpeedInterval = setInterval(function(){
		attackerSpeed *= 1.05;
	}, 1000);
}

function renderDodge(dt){
	
	ctx.drawImage($("#curtainsImage")[0], 0, 0);
	
	millisecondsLeft -= dt;
	
	if(dodgeDead){dt = 0}
	if(millisecondsLeft <= 0){
		dt=0;
	}
	if(millisecondsLeft < -1000){
		prepareNarration(3);
	}
	
	ctx.fillStyle = "black";
	ctx.font = "30px Georgia"
	ctx.textAlign = "left";
	if(dt)ctx.fillText(Math.max(Math.round(millisecondsLeft/100)/10, 0), 30, 590);
	ctx.fillText(currentDodgeText, 30, 570);
	
	ctx.fillRect(0,500,800,2);
	
	dodger.tick(dt);
	attackers.forEach(function(element){
		element.tick(dt);
	});
	
	while(nextAttacker < new Date().getTime()){
		attackers.push(new Attacker());
		millisecondInterval *= 0.96;
		if(millisecondInterval < 20)millisecondInterval=20;
		nextAttacker += millisecondInterval;
	}
	while(nextDodgeLetter < new Date().getTime() && dt){
		currentDodgeText += dodgeLettersLeft.pop();
		nextDodgeLetter += dodgeLetterInterval;
	}
}