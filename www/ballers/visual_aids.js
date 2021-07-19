class PowerMeter{
    
    constructor(){
        
        this.angle = 0;
        this.pos = Vector.xy(20, 300);
        this.length = 50;
        this.progress = 0.05;
        this.progressIncreasing = true;
        
    }
    
    tick(){
        
        if(keyboard.right && this.angle < Math.PI/2)
            this.angle += 0.03;
        if(keyboard.left && this.angle > -Math.PI/2)
            this.angle -= 0.03;
        
        
        this.pos = nextBall.pos.clone();
        this.pos.x += Math.cos(this.angle) * 15;
        this.pos.y += Math.sin(this.angle) * 15;

        if(keyboard.space){
            this.progress += this.progressIncreasing ? 0.025 : -0.025;
            if(this.progress < 0.05){
                this.progress = 0.05;
                this.progressIncreasing = true;
            }
            if(this.progress > 1){
                this.progress = 1;
                this.progressIncreasing = false;
            }
        }
        
    }
    
    draw(){
        var lineOneAngle = this.angle - Math.PI/12;
        var lineTwoAngle = this.angle + Math.PI/12;
        
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        
        ctx.moveTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        ctx.lineTo(this.pos.x + Math.cos(lineOneAngle)*(this.length+3) + Math.sin(lineOneAngle) * 2, 
            this.y + Math.sin(lineOneAngle)*(this.length+3) - Math.cos(lineOneAngle) * 2);
        
        ctx.arc(this.pos.x, this.pos.y, this.length+3, lineOneAngle, lineTwoAngle+0.05);
        
        ctx.moveTo(this.pos.x + Math.cos(lineTwoAngle)*(this.length+3) - Math.sin(lineTwoAngle) * 2, 
            this.pos.y + Math.sin(lineTwoAngle)*(this.length+3) + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x - Math.sin(lineTwoAngle) * 2, this.pos.y + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        
        ctx.stroke();
        ctx.closePath();
        
        ctx.lineWidth = "1px";
        
        for(var i = 2; i <= Math.floor(this.progress*this.length); i++){
            ctx.strokeStyle = "rgb(255, " + Math.floor(255-i*255/this.length) +", 20)";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, i, lineOneAngle, lineTwoAngle);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
}

//Called while on menu
function drawMenu(){
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    
    //Draw each option for whatever you're on
    options[depth].forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 300 + 40 * (index-options[depth].length/2));
    });
}

//Enter was pressed while on the menu
function selectMenuOption(index){
    
    optionSelected = 0;
    //If you were on back, go back
    if(options[depth][index]=="Back")return depth--;
    
    switch(depth){
    //If on the first page of options, go to next page
    case 0:
        if (index == 1){
            multiplayer = true;
        }
        if(index == 2){
            scene = "tutorial";
            break;
        }
        depth++;
        break;
    //If on second page, start game.
    case 1:
        map = maps[options[depth][index]];
        initGame();
        scene = "game";
        if (multiplayer){
            console.log("multiplayer on");
            generateMatch(map);
        }
        break;
    }
}

function drawRemainingBalls(p1BallsLeft,p2BallsLeft){
    function drawBall(x,y,color){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    for (let i = 0; i < p1BallsLeft + (nextBall.player == 1 && step == "aiming"); i++) {
        drawBall(253 +29*i ,105,"#900")
    }

    for (let i = 0; i < p2BallsLeft + (nextBall.player == 2 && step == "aiming"); i++) {
        drawBall(453 +29*i ,105,"#009");
    }

}

function drawScore(score){    

    ctx.font = "40px Impact";
    ctx.textAlign = "center";

    ctx.fillStyle ="red";
    ctx.fillText(p1Score,98,107);
    ctx.fillStyle = "blue";
    ctx.fillText(p2Score,703,107);
}

function drawTopBar(){
    topBar = document.getElementById('scoreBar');
    ctx.drawImage(topBar,0,18);

    ctx.fillStyle = "black";
    ctx.fillRect(0, fieldTop-1, canvas.width, 1);
}

function drawPodium(){
    drawTopBar();
    drawScore();
    ctx.drawImage($("#"+(winner == 1 ? "red" : "blue")+"Win")[0], 0, 130);
}

function drawWaitRoom(){
    waitingRoom = document.getElementById('waitingroom');
    ctx.drawImage(waitingRoom,0,0);
}

function drawLink(link){
    $("body")[0].innerHTML += "<p id='linkInstructions'>Copy this link:</p><p id='link'>"+link+"</p>";
}
