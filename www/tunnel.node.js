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
    case "jedisteps":
        server.redirect("https://www.dropbox.com/s/l2zzuyr1e964ilh/The%20Jedi%20Steps%20-%20sheet%20music.pdf?dl=0", req, res);
        break;
    case "ia-armies":
        server.getFile("includes/ia-armies.html", req, res);
        break;
    case "meep":
        server.getFile("meep.html", req, res);
        break;
    default:
        server.defaultTunnel(req, res, "/");
        break;
    
    }
    
}
