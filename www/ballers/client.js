function generateMatch(map){
    matchId = Math.floor(Math.random()*900000 + 100000);
    console.log("playing multiplayer on " + map.id + ", creating match with id " + matchId);
    //drawLink("http://www.bensigal.com/ballers/join/" + map.id + "/" + matchId);
	drawLink("http://localhost:8000/ballers/join/" + map.id + "/" + matchId);
	
	scene = "awaiting join";

	socket.emit("ballers", {
		action: "create match",
		map: map.id,
		id: matchId
	});

    myPlayerNumber = 1;

	socket.on('someone joined',function(data){
		console.log("Someone has joined, starting game")
		scene = "game";
		initGame();	
	})
}

function sendAimData(){
	console.log("Sending aim data");
	socket.emit("ballers", {
		action:"aim data", 
		x:nextBall.pos.x,
		y:nextBall.pos.y,
		vx:nextBall.vel.x,
		vy:nextBall.vel.y,
		id:matchId, 
		isHost:(myPlayerNumber == 1)
	});
}

function waitForAim(){
    step = "awaiting aim";
	nextBall.pos = Vector.xy(-100, -100);
}

function initSocket(){

	socket = io();

	socket.on("log", function(data){
		console.log("server is logging: " +data);
	});

	socket.on("aim data", function(data){
		nextBall.pos = Vector.xy(data.x, data.y);
		nextBall.vel = Vector.xy(data.vx, data.vy);
		step = "throwing";
		console.log("Aim data received");
	});

	if(location.href.includes("join")){

		var urlSegments = location.href.split("/");
		matchId = urlSegments.pop();
		var mapId = urlSegments.pop();

		console.log("Searching for map id: " + mapId);
		map = maps[mapNames[mapId]];
		if(!map){
			window.alert("Failed to find map with id '"+mapId+"'!");
		}

		socket.emit("ballers", {action: "join", id: matchId});

		initGame();

		scene = "game";
		step = "awaiting aim";

		myPlayerNumber = 2;
		multiplayer = true;
	}
}
