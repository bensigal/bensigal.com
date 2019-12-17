var player, gameTick;

var drawLayers = {
	background: [],
	objects: 	[],
	entities: 	[],
	players: 	[],
}

var tickLayers = {
	enemies: 	[],
	players: 	[],
}

var walls = [];

function gameScene(dt){
	
	gameTick += dt;
	
	drawLayers.background	.forEach(element => element.draw());
	drawLayers.objects		.forEach(element => element.draw());
	drawLayers.entities		.forEach(element => element.draw());
	drawLayers.players		.forEach(element => element.draw());
	
	tickLayers.players		.forEach(element => element.tick(dt));
	tickLayers.enemies		.forEach(element => element.tick(dt));
	
}

function gameSceneSetup(){
	
	gameTick = 0;
	
	player = new Player();
	drawLayers.players.push(player);
	tickLayers.players.push(player);
	
	enemy = new Creeper(100, 100, 100, 100);
	drawLayers.entities.push(enemy);
	tickLayers.enemies .push(enemy);
	
	//outer walls, in order of top, left, bottom, right
	Wall.add(0, 0, 800, 20);
	Wall.add(0, 0, 20, 600);
	Wall.add(0, 580, 800, 20);
	Wall.add(780, 0, 20, 600);
	
}