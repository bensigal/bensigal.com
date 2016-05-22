var stack = require("stack");
module.exports.names       = [
    "Banker",
    "Reporter",
    "Judge",
    "Communist",
    "Missionary"
];
module.exports.abilities   = [
    function(player){
        return new stack.Item().Challengeable(player, function(){
            player.money += 3;
            this.stack.pop();
            this.stack.nextAction();
        });
    },
    function(player){
        player.game.log(player.name + " reports on the latest story.")
        player.money++;
        player.recieveCardCallback = reporterCardCallback;
        player.game.initCardChoice(player, 1);
        return false;
    },
    function(player, target){
        if(player.money < 3){
            return "incapable";
        }
        player.game.log(player.name + " judges " + target.name + "!")
        player.money -= 3;
        target.money += 3;
        player.game.otherRespond("Judge",target,player);
        return false;
    }
];
module.exports.responses    = [
    false,
    false,
    function(response, player){
        if(response == "block"){
            player.game.challengeOpportunity(player, "Judge", player.game.players[player.game.whoseTurn]);
        }else if(response == "0" || response == "1"){
            if(!player.cards[response].dead){
                player.loseCard(Number(Response));
                player.game.nextTurn();
            }
        }
    }
];
module.exports.followups   = [
    false,
    function(player){
        player.setState("chooseCards",[player.game.deck.deal()])
    },
    
];
module.exports.options     = [
    {isPlayable: ()=>true},
    {isPlayable: ()=>true},
    {target:true, isPlayable:
        player => player.money>=3
    },
    {isPlayable: ()=>true, target:true},
    {isPlayable: ()=>true, target: "all"}
];
function reporterCardCallback(cardOptions){
    return cardOptions;
}