var coup = require("./coup");

var activePlayers       = [];
var playerGameIndexes   = [];

var games               = [];
var nextGameIndex       = 0;

module.exports = function(req, res, server){
	
	if(!req.session.on){
		return server.redirect("/login?coup",req,res);
	}
	var player = activePlayers.indexOf(req.session.name);
	
	//Main Page
	if(/coup\/?$/.test(req.path)){

		server.getFile("coup/index.html",req,res);

	}else if(/debugStates\/?$/.test(req.path)){
	    
	    server.getFile("coup/debugStates.html",req,res);
	    
	}
	
	else if(/newGame\/?$/.test(req.path)){

        if(!req.post.cards || !req.post.players)
            return "Post variables not set.";

        var cards = req.post.cards.split(";");
        var players=req.post.players.split(";");

        games.push(new coup.Game(cards, players, nextGameIndex++));

	}else if(/respond\/?$/.test(req.path)){

        if(!req.post.response)
            return "Post variables not set.";

        player.resolveState(response);

    }
}

module.exports.sampleGame = new coup.Game(
    ["ben","otherPlayer"],
    ["FakeCard1","FakeCard2"],0);