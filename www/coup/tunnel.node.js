var templateNames       = [
                            "Capitalist",
                            "Reporter",
                            "Judge",
                            "Communist",
                            "Missionary"
                        ];
var templateAbilities   = [
                            function(player){
                                player.money+=4;
                                player.game.othersRespond("Capitalist",player);
                            },
                            function(player){
                                player.money++;
                            },
                            function(player, target){
                                player.money -= 3;
                                target.money += 3;
                                player.game.otherRespond("Judge",target,player);
                            }
                        ];
var templateFollowups   = [
                            false,
                            function(player){
                                player.setState("chooseCards",[player.game.deck.deal()])
                            },
                            
                        ];
var templateOptions     = [
                            {},
                            {},
                            {target:true, playable:
                                (player) => player.money>=3;
                            },
                            {target:true},
                            {notPlayable:true}
                        ];

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
	}else if(/newGame\/?$/.test(req.path)){
        if(!req.post.cards || !req.post.players)
            return "Post variables not set.";
        var cards = req.post.cards.split(";");
        var players=req.post.players.split(";");
        games.push(new CoupGame(cards, players, nextGameIndex++));
	}else if(/respond\/?$/.test(req.path)){
        if(!req.post.response)
            return "Post variables not set.";
        player.resolveState(response);
    }
}
var CoupPlayer = function(name, game){
    this.money = 2;
    this.liveCards = 2;
    this.tokens= [];
    this.cards = [];
    this.state = "waiting"
    this.game  = game;
    this.setState = function(state){
        this.state=state;
        
        switch(state){
        case "yourTurn":
            if(!this.liveCards){
                this.game.nextTurn();
            }
            break;
        }
    }
}
//NOT A REAL CONSTRUCTOR
//Returns this
//Use CoupDeck.create; CoupDeck extends Array, arrays are handled specially.
//Suggested: CoupDeck.call([], cards) or CoupDeck.call([cards],[])
var CoupDeck = function(cards){
    cards.forEach(function(element){
        for(var i = 0; i < 3; i++){
            this.push(new CoupCard(element));
        }
    },this);
    this.shuffle=function(){
        //From http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
        var j, x, i;
        for (i = this.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = this[i - 1];
            this[i - 1] = this[j];
            this[j] = x;
        }
    }
    this.deal = function(){
        return this.pop();
    }
    return this;
}
CoupDeck.create = function(cards){
    return CoupDeck.call([], cards);
}
var CoupGame = function(names, cards, gameIndex){
    
    this.gameIndex  = gameIndex;
    this.cards      = cards;
    this.players    = [];
    this.cardFlags  = new Array(cards.length);
    this.deck       = CoupDeck.create(cards);
    
    this.deck.shuffle();
    
    names.forEach(function(element){
        this.players.push(new CoupPlayer(element, this));
    },this);
    this.players.forEach(function(element){
        activePlayers.push(element.name);
        playerGameIndexes.push(this.gameIndex);
        //Deal Cards
        element.cards.push(this.deck.deal());
        element.cards.push(this.deck.deal());
    },this);
    
    this.whoseTurn = 0;
    
    this.players[0].setState("yourTurn");
    
    this.nextTurn = function(){
        
        this.players[this.whoseTurn].setState("waiting");
        
        this.whoseTurn++;
        this.whoseTurn%=this.players.length;
        
        this.players[this.whoseTurn].setState("yourTurn");
        
    }
    this.otherRespond = function(name,target,player){
        target.setState("targeted"+name);
    }
    this.othersRespond = function(name, player){
        this.othersRespondRecursive(name,player,this.whoseTurn+1);
    }
    this.othersRespondRecursive = function(name, player, i){
        
        var recursiveCallback = function(){};
        
        this.otherRespond(name,player,this.players[i]);
        i++;
        i %= players.length;
        if(i != this.whoseTurn){
            this.othersRespondRecursive(name,player,i)
        }
    }
}
function createCoupCardTemplate(name, ability, options){
    templateNames.push(name);
    templateAbilities.push(ability);
    templateOptions.push(options);
}
var CoupCard = function(templateName){
    this.name = templateName;
    this.templateIndex = templateNames.indexOf(templateName);
    this.ability = templateAbilities[this.templateIndex];
    this.options = templateOptions[this.templateIndex];
    this.dead = false;
}
module.exports.sampleGame = new CoupGame(
    ["ben","otherPlayer"],
    ["FakeCard1","FakeCard2"],0);