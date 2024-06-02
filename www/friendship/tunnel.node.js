//Lib to access files
const { time } = require('console');
var fs = require('fs');

//Called whenever a file is accessed
module.exports = function(req, res, server){
    //Switch based off whatever comes after /friendship/, until the next slash
    req.log("In friendship looking for: "+req.path.split("/")[2]);
    switch(req.path.split("/")[2]){
    case "join":
        server.getFile("/friendship/index.html", req, res);
        break;
    default:
        server.defaultTunnel(req, res, "/friendship/");
        break;
    }
    
};

module.exports.messageReceived = function(socket, data){
    switch(data.action){
    case "create match":
        activeMatches[data.id] = new GameInfo(data.map, socket);
        socket.emit("log","match created");
        console.log("friendship"+data.id+": Created match");
        break;
    case "join":
        console.log("friendship"+data.id+": Join attempt");
        if(!activeMatches[data.id]){
            socket.emit("fatal error", "This link is invalid! Please ask the host for another.");
        }
        else if(activeMatches[data.id].gameFull){
            socket.emit("fatal error", "This link has already been used by someone else!");
        }
        else{
            console.log("friendship"+data.id+": Join successful");
            activeMatches[data.id].gameFull = true;
            activeMatches[data.id].joiner = socket;
            activeMatches[data.id].host.emit("someone joined");
        }
    break;
    case "aim data":
        console.log("friendship"+data.id+": Aim data received from " + (data.isHost ? "host" : "joiner"));
        dataToBeSent = {x: data.x, y: data.y, vx: data.vx, vy: data.vy};
        if(data.isHost){
            activeMatches[data.id].joiner.emit("aim data", dataToBeSent);
        }else{
            activeMatches[data.id].host.emit("aim data", dataToBeSent);
        }
        break;
    default:
        console.log("friendship:invalid socket event:"+data.action);
    break;
    }
};

//Called the first time the folder is opened
module.exports.init = function(serverInfo){
    console.log("Starting friendship tunnel...");
};

//server side variables
activeMatches = {};
class GameInfo{
    
    constructor(map, host){
        this.gameFull = false;
        this.map = map;
        this.host = host;
        this.joiner = null;
    }

}
