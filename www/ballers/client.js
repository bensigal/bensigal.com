function generateMatch(map){
    matchId = Math.floor(Math.random()*900000 + 100000);
    console.log("playing multiplayer on " + map.id + ", creating match with id " + matchId);
    drawLink("http://www.bensigal.com/ballers/join/" + map.id + "/" + matchId);
	
	scene = "awaiting join";

    $.post("/ballers/creatematch", {"id":matchId, "map":map.id}, function(data){
        if(data == "yes"){
			console.log("Match created!");
		}else{
			window.alert("Match creation failed!");
			scene = "menu";
			depth = 0;
			optionSelected = 0;
		}
    });

    myPlayerNumber = 1;

    var pingInterval = setInterval(function(){
        $.post("isready", {"id": matchId}, function(data){
            if(data == "yes"){
                console.log("Someone has joined, starting game")
                scene = "game";
                initGame();	
                clearInterval(pingInterval);
            }else{
                console.log("No one has joined yet");
            }
        });
    }, 1000);
}

function checkIfJoined(){
	if(location.href.includes("join")){
		matchId = location.href.split("/").pop();
		myPlayerNumber = 2;
		initGame();
		scene = "game";
		step = "awaiting aim";
	}
}

function sendAimData(){
	
}

function waitForAim(){
    step = "awaiting aim";
}
