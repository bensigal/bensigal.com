var player, gameTick;

var drawLayers = {
	background: [],
	objects: 	[],
	entities: 	[],
	players: 	[],
}

var tickLayers = {
	players: 	[],
}

function gameScene(dt){
	
	gameTick += dt;
	
	drawLayers.background	.forEach(element => element.draw());
	drawLayers.objects		.forEach(element => element.draw());
	drawLayers.entities		.forEach(element => element.draw());
	drawLayers.players		.forEach(element => element.draw());
	
	tickLayers.players		.forEach(element => element.tick(dt));
	
}

function gameSceneSetup(){
	
	gameTick = 0;
	
	player = new Player();
	drawLayers.players.push(player);
	tickLayers.players.push(player);
	
}