//Maintain default functionality, except for rerouting a couple of shortcuts.
module.exports = function(req, res, server, whereis){
    
	server.defaultTunnel(req, res, "/", {links: {
		meep: "includes/meep.html",
		seconds: "includes/seconds.html",
		games: "includes/games.html",
		tools: "includes/tools.html"
	}});
    
}