//Lib to access files
var fs = require('fs');

//Called whenever a file is accessed
module.exports = function(req, res, server){
    //Switch based off whatever comes after /ballers/, until the next slash
    req.log("In ballers looking for: "+req.path.split("/")[2]);
    switch(req.path.split("/")[2]){
        case "creatematch":
            activeMatches[req.post.id] = new GameInfo();
            req.log(activeMatches);
            return activeMatches[0];
        break;
        case "join":
            id = req.path.split("/")[3];
            if(!id || !activeMatches[id]){
                return "No match with id '"+id+"' found";
            }
            activeMatches[id].gameFull = true;
            server.getFile("/ballers/index.html", req, res);
        break;
        case "isready":
            if (activeMatches[req.post.id] && activeMatches[req.post.id].gameFull){
                req.log("host knows the game is full");
                return "yes";
            }
            return "no";
        break;
    default:
        server.defaultTunnel(req, res, "/ballers/");
        break;
    }
    
};

//Called the first time the folder is opened
module.exports.init = function(serverInfo){
    console.log("Starting ballers tunnel...");
};

//server side variables
activeMatches = {}
class GameInfo{
    
    constructor(map){
        this.gameFull = false;
        this.map = map;
    }

}
