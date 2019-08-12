var lastFrameTimestamp;
var mouse = {x:0, y:0}
var narrationLettersLeft, narrationLines, narrationNextTime, narrationCurrentLine, narrationCurrentChar;
var narrationIncrement = 17;
var narrations = [
	[//0: intro
		"Denmark, Late Medieval Period.",
		"Through hard work and high birth, you, Polonius, have become the",
		"Senior Advisor to the beloved King Claudius. However, the decidedly",
		"obnoxious Hamlet, nephew to His Majesty, is being rather suspicious.",
		"Luckily, you know just what to do!",
		"",
		"Click 'Start' to continue."
	],
	[//1: intro to dodger
		"Congratulations on not embarrassing yourself! However, soon enough...",
		"",
		"'What ho? A rat!'",
		"You have been discovered spying by the insane Hamlet, who is now",
		"trying to stab you through the curtains!",
		"Can you dodge Hamlet's attacks long enough for the Queen to convince",
		"Hamlet to stop?",
		"",
		"Use the arrow keys to dodge Hamlet's swords!",
		"",
		"Click 'Start' to continue."
	],
	[//2: death to dodger
		"'Argh! I have been slain!'",
		"",
		"Click start to try again."
	],
	[//3: victory
		"Congratulations! You have escaped Hamlet's attacks long enough",
		"for the Queen to call for help!",
		"",
		"After the king learns of the attempted murder, Hamlet is sent to the",
		"distant land of England. ",
		"Everyone, surely, will live happily ever after.",
		"                                                                         ",
		"The end.",
		"                                                                         ",
		"Click start to return to the title screen."
	],
	[],//4: placeholder for memory information
	[//5: intro to memory
		"This Hamlet guy has a strange obsession with clouds. He has very",
		"specific ideas about what 8 different clouds look like. It is your",
		"duty as Senior Advisor to prove you have what it takes to keep up with",
		"Hamlet's madness.",
		"",
		"Remember carefully what the order of the eight clouds is so that you",
		"don't embarrass yourself in front of everyone.",
		"",
		"Click start to begin."
	],
	[//6: failure for memory 
		"'INCORRECT, you fool!' shouts Hamlet.",
		"You have been embarrassed in front of everyone.",
		"",
		"Click start to try again."
	]
];
var keyboard = {
	left: false,
	right: false
};
var sceneReady = true;

$(function(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background="white"
    
    ctx = canvas.getContext("2d");
    
    scene = "title";
    
    window.requestAnimationFrame(frame);
    
    lastFrameTimestamp = new Date().getTime();
    
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
    });
    $("#canvas").click(function(e){
        
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
        if(sceneReady &&
                mouse.x > 300 && mouse.x < 500 &&
                mouse.y > 475 && mouse.y < 575){
            endScene(scene);
        }
		if(scene == "memory"){
			memoryProcessClick();
		}
        
    });
	$("body").keydown(function(e){
		switch(e.keyCode){
		case 37: //left
			keyboard.left = true;
			break;
		case 38: //up 
			keyboard.up = true;
			break;
		case 40: //down
			keyboard.down = true;
			break;
		case 39: //right
			keyboard.right = true;
			break;
		}
		
	});
	$("body").keyup(function(e){
		switch(e.keyCode){
		case 37: //left
			keyboard.left = false;
			break;
		case 38: //up 
			keyboard.up = false;
			break;
		case 40: //down
			keyboard.down = false;
			break;
		case 39: //right
			keyboard.right = false;
			break;
		}
		
	});
});

function endScene(scene){
	switch(scene){
	case "title":
		prepareNarration(0);
		break;
	case "narration":
		switch(subscene){
		case 0:
			prepareNarration(5);
			break;
		case 2:
			prepareNarration(1);
			break;
		case 1:
			prepareDodge();
			break;
		case 3:
			prepareTitle();
			break;
		case 4:
			prepareMemory();
			break;
		case 5:
		case 6:
			prepareNarration(4);
			break;
		}
		break;
	}
}

function prepareTitle(){
	sceneReady = true;
	scene = "title";
}

function renderContinue(){
    
    ctx.beginPath();
    
    ctx.rect(300, 475, 200, 100);
    
    ctx.stroke();
    
    if(mouse.x > 300 && mouse.x < 500 &&
            mouse.y > 475 && mouse.y < 575){
        ctx.fillStyle = "#EEE";
    }else{
        ctx.fillStyle = "#CFCFCF";
    }
    ctx.fill();
    
    ctx.closePath();
    
    ctx.font = "30px Georgia";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Start", 400, 535);
	
}

function prepareNarration(selectedSubscene){
	scene = "narration";
	subscene = selectedSubscene;
	sceneReady = (selectedSubscene != 4);
	narrationLettersLeft = narrations[subscene];
	narrationLines = [""];
	narrationCurrentLine = 0;
	narrationCurrentChar = 0;
	narrationNextTime = new Date().getTime();
	if(selectedSubscene == 4){
		prepareMemoryNarration();
	}
}

function renderNarration(){
	
	if(subscene == 4 || subscene == 5 || subscene == 6){
		ctx.drawImage($("#cloudsImage")[0], 0, 0);
	}
	
	ctx.font = "18px monospace";
	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	for(var i = 0; i < narrationLines.length; i++){
		ctx.fillText(narrationLines[i], 40, 50+i*30);
	}
	
	while(narrationNextTime < new Date().getTime()){
		if(narrationLines[narrationCurrentLine].length == narrationLettersLeft[narrationCurrentLine].length){
			if(narrationCurrentLine == narrationLettersLeft.length - 1){
				return;
			}
			narrationCurrentLine++;
			narrationCurrentChar=0;
			narrationLines.push("");
		}else{
			narrationLines[narrationCurrentLine]+=narrationLettersLeft[narrationCurrentLine][narrationCurrentChar];
			narrationCurrentChar++;
		}
		narrationNextTime += narrationIncrement;
	}
}
	

function renderTitle(){
    
    ctx.font="30px Georgia";
    ctx.fillStyle = "black";
    ctx.fillText("Loading Beautiful Title...", 400, 250);
    
    ctx.drawImage($("#titleImage")[0], 0, -100);
    
}


function frame(timestamp){
    
    var dt = timestamp - lastFrameTimestamp;
    ctx.clearRect(0, 0, 800, 600);
    
    try{
        
        switch(scene){
        case "title":
            renderTitle();
            break;
		case "narration":
			renderNarration(timestamp);
			break;
		case "dodge":
			renderDodge(dt, timestamp);
			break;
		case "memory":
			renderMemory(dt, timestamp);
			break;
        }
		if(sceneReady){
			renderContinue();
		}
        
    }catch(e){
        alert(e.message+"\n"+e.stacktrace);
        return;
    }
    
    window.requestAnimationFrame(frame)
    lastFrameTimestamp = timestamp;
    
}