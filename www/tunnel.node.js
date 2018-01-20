module.exports = function(req, res, server, whereis){
    
    if(countSlashes(req.lastPath.substring(0, req.lastPath.length - 1)) <= 1){
        switch(req.lastPath){
        
        case "eggs":
            server.redirect("https://www.youtube.com/watch?v=YlMang9B-wI?t=12s", req, res);
            break;
        case "cantina":
            server.redirect("https://www.youtube.com/watch?v=FWO5Ai_a80M", req, res);
            break;
        case "raptor":
            server.redirect("https://pre14.deviantart.net/3381/th/pre/f/2012/183/0/6/ronald_reagan_riding_a_velociraptor_by_sharpwriter-d55rsh7.jpg", req, res);
            break;
        case "meep":
            server.getFile("includes/meep.html", req, res);
            break;
        case "seconds":
            server.getFile("includes/seconds.html", req, res);
            break;
        case "elo":
            server.redirect("https://wismuth.com/elo/calculator.html", req, res);
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
