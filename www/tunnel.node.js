module.exports = function(req, res, server, whereis){
    
    if(countSlashes(req.lastPath.substring(0, req.lastPath.length - 1)) <= 1){
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
        case "jabba":
            server.redirect("https://community.fantasyflightgames.com/topic/238225-jabbas-spoilers-take-2/", req, res);
            break;
        case "jabba2":
            server.redirect("https://www.fantasyflightgames.com/en/news/2016/9/16/a-step-above-scum/", req, res);
            break;
        case "ia-armies":
            server.getFile("includes/ia-armies.html", req, res);
            break;
        case "epic":
            server.redirect("epic.mp4", req, res);
            break;
        case "bicicleta":
            server.redirect("https://www.youtube.com/watch?v=-UV0QGLmYys", req, res);
            break;
        case "meep":
            server.getFile("meep.html", req, res);
            break;
        case "psa":
            server.redirect("https://www.youtube.com/watch?v=1E237KJhlCE", req, res);
            break;
        default:
            server.defaultTunnel(req, res, "/");
            break;
        
        }
    }
    
}

function countSlashes(input){
	return (input.match(/\/.?/g)||[]).length //.? at end of regex is to stop syntax highlight from reading comment.
}