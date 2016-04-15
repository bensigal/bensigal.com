module.exports.Player = function(name, game, index){
    this.index=index;
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
    };
    this.resolveState = function(response){
        switch(this.state){
        case "targetedJudge":
            if(response=="block"){

            }
        }
    }
}
//NOT A REAL CONSTRUCTOR
//Returns this
//Use CoupDeck.create; CoupDeck extends Array, arrays are handled specially.
//Suggested: CoupDeck.call([], cards) or CoupDeck.call([cards],[])
module.exports.Deck = function(cards){
    cards.forEach(function(element){
        for(var i = 0; i < 3; i++){
            this.push(new module.exports.Card(element));
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
module.exports.Deck.create = function(cards){
    return module.exports.Deck.call([], cards);
}
module.exports.Game = function(names, cards, gameIndex){
    
    this.gameIndex  = gameIndex;
    this.cards      = cards;
    this.players    = [];
    this.cardFlags  = new Array(cards.length);
    this.deck       = module.exports.Deck.create(cards);
    
    this.deck.shuffle();
    
    names.forEach(function(element, index){
        this.players.push(new module.exports.Player(element, this, index));
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
    };
    this.othersRespond = function(name, player){
        this.othersRespondRecursive(name,player,this.whoseTurn+1);
    };
    this.othersRespondRecursive = function(name, player, i){
        
        var recursiveCallback = function(){};
        
        this.otherRespond(name,player,this.players[i]);
        i++;
        i %= players.length;
        if(i != this.whoseTurn){
            this.othersRespondRecursive(name,player,i)
        }
    };
    this.challengeOpportunity = function(player){
        for(var i = 0; i < this.players.length; i++){
            if(i==player.)
        }
    };
}
function createCoupCardTemplate(name, ability, options){
    templateNames.push(name);
    templateAbilities.push(ability);
    templateOptions.push(options);
}
module.exports.Card = function(templateName){
    this.name = templateName;
    this.templateIndex = templateNames.indexOf(templateName);
    this.ability = templateAbilities[this.templateIndex];
    this.options = templateOptions[this.templateIndex];
    this.dead = false;
}