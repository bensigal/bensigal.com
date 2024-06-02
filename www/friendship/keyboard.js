keyboard = {
    left: false,
    right: false,
    up: false,
    down: false,
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
}

//Detect keypresses
$(document).keydown(function(e){
	if(e.ctrlKey)return;
    var preventDefault = true;
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 38:
        keyboard.up = true;
        if(scene == "menu"){
            optionSelected = Math.max(0, optionSelected-1);
        }
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
        if(scene == "menu"){
            optionSelected = Math.min(options[depth].length-1, optionSelected+1);
        }
        break;
    case 87:
        keyboard.w=true;
        break;
    case 68:
        keyboard.d=true;
        break;
    case 65:
        keyboard.a=true;
        break;
    case 83:
        keyboard.s=true;
        break;
    case 32:
        keyboard.space = true;
        if(scene == "game"){
            if(step == "aiming"){
                step = "windup";
            }
        }
        //also calls enter's things
    case 13:
        //enter
        if(scene == "menu"){
            selectMenuOption(optionSelected);
        }
        else if(scene == "splash"){
            scene = "menu";
        }
        break;
    case 80:
        //p
        if(scene == "paused"){
            scene = "playing";
        }else if(scene == "playing"){
            scene = "paused";
        }
        break;
    //esc
    case 27:
        scene = "menu";
        depth = 0;
        break;
    default:
        preventDefault = false;
        break;
    }
    if(preventDefault)e.preventDefault();
});

//Keys released
$(document).keyup(function(e){
    switch(e.keyCode){
    case 37:
        keyboard.left = false;
        break;
    case 38:
        keyboard.up = false;
        break;
    case 39:
        keyboard.right = false;
        break;
    case 40:
        keyboard.down = false;
        break;
    case 87:
        keyboard.w=false;
        break;
    case 68:
        keyboard.d=false;
        break;
    case 65:
        keyboard.a=false;
        break;
    case 83:
        keyboard.s=false;
        break;
    case 32:
        keyboard.space = false;
        if(step == "windup"){
            alert("FIRE");
        }
        break;
    }
});