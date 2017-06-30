var canvas, ctx, startTime;
var zoomLevel = 1;
var squares = [];
var verticals = []; //vertical borders
var horizontals = []; //horizontal borders;
var miscSprites = [];
//relative to zoom level
var cameraOffsetLeft = 0;
var cameraOffsetTop = 0;
var mouse = {x:0, y:0};
var keyboard = {};
var scrollSpeed = 5;
var continueDrawing = true;
var selection = false;
var fps = 0;
var buttons = [
    new Button(30, 660, 30, 30, "+", function(){
        zoomLevel /= 1.5;
        cameraOffsetLeft *= 1.5;
        cameraOffsetTop *= 1.5;
    }),
    new Button(90, 660, 30, 30, "-", function(){
        zoomLevel *= 1.5
        cameraOffsetLeft /= 1.5;
        cameraOffsetTop /= 1.5;
    }),
];

$(function(){
    canvas = $("#canvas")[0];
    canvas.width = 1300;
    canvas.height = 700;
    ctx = canvas.getContext("2d");
    window.requestAnimationFrame(firstDrawSomething);
    for(var i = 0; i <= 20; i++){
        if(i<20)squares.push([]);
        if(i<20)verticals.push([]);
        horizontals.push([]);
        for(let j = 0; j <= 40; j++){
            if(i<20&&j<40)squares[i].push(new Square(i, j));
            if(i<20)verticals[i].push(new Border(true, i, j));
            if(j<40)horizontals[i].push(new Border(false, i, j));
        }
    }
    for(var j = 0; j < 20; j++){
        verticals[j][4] = new SolidBorder(true, j, 4);
    }
    $("#canvas").click(click)
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - $(e.target).offset().left;
        mouse.y = e.pageY - $(e.target).offset().top;
    });
});

function click(e){
    buttons.forEach(function(button, index){
        if(button.mouseIsInside()){
            button.onClick();
        }
    });
    if(mouseIsInBoard()){
        var square = findSquareUnderMouse();
        square.click();
    }
}

function drawBoard(dt){
    squares.forEach(function(row, rowIndex){
        row.forEach(function(square, index){
            square.draw();
        });
    });
    verticals.forEach(function(row, rowIndex){
        row.forEach(function(vertical, index){
            vertical.draw();
        });
    });
    horizontals.forEach(function(row, rowIndex){
        row.forEach(function(horizontal, index){
            horizontal.draw();
        });
    });
    miscSprites.forEach(sprite => sprite.draw());
    ctx.font = "18px Arial"
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#EEE"
    ctx.fillRect(0,650,1300,50);//Clear bottom area for buttons
    buttons.forEach(button => button.draw());
    findSquareUnderMouse().underMouse = true;
}

function firstDrawSomething(timestamp){
    lastFPSCheck = timestamp;
    framesSinceFPSCheck = 0;
    lastTime = timestamp;
    startTime = timestamp;
    drawSomething(timestamp);
}

function drawSomething(timestamp){
    ctx.clearRect(0,0,1300,700);
    var dt = timestamp-lastTime;
    framesSinceFPSCheck++;
    
    if(timestamp - lastFPSCheck > 500){
        fps = Math.round(framesSinceFPSCheck/(timestamp-lastFPSCheck)*1000);
        framesSinceFPSCheck = 0;
        lastFPSCheck = timestamp;
    }
    
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "12px Arial";
    ctx.fillText(fps, 0, 0);
    
    if(keyboard.d){
        cameraOffsetLeft += dt/scrollSpeed/zoomLevel/zoomLevel;
    }if(keyboard.w){
        cameraOffsetTop -= dt/scrollSpeed/zoomLevel/zoomLevel;
    }if(keyboard.a){
        cameraOffsetLeft -= dt/scrollSpeed/zoomLevel/zoomLevel;
    }if(keyboard.s){
        cameraOffsetTop += dt/scrollSpeed/zoomLevel/zoomLevel;
    }
    
    try{
        drawBoard(dt);
    }catch (e){
        console.error(e.stack);
        if(!confirm(e.message)){
            return;
        }
    }
    lastTime = timestamp;
    if(continueDrawing)window.requestAnimationFrame(drawSomething);
}