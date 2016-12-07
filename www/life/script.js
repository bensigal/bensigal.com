var canvas, ctx, mainLoopIntervalCode;

var keyboard = {};
var stopped = false;
var lastKeys=[];
var lastData = "";
var lastTime = new Date().getTime();
var ticks = 0;

var s = 4

var themes = {
    basic:{
        background:"white",
    }
}
var theme = themes.basic;

var socket = io("http://bensigal.com");
socket.on('life', function(data){
    console.log("recieved data")
    lastTime = new Date().getTime();
    lastData = data.board;
    ticks = data.ticks;
});

function start(){
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height= 600;
    canvas.style.background=theme.background;
    
    ctx = canvas.getContext("2d");
    
    mainLoopIntervalCode = setInterval(mainLoop, 500);
    
    stopped=false;
    paused =false;
}
$(start);
function mainLoop(){
    ctx.clearRect(0,0,800,600);
    
    console.log(new Date().getTime() - lastTime);
    
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "left"
    ctx.fillText(ticks, 620, 50)
    //Split into 2d array, for each square:
    lastData.split("\n").map(element => element.split("")).forEach(function(row, rowIndex){
        row.forEach(function(square, colIndex){
            switch(square[0]){
            case "b":
                ctx.fillStyle = "black";
                ctx.fillRect(colIndex*s, rowIndex*s, s, s);
                break;
            case "p":
                //var number = square.substring(1);
                ctx.fillStyle = "#0C0";
                ctx.fillRect(colIndex*s, rowIndex*s, s, s);/*
                ctx.font = "14px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText(number, colIndex, rowIndex * 30 + 18);*/
                break;
            case "h":
                //var number = square.substring(1);
                ctx.fillStyle = "#F00";
                ctx.fillRect(colIndex*s, rowIndex*s, s, s);
                /*ctx.font = "14px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText(number, colIndex * 30 + 15, rowIndex * 30 + 18);*/
                break;
            case "c":
                ctx.fillStyle = "#FF4";
                ctx.fillRect(colIndex*s, rowIndex*s, s, s);
            }
        });
    })
}