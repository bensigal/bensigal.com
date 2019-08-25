module.exports = function(req, res, server, whereis){
    
    if(countSlashes(req.lastPath.substring(0, req.lastPath.length - 1)) <= 1){
        switch(req.lastPath){
        
        case "righteous":
            server.getFile("righteous.html", req, res);
            break;
        case "cantina":
            server.redirect("https://www.youtube.com/watch?v=FWO5Ai_a80M", req, res);
            break;
        case "meep":
            server.getFile("includes/meep.html", req, res);
            break;
        case "seconds":
            server.getFile("includes/seconds.html", req, res);
            break;
		case "games":
			server.getFile("includes/games.html", req, res);
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
