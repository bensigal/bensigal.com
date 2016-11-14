var canvas, ctx, mainLoopIntervalCode, player, money, enemies, losingLife, moneySprites, steps,
    itemsForSale, level, activeFeatureSets;

var keyboard = {};
var stopped = false;
var lastKeys=[];
var ticks = 0;
var steps = 0;

var heartImage = new Image(60, 60);
var goldImage = new Image(32, 32);

heartImage.src = "heart.gif";
goldImage.src = "gold.png";

var themes = {
    basic:{
        background:"white",
        enemy: "#900"
    }
};

var backgroundElements = [];
for(var i = 0; i < 800; i+=10){
    backgroundElements.push(new BackgroundElement(i));
}

var theme = themes.basic;

function start(){
    
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    ctx = canvas.getContext("2d");
    
    mainLoopIntervalCode = setInterval(mainLoop, 16);
    
    player = new Player();
    
    stopped=false;
    paused =false;
    
    money = 0;
    
    activeFeatureSets = [{start: 0, length: calculateLength(levels[0])}];
    
    var features = generateFeatures(levels[0], 0);
    enemies = features[0];
    moneySprites = features[1];
    
    losingLife = 16;
    
    itemsForSale = [
        {
            description:["Next Level", "$5", ""],
            cost: 5,
            activate: () => {
                level++;
            }
        },
        tier1items[0],
        tier1items[1],
        tier1items[2],
        tier1items[3],
    ];
    
    level = 0;
    steps = 0;
    
}
$(start);

function drawThreeLines(text, x){
    ctx.font = "18px Ubuntu";
    ctx.fillText(text[0], x, 150);
    ctx.fillText(text[1], x, 170);
    ctx.fillText(text[2], x, 190);
}

function mainLoop(){
    if(paused)return;
    
    steps += 2;
    
    ctx.clearRect(0,0,800,600);
    
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(300, 50);
    ctx.stroke();
    ctx.closePath();
    
    ctx.font = "50px Ubuntu";
    ctx.textAlign = "center";
    
    ctx.fillText("1", 75, 100);
    ctx.fillText("2", 225, 100);
    ctx.fillText("3", 375, 100);
    ctx.fillText("4", 525, 100);
    ctx.fillText("5", 675, 100);
    
    itemsForSale.forEach(function(element, index){
        drawThreeLines(element.description, index * 150 + 75);
    });
    
    for(var element of backgroundElements){
        element.tick();
        //element.draw();
    }
    
    player.tick();
    player.draw();
    
    for(let enemy of enemies){
        enemy.tick();
        enemy.draw();
    }
    
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].destroy){
            console.log(enemies[i])
            enemies.splice(i, 1);
            i--;
        }
    }
    
    for(var moneySprite of moneySprites){
        moneySprite.tick();
        moneySprite.draw();
    }
    
    for(i = 0; i < moneySprites.length; i++){
        if(moneySprites[i].destroy){
            console.log(moneySprites[i])
            moneySprites.splice(i, 1);
            i--;
        }
    }
    
    ctx.fillStyle = "black";
    ctx.font = "50px Ubuntu";
    ctx.textAlign = "right";
    ctx.fillText("$"+money, 780, 50)
    
    var i;
    for(i = 0; i < player.lives; i++){
        ctx.drawImage(heartImage, 10 + 40*i, 10, 32, 32);
    }
    if(losingLife < 16){
        ctx.drawImage(heartImage, 10 + 40*i + losingLife, 10 + losingLife, 32 - losingLife*2, 32 - losingLife - 2);
        losingLife+=0.75;
    }
    
    if(activeFeatureSets[0].start + activeFeatureSets[0].length < steps){
        activeFeatureSets.shift();
    }
    var lastElement = activeFeatureSets[activeFeatureSets.length - 1]
    if(lastElement.start + lastElement.length < steps + 800){
        addFeatureSet(lastElement.start + lastElement.length);
    }
    
    ticks++;
}

function loseLife(){
    player.lives--;
    losingLife = 0;
    if(player.lives < 1){
        paused = true;
        clearInterval(mainLoopIntervalCode);
    }
}

$(document).keydown(function(e){
    e.preventDefault();
    switch(e.keyCode){
    case 37:
        keyboard.left = true;
        break;
    case 38:
        keyboard.up = true;
        break;
    case 39:
        keyboard.right = true;
        break;
    case 40:
        keyboard.down = true;
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
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
        var numberIndex = e.keyCode - 49;
        if(money >= itemsForSale[numberIndex].cost){
            money-= itemsForSale[numberIndex].cost;
            itemsForSale[numberIndex].activate();
        }
        break;
    case 32:
        if(stopped){
            start();
        }else if(paused){
            paused = false;
        }else{
            paused = true;
        }
    }
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
    }
})

function rectangularCollisionTest(a,b){
    
    var al = a.x;
    var ar = a.x+a.w;
    var at = a.y;
    var ab = a.y+a.h;
    
    var bl = b.x;
    var br = b.x+b.w;
    var bt = b.y;
    var bb = b.y+b.h;
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    )
}