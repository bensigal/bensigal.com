module.exports = function(req, res, server, whereis){
    
	server.defaultTunnel(req, res, "/", {links: {
		meep: "includes/meep.html",
		seconds: "includes/seconds.html",
		games: "includes/games.html",
		tools: "includes/tools.html"
	}});
    
}

function countSlashes(input){
	return (input.match(/\/.?/g)||[]).length //.? at end of regex is to stop syntax highlight from reading comment.
}
