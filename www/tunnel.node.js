module.exports = function(req, res, server, whereis){
    
    console.log(req.lastPath);
    
    switch(req.lastPath){
    
    case "fourpence":
        server.redirect("https://www.youtube.com/watch?v=NXHzJvhQkV0", req, res);
        break;
    case "eggs":
        server.redirect("https://www.youtube.com/watch?v=YlMang9B-wI?t=12s", req, res);
        break;
    case "cantina":
        server.redirect("https://www.youtube.com/watch?v=FWO5Ai_a80M", req, res);
	break;
    default:
        server.defaultTunnel(req, res, "/");
        break;
    
    }
    
}
