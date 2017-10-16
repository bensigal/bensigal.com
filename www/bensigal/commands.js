var info = {
    stats: "STR: Strength. Affects damage dealt with physical weapons, how much you can carry, and the strength of your immune system - the health you recover each room.<br><br>"+
        "SPD: Speed. Affects your dodge and initiative. If it is significantly higher than your opponent, you might get extra actions.<br><br>"+
        "DEX: Dexterity. Affects your dodge and your chance to hit.<br><br>"+
        "CON: Constitution. Affects your health total and your chance to resist effects such as poison.<br><br>"+
        "WIL: Willpower. Affects the efficacy of your spells and your resistance to effects such as magical illusions.<br><br>"+
        "CHA: Charisma. Determines how much mana you have, and how much you recover each room. Also how likely you are to convince NPCs of something.<br><br>"+
        "ANA: Analysis. Determines your crit chance, chance to avoid a crit, initiative, and chance to notice something."
};
commands = {
    help: {
        description: "help x<br>Prints description of given command x.<br><br>help<br>Prints list of commands.<br><br>help all<br>Prints all commands with descriptions.",
        trigger: function(words){
            if(!words.length){
                let result = "";
                console.log("BASIC HELP");
                for(let key in commands){
                    result+= key+" ";
                }
                println(result);
            }
            else if(words[0] == "all"){
                let result = "";
                for(let key in commands){
                    result+= "<p>"+commands[key].description+"</p>";
                }
                println(result);
            }
            else if(commands[words[0]]){
                println("<p>"+commands[words[0]].description+"</p>");
            }
        }
    },
    debugchars: {
        description: "debugchars x<br>Prints x digits. Used to test viewing screen.",
        trigger: function(words){
            var length = Number(words[0]);
            var result = "";
            for(var i = 0; i < length; i++){
                result += (Math.floor(4.6*(Math.sin(i)+1)));
            }
            println(result);
        }
    },
    stats:{
        description: "stats<br>Prints a list of your stats.<br><br>stats info<br>Prints what the stats affect.",
        trigger: function(words){
            if(words[0]=="info"){
                return println(info.stats);
            }
            statAbbreviations.forEach(function(element, index){
                println(element.toUpperCase()+": "+player.stats[index]);
            });
        }
    },
    traitlist: {
        description: "traitlist<br>Prints a list of your traits.",
        trigger: function(){
            player.traits.forEach(function(element){
                println(span("attr", element.name));
                println(element.description);
            });
        }
    },
    look:{
        description: 'You look around some more.',
        trigger: function(){
            println(room.interiorDescription);
        }
    }

    
};
