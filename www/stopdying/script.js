var canvas, ctx, mainLoopInterval, ticks, lastTime;

var keyboard = {};
var mouse = {};
var stopped = false;
var lastKeys=[];

$(function(){
    lastTime = new Date().getTime();
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white"
    
    ctx = canvas.getContext("2d");
    
    scene = "game";
    
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    })
    
    gameSceneSetup();
	
    window.requestAnimationFrame(animationFrame);
	
});
function animationFrame(timestamp){
    var dt = timestamp - lastTime;
	if(dt > 100)dt = 100;
	if(dt < 0  )dt = 0;
    lastTime = timestamp;
    ctx.clearRect(0,0,800,600);
    try{
        switch(scene){
        case "game":
            gameScene(dt);
            break;
        }
    }catch(e){
        console.error(e.message)
        console.error(e.stack)
		return setTimeout(function(){
			window.requestAnimationFrame(animationFrame);
		}, 100);
    }
    window.requestAnimationFrame(animationFrame);
}

$(document).keydown(function(e){
    var preventDefault = true;
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
		if(!keyboard.up && !keyboard.down && !keyboard.right){
			player.direction = 1;
		}
        break;
    case 38:
        keyboard.up = true;
		if(!keyboard.left && !keyboard.down && !keyboard.right){
			player.direction = 2;
		}
        break;
    case 39:
        keyboard.right = true;
		if(!keyboard.up && !keyboard.down && !keyboard.left){
			player.direction = 3;
		}
        break;
    case 40:
        keyboard.down = true;
		if(!keyboard.up && !keyboard.right && !keyboard.left){
			player.direction = 0;
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
        keyboard.s=true
        break;
    case 32:
        keyboard.space = true;
    default:
        preventDefault = false;
    }

    if(preventDefault)e.preventDefault();
	
	var arrowKeysPressed = 0 + keyboard.up + keyboard.right + keyboard.left + keyboard.down;
	
	switch(arrowKeysPressed){ 
	case 1:
		if(keyboard.down)player.direction = 0;
		if(keyboard.left)player.direction = 1;
		if(keyboard.up)player.direction = 2;
		if(keyboard.right)player.direction = 3;
		break;
	case 3:
		if(!keyboard.up)player.direction = 0;
		if(!keyboard.right)player.direction = 1;
		if(!keyboard.down)player.direction = 2;
		if(!keyboard.left)player.direction = 3;
		break;
	}
	
	player.checkWalking();
});
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
        keyboard.s=false
        break;
    case 32:
        keyboard.space = false;
        break;
    }
	
	var arrowKeysPressed = 0 + keyboard.up + keyboard.right + keyboard.left + keyboard.down;
	
	switch(arrowKeysPressed){ 
	case 1:
		if(keyboard.down)player.direction = 0;
		if(keyboard.left)player.direction = 1;
		if(keyboard.up)player.direction = 2;
		if(keyboard.right)player.direction = 3;
		break;
	case 3:
		if(!keyboard.up)player.direction = 0;
		if(!keyboard.right)player.direction = 1;
		if(!keyboard.down)player.direction = 2;
		if(!keyboard.left)player.direction = 3;
		break;
	}
	
	player.checkWalking();
})