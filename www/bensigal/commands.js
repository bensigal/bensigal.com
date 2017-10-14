commands = {
    help: {
        description: "help x<br>Prints description of given command x.<br><br>help<br>Prints list of commands.<br><br>help all<br>Prints all commands with descriptions.",
        trigger: function(words){
            if(!words.length){
                let result = "";
                console.log("BASIC HELP")
                for(let key in commands){
                    console.log(key)
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
    traitlist: {
        description: "traitlist<br>Prints a list of your traits.",
        trigger: function(){
            player.traits.forEach(function(element){
                println(span("attr", element.name));
                println(element.description);
            });
        }
    }
};