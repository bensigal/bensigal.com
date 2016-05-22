var Stack = module.exports;

//Item that goes in a stack. Has a function to be called when a response is called.
Stack.Item = function(stack, continueCallback){
    this.continueCallback = continueCallback;
    this.stack = stack;
    this.game = this.stack.game;
    
    //Initiate changes required to make an action challengeable.
    this.Challengeable = function(player, continueCallbackAfterChallenge, startAutomatically){
        
        var nextChallenger;
        
        this.continueCallback = function(player, response){
            
            if(player){
                this.game.log("This item is not meant for players; it generates challenge actions then destroys itself.")
                return;
            }
            
            this.game.log("Allowing next challenge");
            
            nextChallenger++;
            nextChallenger%= this.game.players.length;
            
            this.game.log("Next challenger: "+this.game.players[nextChallenger]);
            
            if(nextChallenger == this.player.index){
                this.game.log("Challenger is active player. Calling action.")
                return continueCallbackAfterChallenge(player, response);
            }else{
                this.stack.push(new stack.Item(this.stack, function(player, response){
                    if(player.index == nextChallenger){
                        if(response == "allow"){
                            this.stack.pop();
                            this.stack.nextAction();
                        }else if(response == "challenge"){
                            
                        }
                    }
                }));
            }
        }
    }
}
Stack.Stack = function(game){
    this.game = game;
    this.last = function(){
        return this[this.length - 1]
    }
    this.nextAction = function(player, response){
        this.last().continueCallback(player, response);
    }
}
Stack.createStack = function(){
    return Stack.Stack.apply([], arguments)
}