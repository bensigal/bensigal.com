class Square{
    
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.y = this.row * 30 + 30;
        this.x = this.col * 30 + 30;
    }
    
    draw(){
        var rx = toRx(this.x);
        var ry = toRy(this.y);
        var rSideDiff = 30/zoomLevel;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx+rSideDiff, ry);
        ctx.lineTo(rx+rSideDiff, ry+rSideDiff);
        ctx.lineTo(rx, ry+rSideDiff);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.closePath();
    }
    
}