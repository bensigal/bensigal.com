var pingInterval;
var matchId;
var myPlayerNumber;

function generateMatch(map){
    console.log("playing multiplayer on " + map.id);
    matchId = Math.floor(Math.random()*900000 + 100000);
    console.log(matchId);
    drawLink("http://www.bensigal.com/ballers/join/" + matchId);

    $.post("/ballers/creatematch", {"id":matchId, "map":map.id}, function(data){
        console.log("match created!");
    });

    scene = "awaiting join";
    myPlayerNumber = 1;

    pingInterval = setInterval(function(){
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

function sendAimData(){

}

function waitForAim(){
    step = "awaiting aim";
}
