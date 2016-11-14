module.exports = function(req, res, server){
    switch(req.lastPath){
        
    case "board":
        server.sendString(server.life.serializeAll()+"\n"+server.life.ticks, req, res);
        break;
    case "start":
        server.startLife();
        return "Started"
        break;
    case "tick":
        if(req.post){ 
            for(var i = 0; i < req.post.tick; i++){
                server.life.tick();
            }
        }
        return "Stop";
    case "stop":
        server.stopLife();
        return "Stopped";
    default:
        server.defaultTunnel(req, res, "/life/")
    }
};