var floors  = [];
var walls   = [];
var chanceOfBlock = 0.5;
var topOfScreen = 600;
var blocksSinceStar = 8;

function startGame(){
    
    //For each row...
    for(var i = 0; i < 13; i++){
        generateRow();
    }
    //When the browser is ready for a new frame, reset the canvas
    window.requestAnimationFrame(frame);
    
}

function generateRow(){
    floors.push([]);
    walls.push([]);
    for(var i = 0; i < 16; i++){
        //Given a chanceOfBlock chance, is there a floor beneath and a wall to the left?
        floors[floors.length-1].push(Math.random() < chanceOfBlock);
        walls[walls.length-1].push(Math.random() < chanceOfBlock);
    }
}

function gameFrame(dt){
    
    for(var i = Math.floor(topOfScreen/50 - 12); i <= Math.floor(topOfScreen/50); i++){
        if(!floors[i])generateRow();
        for(var j = 0; j < 16; j++){
            if(floors[i][j]){
                ctx.fillRect(j*50, topOfScreen - i*50, 50, 1);
            }
            if(walls[i][j]){
                ctx.fillRect(j*50 - 1, topOfScreen - i*50 - 50, 1, 50);
            }
        }
    }
}