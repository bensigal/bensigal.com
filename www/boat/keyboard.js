//Detect keypresses
$(document).keydown(function(e){
	if(e.ctrlKey)return;
    var preventDefault = true;
    switch(e.keyCode){
    //tab
    case 9:
        if(step == "aiming"){
            if(nextBall.type == "grenade")
                nextBall.type = "normalBall";
            else
                nextBall.type = "grenade";
        }
        break;
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
        if(step == "aiming") hasStartedAiming = true;
        //also calls enter's things
    case 13:
        //enter
        if(scene == "game" && step == "finished"){
            if(winner){
                scene = "podium";
            }else{
                initGame();
            }
        }
        else if(scene == "menu"){
            selectMenuOption(optionSelected);
        }
        else if(scene == "podium"){
            scene = "game";
            initGame();
            p1Score = 0;
            p2Score = 0;
            winner = false;
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
		if(scene == "menu" && depth == 0){
			if(balls && balls.length > 2){
				scene = "game";
			}
		}
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
        if(step == "aiming" && hasStartedAiming) pilotBoat();
        break;
    }
});