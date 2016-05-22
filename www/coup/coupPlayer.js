var defs = require("./defs");
//Player
module.exports = function(name, game, index){
    
    this.index=index;
    this.name=name;
    this.money = 2;
    this.liveCards = 2;
    this.tokens= [];
    this.cards = [];
    this.state = "waiting for the game to start"
    this.game  = game;
    this.flagsText = "";
    
    var self = this;
    
    this.setState = function(state, callback){
        
        if(callback)this.callback=callback;
        
        this.game.deepLog("State of "+this.name+" set to "+state);
        this.state=state;
        
        switch(state){
        case "choosing an action":
            if(!this.liveCards){
                this.game.nextTurn();
            }
            break;
        }
        if(state.startsWith("playing")){
            this.game.deepLog("Adding to stack "+state)
            setTimeout(()=> {
                var cardName  = state.substring(8)
                var cardIndex = defs.names.indexOf(cardName);
                var result = defs.abilities[cardIndex](this, this.game.target);
                if(result){
                    this.finishTurn();
                }
            },0);
        }
    };
    this.resolveState = function(response){
        this.game.deepLog(this.name+" is resolving "+this.state+" with "+response);
        switch(this.state){
        case "choosing an action":
            if(response == "income"){
                this.game.log(this.name + " collects income.");
                this.money++;
                this.finishTurn();
            }else if(/^coup;\d$/.test(response)){
                //response should be coup;index
                if(this.money < 7){
                    return;
                }
                this.money -= 7;
                var index = response.substring(5);
                this.game.log(this.name + " launches a coup against "+this.game.players[index].name + "!");
                this.game.loseCard(this.game.players[index], this.finishTurn);
            }
            for(var i = 0; i < 5; i++){
                if(new RegExp(this.game.cards[i]+"(;\\w+)?").test(response)){
                    this.game.deepLog("Card recognized.")
                    //If not playable, return
                    var canPlayResponse = defs.options[defs.names.indexOf(this.game.cards[i])].isPlayable(this);
                    if(canPlayResponse !== true){
                        this.game.deepLog("Unable to play "+this.game.cards[i]+": "+canPlayResponse);
                        return;
                    }
                    //If no specified target...
                    if(response == this.game.cards[i]){
                        this.game.log(this.name + " claims "+response+".");
                        this.game.challengeOpportunity(this, response)
                    }else{
                        //If specified target...
                        var whichCard = response.substring(0,response.indexOf(";"));
                        var attemptTarget = response.substring(response.indexOf(";")+1);
                        
                        this.game.deepLog("searching for target "+attemptTarget)
                        
                        var target = this.game.playersByName[
                            attemptTarget
                        ];
                        
                        this.game.deepLog("found "+target)
                        
                        if(!target)return;
                        
                        this.game.log(this.name + " plays a "+whichCard+" against "+target.name+"!");
                        this.game.challengeOpportunity(this, whichCard, target);
                    }
                }
            }
            break;
        case "deciding whether to challenge":
            if(response == "allow"){
                this.game.noChallengeHere(this);
            }else if(response == "challenge"){
                this.game.challengeFrom(this, this.game.challengedPlayer)
                
            }
            break;
        case "responding to a challenge":
            chosen = (response=="1"?1:0);
            if(this.cards[chosen].dead)return;
            
            if(this.cards[chosen].name == this.game.challengedCard){
                this.game.log("Gotcha! "+this.name+" reveals a "+this.game.challengedCard+"!")
                this.game.loseCard(this.game.challenger, this.defendedChallengeCallback);
            }else{
                this.loseCard(chosen);
                this.game.nextTurn();
            }
            break;
        case "choosing a card to lose":
            chosen = (response == "1"?1:0);
            if(this.cards[chosen].dead)return;
            
            this.loseCard(chosen);
            this.callback();
            break;
        case "choosing cards":
            chosen = Number(response);
            if(0 <= chosen && chosen < this.cardsToChose.length){
                this.cards.push(this.cardsToChose.splice(chosen, 1)[0]);
                this.cardsLeftToChose--
                if(this.cardsLeftToChose){
                    this.finalizeCards(this.cardsToChose);
                }else{
                    this.game.nextTurn();
                }
            }else{
                return;
            }
            break;
        }
        if(this.state.startsWith("targeted")){
            var index = defs.names.indexOf(this.state.substring(8));
            if(index > -1){
                defs.responses[index](response,this,this.game.players[whoseTurn]);
            }
        }
    }
    this.finishTurn = function(){
        this.game.nextTurn();
    }
    this.loseCard = function(dying){
        this.game.log(this.name + " loses a "+this.cards[dying] + ".")
        this.cards[dying].dead=true;
        this.liveCards--;
        if(!this.liveCards){
            game.kill(this.index);
        }
    }
    this.cards.toString = function(){
        return this.join(",");
    }
    this.defendedChallengeCallback = function(){
        self.setState("playing "+self.game.challengedCard);
    }
    this.finalizeCards = function(cards){
        this.cardsLeftToChose = this.cardsLeftToChose || this.liveCards;
        this.cardsToChose = cards;
        this.flagsText = cards.join(",");
        this.setState("choosing cards");
    }
}