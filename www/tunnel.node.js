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
        case "bicicleta":
            server.redirect("https://www.youtube.com/watch?v=-UV0QGLmYys", req, res);
            break;
        case "meep":
            server.getFile("includes/meep.html", req, res);
            break;
        case "henri":
            server.getFile("includes/henri.html", req, res);
            break;
        case "luca":
            server.getFile("includes/luca.html", req, res);
            break;
        case "weimar":
            server.redirect("https://www.youtube.com/watch?v=V2dZBa69Hv0", req, res);
            break;
        case "dday":
        case "d-day":
        case "d_day":
        case "d day":
        case "d%20day":
            server.redirect("https://sites.google.com/piedmont.k12.ca.us/d-day", req, res);
            break;
        case "robots":
            server.redirect("https://www.fantasyflightgames.com/en/news/2017/3/21/programmed-for-destruction/", req, res);
            break;
        case "sidon":
            server.redirect("https://www.youtube.com/watch?v=66coX4HCZmo", req, res);
            break;
        case "stolensettler":
            return "rip nick 1000bc"
        default:
            server.defaultTunnel(req, res, "/");
            break;
        
        }
    }
    
}

function countSlashes(input){
	return (input.match(/\/.?/g)||[]).length //.? at end of regex is to stop syntax highlight from reading comment.
}
