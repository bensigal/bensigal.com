module.exports.templateNames       = [
    "Capitalist",
    "Reporter",
    "Judge",
    "Communist",
    "Missionary"
];
module.exports.templateAbilities   = [
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
module.exports.templateFollowups   = [
    false,
    function(player){
        player.setState("chooseCards",[player.game.deck.deal()])
    },
    
];
module.exports.templateOptions     = [
    {},
    {},
    {target:true, playable:
        (player) => player.money>=3;
    },
    {target:true},
    {notPlayable:true}
];