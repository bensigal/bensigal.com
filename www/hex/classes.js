var sideLength = 48
class Hex{
    
    constructor(row, column){
        this.row = row;
        this.column = column;
        this.shift = Boolean(this.column % 2);
        this.s = sideLength;
        
        this.x = mapLeftOffset + this.s + this.column * this.s * 3/2;
        this.y = mapTopOffset + Math.sqrt(3)/2 * this.s * (this.shift?2:1) + this.row * this.s * Math.sqrt(3);
        
        //higher y = bototm of screen
        this.lowerY = this.y - this.s * Math.sqrt(3)/2;
        this.higherY = this.y + this.s * Math.sqrt(3)/2;
    }
    
    draw(){
        
        //counterclockwise from left
        ctx.beginPath();
        ctx.moveTo(this.x-this.s, this.y); 
        ctx.lineTo(this.x-this.s/2, this.higherY); 
        ctx.lineTo(this.x+this.s/2, this.higherY); 
        ctx.lineTo(this.x+this.s, this.y); 
        ctx.lineTo(this.x+this.s/2, this.lowerY); 
        ctx.lineTo(this.x-this.s/2, this.lowerY); 
        ctx.lineTo(this.x-this.s, this.y); 
        ctx.stroke();
        ctx.closePath();
    }
    
    get cubicCoordinates(){
        return {
            x: this.column,
            y: this.column - this.row + (this.column - this.column%2)/2,
            z: this.row - (this.column - this.column%2)/2
        }
    }
    
    getAdjacent(){
        var arr = [];
        if(this.row > 0){
            arr.push(hexes[this.row-1][this.column]);
            if(!this.shift){
                if(this.column > 0){
                    arr.push(hexes[this.row - 1][this.column - 1])
                }
                if(this.column < numberOfColumns - 1){
                    arr.push(hexes[this.row - 1][this.column + 1]);
                }
            }
        }
        if(this.row < numberOfRows - 1){
            arr.push(hexes[this.row + 1][this.column]);
            if(this.shift){
                if(this.column > 0){
                    arr.push(hexes[this.row + 1][this.column - 1]);
                }
                if(this.column < numberOfColumns - 1){
                    arr.push(hexes[this.row + 1][this.column + 1]);
                }
            }
        }
        if(this.column > 0){
            arr.push(hexes[this.row][this.column - 1]);
        }
        if(this.column < numberOfRows - 1){
            arr.push(hexes[this.row][this.column + 1]);
        }
        return arr;
    }
    
    pointIsInside(point){
        //too high, too low
        if(this.lowerY > point.y || this.higherY < point.y)return;
        //inner rectangle
        if(this.x+this.s/2 > point.x && this.x-this.s/2 < point.x)return true;
        //Outer triangles
        var yDiff = Math.abs(point.y - this.y);
        var xDiff = Math.abs(point.x - this.x);
        var maxYDiff = this.s*Math.sqrt(3)/2 - Math.sqrt(3)*(xDiff - this.s/2);
        
        //ctx.fillStyle = "red";ctx.fillRect(this.x + xDiff-1, this.y + maxYDiff-1, 2, 2);
        
        //console.log([xDiff, yDiff, maxYDiff])
        return yDiff < maxYDiff;
    }
    drawMousedOver(){
        ctx.fillStyle = "#CDF";
        ctx.beginPath();
        ctx.moveTo(this.x-this.s, this.y); 
        ctx.lineTo(this.x-this.s/2, this.higherY); 
        ctx.lineTo(this.x+this.s/2, this.higherY); 
        ctx.lineTo(this.x+this.s, this.y); 
        ctx.lineTo(this.x+this.s/2, this.lowerY); 
        ctx.lineTo(this.x-this.s/2, this.lowerY); 
        ctx.lineTo(this.x-this.s, this.y); 
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    
}
function rowBind(row){
    return Math.min(numberOfRows - 1, Math.max(0, (row)));
}
function columnBind(col){
    return Math.min(numberOfColumns - 1, Math.max(0, (col)));
}
Hex.findHex = function(rx, ry){
    var x = absX(rx);
    var y = absY(ry);
    var pos = {x:x, y:y};
    //find which 2 rows and columns it has to be in, check which center is closest
    var approximateColumn = (x-sideLength-mapLeftOffset)/(sideLength*3/2);
    var minColumn = columnBind(Math.floor(approximateColumn))
    var maxColumn = columnBind(Math.ceil(approximateColumn));
    
    var approximateRow = (y - Math.sqrt(3)/2*sideLength - mapTopOffset)/(Math.sqrt(3)*sideLength);
    var minRow = rowBind(Math.floor(approximateRow));
    var maxRow = rowBind(Math.ceil(approximateRow));
    
    //console.log([approximateRow, approximateColumn]);
    
    var hex1 = hexes[minRow][minColumn];
    var hex2 = hexes[minRow][maxColumn];
    var hex3 = hexes[maxRow][minColumn];
    var hex4 = hexes[maxRow][maxColumn];
    
    if(hex1.pointIsInside(pos))return hex1;
    if(hex2.pointIsInside(pos))return hex2;
    if(hex3.pointIsInside(pos))return hex3;
    if(hex4.pointIsInside(pos))return hex4;
    
    return false;
}