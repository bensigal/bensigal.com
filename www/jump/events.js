var mouse = {};

function mainLoop(){
    
    ctx.clearRect(0,0,800,600);
    cursor.draw();
    
}
$(function(){
    $("#canvas").mousemove(function(e){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    });
})