var canvas, ctx, ticks, start, lastTime;
var deltaTimes = [0,0,0,0,0,0,0,0,0,0];
var hexes = [];

var numberOfRows = 7;
var numberOfColumns = 17;
var mapTopOffset = 40;
var mapLeftOffset = 23;
var mouse = {x:0, y:0};

$(function(){
    canvas = $("#canvas")[0];
    canvas.height = 700;
    canvas.width = 1300;
    ticks = 0;
    ctx = canvas.getContext("2d");
    
    for(var i = 0; i < numberOfRows; i++){
        hexes.push([]);
        for(var j = 0; j < numberOfColumns; j++){
            var hex = new Hex(i, j)
            hexes[i].push(hex)
        }
    }
    
    window.requestAnimationFrame(display);
    $("#canvas").click(function(e){
        console.log(Hex.findHex(mouse.x, mouse.y));
        ctx.fillStyle="blue";ctx.fillRect(mouse.x, mouse.y, 2, 2);
    })
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - $(e.target).offset().left;
        mouse.y = e.pageY - $(e.target).offset().top;
    });
});
function distance(obj1, obj2){
    return Math.sqrt(Math.pow(obj1.ax-obj2.ax, 2) + Math.pow(obj1.ay-obj2.ay, 2));
}
function display(timestamp){
    
    if(!start){
        start = timestamp;
        lastTime = start;
    }
    var dt = timestamp - lastTime;
    deltaTimes.push(dt);
    deltaTimes.shift();
    lastTime = timestamp;
    ctx.clearRect(0,0,1300,700);
    ticks++;
    
    ctx.fillStyle = "black";
    ctx.fillText(Math.round(1000/(sumArray(deltaTimes)/10))+"fps",20,20);
    
    hexes.forEach(function(hexRow, index){
        hexRow.forEach(function(hex){
            hex.draw();
        })
    });
    
    var mousedOverHex = Hex.findHex(mouse.x, mouse.y);
    if(mousedOverHex)mousedOverHex.drawMousedOver();
    
    window.requestAnimationFrame(display);
    
}
function absPoint(x, y){
    return [x, y]
}
function absX(x){
    return x;
}
function absY(y){
    return y;
}
function relPoint(ax, ay){
    return [ax, ay];
}
function sumArray(arr){
    return arr.reduce((a, b) => a+b, 0);
}