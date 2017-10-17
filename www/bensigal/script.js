var previousCommands = {
    vals: [],
    index: -1,
    up: function(){
        if(this.index < this.vals.length - 1){
            return this.vals[++this.index];
        }else{
            return "";
        }
    }
};

$(function(){
    
    $("#command").keypress(function(e){
        
        var specialKey = true;
        switch(e.keyCode){
            case 13:
                submit($(this).val());
                previousCommands.vals.push($(this).val());
                $(this).val("");
                break;
            default:
                specialKey = false;
        }
        
        if(specialKey)e.preventDefault();
        
    });
    enterRoom(new IntroRoom());
    
});

function submit(command){
    command = _.escape(command);
    command = command.replace("  ", " ");
    command = command.toLowerCase();
    words = command.split(" ");
    $("#results").append("<p>"+span("echoCommand", command)+"</p><hr>");
    if(commands[words[0]]){
        var op = commands[words.shift()];
        op.trigger(words);
    }else{
        var result = room.command(words);
        if(result === false){
            $("#results").append("<p>Command '"+words[0]+"' not found. Enter 'help' for a list of commands.")
        }
    }
}

function capitalize(string){
    return string.charAt(0).toUpperCase() + string.substring(1);
}

function span(name, text){
    return "<span class='"+name+"'>"+text+"</span>";
}

function println(line){
    $("#results").append("<p>"+line+"</p>");
    $("#results")[0].scrollTop = $("#results")[0].scrollHeight;
}