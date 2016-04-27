var coup = module.exports;
var defs = require("./defs");
coup.Player = require("./coupPlayer");

coup.Game = function(names, cards){
    
    this.currentLog = "";
    this.inDepthLog = "";
    this.cards      = cards;
    this.players    = [];
    this.cardFlags  = new Array(cards.length);
    this.deck       = coup.Deck.create(cards);
    this.playersByName = {};
    
    this.log=function(s){
        this.deepLog(s);
        s=";"+s
        this.currentLog = s + this.currentLog;
    }
    this.deepLog = function(s){
        s=";"+s
        this.inDepthLog = s + this.inDepthLog;
    }
    
    this.deck.shuffle();
    
    this.deepLog("Creating players...");
    
    names.forEach(function(element, index){
        this.players.push(new coup.Player(element, this, index));
        this.playersByName[element] = this.players[this.players.length - 1];
    },this);

    this.players.forEach(function(element){
        //Deal Cards
        element.cards.push(this.deck.deal());
        element.cards.push(this.deck.deal());
        this.deepLog(element.name + " has "+element.cards);
        
    },this);
    
    this.whoseTurn = 0;
    
    this.log(this.players[0].name + "'s turn");
    this.players[0].setState("choosing an action");
    
    this.nextTurn = function(){
        
        this.players[this.whoseTurn].setState("waiting for someone to choose an action");
        
        this.whoseTurn++;
        this.whoseTurn%=this.players.length;
        
        this.log(this.players[this.whoseTurn].name + "'s turn");
        this.players[this.whoseTurn].setState("choosing an action");
        
    }
    this.otherRespond = function(name,target,player){
        this.log(player.name + " has targeted " + target.name +" with a "+name+"!")
        target.setState("targeted"+name);
    };
    this.othersRespond = function(name, player){
        this.deepLog("Going through all other players to respond...")
        this.othersRespondRecursive(name,player,this.whoseTurn+1);
    };
    this.othersRespondRecursive = function(name, player, i){
        
        var recursiveCallback = function(){};
        
        this.otherRespond(name,player,this.players[i]);
        i++;
        i %= this.players.length;
        if(i != this.whoseTurn){
            this.othersRespondRecursive(name,player,i)
        }
    };
    this.challengeOpportunity = function(player, cardName, target){
        
        this.log(player.name + " can now be challenged.")
        
        this.target                 = target || undefined;
        this.challengedCard         = cardName;
        this.challengedPlayerIndex  = player.index;
        this.challengedPlayer       = player;
        
        for(var i = 0; i < this.players.length; i++){
            if(i==player.index){
                this.players[i].setState("waiting to see if someone challenges");
            }else{
                this.players[i].setState("deciding whether to challenge");
            }
        }
        this.allowsLeft = this.players.length - 1;
    };
    this.noChallengeHere = function(player){
        this.log(player.name + " is not challenging.")
        this.allowsLeft--;
        console.error(this.allowsLeft);
        if(!this.allowsLeft){
            this.log(this.challengedPlayer.name + " is not being challenged.");
            for(var i = 0; i < this.players.length; i++){
                if(i == this.challengedPlayer.index){
                    this.players[i].setState("playing "+this.challengedCard);
                }else{
                    this.players[i].setState("waiting");
                }
            }
        }
    }
    this.challengeFrom = function(player){
        this.challenger= player;
        this.log(this.challengedPlayer.name + " is being challenged by "+this.challenger.name+"!");
        this.players.forEach((element, index) => {
            if(index == this.challengedPlayerIndex){
                element.setState("responding to a challenge");
            }else if(index == player.index){
                element.setState("challenging");
            }else{
                element.setState("waiting for a response to a challenge");
            }
        });
    }
    this.kill = function(index){
        this.log(this.players[index].name + " has been eliminated!")
        delete this.playersByName[this.players[index].name];
        this.players.splice(index, 1);
        this.players.forEach(function(element,index){
            element.index=index
        });
    }
    this.loseCard = function(target, callback){
        this.deepLog(target.name + " is choosing a card to lose.");
        this.players.forEach(function(element, index){
            if(target.index == index){
                element.setState("choosing a card to lose", callback);
            }else{
                element.setState("waiting");
            }
        })
    }
    this.initCardChoice = function(player, cardsFromDeck){
        
        this.deepLog("Preparing a card choice...")
        
        var cardOptions = [];
        
        for(var i = 0; i < player.cards.length; i++){
            if(!player.cards[i].dead){
                cardOptions.push(player.cards.splice(i,1)[0]);
                i--;
            }
        }
        
        for(var i = 0; i < cardsFromDeck; i++){
            cardOptions.push(this.deck.deal());
        }
        
        player.finalizeCards(player.recieveCardCallback(cardOptions));
    }
}
//NOT A REAL CONSTRUCTOR
//Returns this
//Use CoupDeck.create; CoupDeck extends Array, arrays are handled specially.
//Suggested: CoupDeck.call([], cards) or CoupDeck.call([cards],[])
coup.Deck = function(cards){
    cards.forEach(function(element){
        for(var i = 0; i < 3; i++){
            this.push(new coup.Card(element));
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
coup.Deck.create = function(cards){
    return coup.Deck.call([], cards);
}
function createCoupCardTemplate(name, ability, options){
    defs.names.push(name);
    defs.abilities.push(ability);
    defs.ptions.push(options);
}
coup.Card = function(templateName){
    this.name = templateName;
    this.templateIndex = defs.names.indexOf(templateName);
    this.ability = defs.abilities[this.templateIndex];
    this.options = defs.options[this.templateIndex];
    this.dead = false;
    this.toString = function(){
        return this.name;
    }
}