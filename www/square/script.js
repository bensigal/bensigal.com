var canvas, ctx, startTime;
var zoomLevel = 1;
var squares = [];
var cameraOffsetLeft = 0;
var cameraOffsetTop = 0;

$(function(){
    canvas = $("#canvas")[0];
    canvas.width = 1300;
    canvas.height = 700;
    ctx = canvas.getContext("2d");
    window.requestAnimationFrame(drawSomething);
    for(var i = 0; i < 20; i++){
        squares.push([]);
        for(var j = 0; j < 40; j++){
            squares[i].push(new Square(i, j));
        }
    }
});

function drawBoard(dt){
    squares.forEach(function(row, rowIndex){
        row.forEach(function(square, index){
            square.draw();
        });
    });
    ctx.fillStyle = "#DDD"
    ctx.fillRect(30,660,30,30);
    ctx.font
}

function toRx(x){
    return x/zoomLevel - cameraOffsetLeft;
}

function toRy(y){
    return y/zoomLevel - cameraOffsetTop;
}

function drawSomething(timestamp){
    ctx.clearRect(0,0,1300,700);
    if(!startTime){
        lastTime = timestamp;
        startTime = timestamp;
    }
    var dt = timestamp-lastTime;
    try{
        drawBoard(dt);
    }catch (e){
        console.error(e.stack);
        if(!confirm(e.message)){
            return;
        }
    }
    lastTime = timestamp;
    window.requestAnimationFrame(drawSomething);
}