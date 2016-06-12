var overlayCanvas, overlayCtx;
$(function(){
    overlayCanvas = $("#overlayCanvas")[0];
    overlayCanvas.width = 800;
    overlayCanvas.height = 600;
    overlayCtx = overlayCanvas.getContext("2d");
    overlayCtx.fillStyle = "#FF3333"
})
function gameOver(){
    overlayCtx.font = "72px Impact";
    overlayCtx.fillText("Game Over", 250, 336)
}
function drawScore(x){
    overlayCtx.clearRect(0,0,800,600)
    overlayCtx.font = "24px Georgia";
    overlayCtx.fillText(x, 20, 40)
}