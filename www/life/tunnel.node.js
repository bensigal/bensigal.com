module.exports = function(req, res, server){
    switch(req.lastPath){
        
    case "board":
        server.sendString(server.life.serializeAll()+"\n"+server.life.ticks, req, res);
        break;
    case "boardjson":
        server.sendString(JSON.stringify(server.life.board), req, res);
        break;
    case "start":
        server.startLife();
        return "Started";
    case "tick":
        if(req.post){ 
            for(var i = 0; i < req.post.tick; i++){
                server.life.tick();
            }
        }
        return "Stop";
    case "stop":
        console.log('trollstop')
        server.stopLife();
        return "Stopped";
    default:
        server.defaultTunnel(req, res, "/life/");
        break;
    }
};