events = {
    
    intro:{
        key:"intro",
        init: function(){
            println("Welcome to this game. It is a good game.");
            println("You find yourself in a dark room.");
            println("The room is triangular, with a low ceiling.");
            println("Each wall has a door in it with a sign above. They read Courage, Faith, and Honor.");
            println("(Enter &quot;help&quot; to see a list of commands. Enter &quot;help all&quot; to see a list of commands and their functions.");
            println("(Enter one of the words to go through the respective door.)");
        },
        command: function(command){
            var choice = command[0];
            console.log("recieving command "+choice);
            if(["honor", "courage", "faith"].indexOf(choice) < 0){
                return false;
            }
            println("You have chosen: "+choice);
            gainTrait(choice);
            finishEvent({newRoom:true});
            return true;
        }
    }
    
};

function startEvent(key){
    currentEvent = events[key];
    events[key].init();
}

function finishEvent(options){
    currentEvent = null;
    if(options.newRoom){
        println("You find yourself in a new room. Somehow, the way to the previous room vanishes.");
    }
}