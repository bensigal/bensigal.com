var coup = require("./coup");

var game = new coup.Game(
    ["ben","jakob"],
    ["Banker","Reporter","Judge","Communist","Priest"]
);
coup.game = game;

module.exports = function(req, res, server){
	
	if(!req.session.on){
		return server.redirect("/login?coup",req,res);
	}
	var player = coup.game.playersByName[req.session.un.toLowerCase()];
	
	//Main Page
	if(/coup\/?$/.test(req.path)){

		server.getFile("coup/index.html",req,res);
	}else if(/fancy\/?$/.test(req.path)){
        
        server.getFile("coup/fancy.html",req,res)
        
	}else if(/debugStates\/?$/.test(req.path)){
        
        server.getFile("coup/debugStates.html",req,res);
        
	}else if(/deepLog\/?$/.test(req.path)){
        
        return game.inDepthLog;
        
	}else if(/newGame\/?$/.test(req.path)){
        if(!req.post.players)
            return "Post variables not set.";
        if(!req.post.cards)
            return "Post variables not set.";
        
        var names = req.post.players.split(",");
        var cards = req.post.cards.split(",");
        
        game = new coup.Game(names, cards);
        coup.game = game;
	}
    else if(/respond\/?$/.test(req.path)){
        
        if(!req.post.response)
            return "Post variables not set.";
            
        player.resolveState(req.post.response);
        return "Success!";
        
    }else if(/respondAs\/?$/.test(req.path)){
        
        game.playersByName[req.post.respondAs].resolveState(req.post.response);
        return "Success!"
        
    }else if(/states\/?$/.test(req.path)){
        
        var value = "<ul>";
        game.players.forEach(function(element){
            value+="<li>"+element.name+"</li>";
            value+="<ul>";
            value+="<li>"+element.state+"</li>";
            value+="<li>"+element.money+"</li>";
            value+="<li>"+element.cards+"</li>";
            value+="</ul>";
        });
        value+="</ul>";
        return value;
    }else if(/state\/?$/.test(req.path)){
        
        var value = game.currentLog + "\n"
        value+= req.session.un;
        value+=";" + player.money;
        
        if(player.cards.length)
            value+=";" + player.cards;
        else
            value +=";,"
            
        value+=";" + player.state;
        
        value+=";"
        if(player.cards[0])
            value+=(player.cards[0].dead ? "0" : "1");
            
        value+=";"
        if(player.cards[1])
            value+=(player.cards[1].dead ? "0" : "1");
            
        value+=";" + player.flagsText;
        
        for(var i = 0; i < game.players.length; i++){
            if(i == player.index){
                continue;
            }
            var next = game.players[i];
            value+= "\n" + next.name;
            value+= ";"  + next.money;
            
            value+=";"
            if(next.cards[0])
                value+=(next.cards[0].dead ? next.cards[0] : "Unknown");
            
            value+=";"
            if(next.cards[0])
                value+=(next.cards[0].dead ? next.cards[0] : "Unknown");
            
            value+= ";"+next.state;
        }
        return value;
    }
}