function mapGen(){
	ctx.fillStyle = '#f00';
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(100,50);
	ctx.lineTo(50, 100);
	ctx.lineTo(0, 90);
	ctx.closePath();
	ctx.fill();
}

/*This function generates a random set of points and then builds a polygon using them. 
*The sides and bottom of the polygon are fixed based on screenSize (eventually).
*The purpose of the function is to generate the edges of the river in the game.
*/
function generateTopCoast(){
	pointCount = Math.floor(Math.random()*5) + 5;
	i=0;
	var result = [];
	while(i <= pointCount) {
		x = Math.floor(Math.random()*40);
		y = Math.floor(Math.random()*100);
		if (result.length < 1){
			result.push(Vector.xy(0, y + 50));
		}else{
			result.push(Vector.xy(x + result[i - 1].x + 100,y + 50));
		}
		i++
	}
	result.push(Vector.xy(800,result.slice(-1)[0].y))
	
	return result;
}

function drawTopCoast(points){
	//draws the generated polygon
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(0, 0);
	for (i = 0; i < points.length; i++) {
		ctx.lineTo(points[i].x,points[i].y)
	}
	ctx.lineTo(800,points.slice(-1)[0].y)
	ctx.lineTo(800,0)
	ctx.lineTo(0,0)
	ctx.fill(); 

	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 5;
	ctx.beginPath()
	ctx.moveTo(points[0].x,points[0].y)
	for (i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x,points[i].y)
	} 
	ctx.lineTo(800,points.slice(-1)[0].y)
	ctx.stroke();
}

function generateBottomCoast(){
	var result = [];

	pointCount = Math.floor(Math.random()*5) + 5;
	i= 0;
	while(i <= pointCount) {
		x = Math.floor(Math.random()*40);
		y = Math.floor(550 - Math.random()*100);
		if (result.length < 1){
			result.push(Vector.xy(0,y));
		}else{
			result.push(Vector.xy(x+result[i-1].x+100,y));
		}
		i++
	}
	result.push(Vector.xy(800,result.slice(-1)[0].y))

	return result;
}

function drawBottomCoast(points){
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(0, 0);
	for (i = 0; i < points.length; i++) {
		ctx.lineTo(points[i].x,600-points[i].y)
	}
	ctx.lineTo(800,600 -points.slice(-1)[0].y)
	ctx.lineTo(800,600)
	ctx.lineTo(0,600)
	ctx.fill(); 

	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 5;
	ctx.beginPath()
	ctx.moveTo(points[0].x,600- points[0].y)
	for (i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x,600 -points[i].y)
	} 
	ctx.lineTo(800,600 -points.slice(-1)[0].y)
	ctx.stroke();
}

class Map{

	constructor(topCoast, bottomCoast){
		this.topCoast = topCoast;
		this.bottomCoast = bottomCoast;
	}
	
	drawBottomCoast(){
		//draws the generated polygon
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(0, 0);
		for (i = 0; i < this.bottomCoast.length; i++) {
			ctx.lineTo(this.bottomCoast[i].x, this.bottomCoast[i].y)
		}
		ctx.lineTo(800,600)
		ctx.lineTo(0,600)
		ctx.fill(); 
	
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 2;
		ctx.beginPath()
		ctx.moveTo(this.bottomCoast[0].x, this.bottomCoast[0].y)
		for (i = 1; i < this.bottomCoast.length; i++) {
			ctx.lineTo(this.bottomCoast[i].x, this.bottomCoast[i].y)
		} 
		ctx.stroke();
	}

	drawTopCoast(){
		//draws the generated polygon
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(0, 0);
		for (i = 0; i < this.topCoast.length; i++) {
			ctx.lineTo(this.topCoast[i].x,this.topCoast[i].y)
		}
		ctx.lineTo(800,0)
		ctx.lineTo(0,0)
		ctx.fill(); 
	
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 2;
		ctx.beginPath()
		ctx.moveTo(this.topCoast[0].x,this.topCoast[0].y)
		for (i = 1; i < this.topCoast.length; i++) {
			ctx.lineTo(this.topCoast[i].x,this.topCoast[i].y)
		} 
		ctx.stroke();
	}
	
	generateMines(){
		this.mines = [];
		while(this.mines.length < 20){
			var x = 70+Math.random()*(730-mineRadius);

			//Find the last map corner before the proposed point
			var topPointIndex = 0;
			while(this.topCoast[topPointIndex + 1].x < x){
				topPointIndex++;
			}
			var bottomPointIndex = 0;
			while(this.bottomCoast[bottomPointIndex + 1].x < x){
				bottomPointIndex++;
			}
			var bottomPoint1 = this.bottomCoast[bottomPointIndex];
			var bottomPoint2 = this.bottomCoast[bottomPointIndex + 1];
			var topPoint1 = this.topCoast[topPointIndex];
			var topPoint2 = this.topCoast[topPointIndex + 1];

			//unit vector from left of wall to right
			var parallelTopUnit = topPoint2.minus(topPoint1);
			//10 pixels below the line between the two nearest points
			var minimumY = (x - topPoint1.x) * Math.tan(parallelTopUnit.angle) + topPoint1.y + mineRadius;
			//unit vector from left of wall to right
			var parallelBottomUnit = bottomPoint2.minus(bottomPoint1);
			//10 pixels below the line between the two nearest points
			var maximumY = (x - bottomPoint1.x) * Math.tan(parallelBottomUnit.angle) + bottomPoint1.y - mineRadius;

			y = Math.random()*(maximumY - minimumY) + minimumY;

			var mine = new Mine(Vector.xy(x, y));

			if(collidesWithMinesOrCoast(mine, 50)) continue;
			
			this.mines.push(mine);

		}
	}

	stringify(){

	}

}
