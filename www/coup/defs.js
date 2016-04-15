module.exports.names       = [
    "Capitalist",
    "Reporter",
    "Judge",
    "Communist",
    "Missionary"
];
module.exports.abilities   = [
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
module.exports.followups   = [
    false,
    function(player){
        player.setState("chooseCards",[player.game.deck.deal()])
    },
    
];
module.exports.options     = [
    {},
    {},
    {target:true, isPlayable:
        (player) => player.money>=3
    },
    {target:true},
    { isPlayable:
        ()=>true
    }
];