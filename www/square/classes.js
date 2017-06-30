class Button{
    
    constructor(x, y, w, h, text, onClick){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.onClick = onClick;
    }
    
    draw(){
        ctx.fillStyle = "#DDD";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.x+this.w/2, this.y+this.h/2);
    }
    
    mouseIsInside(){
        return (
            mouse.x > this.x &&
            mouse.y > this.y &&
            mouse.x < this.x + this.w &&
            mouse.y < this.y + this.h
        );
    }
    
}

class Border{
    
    constructor(vertical, row, col){
        this.vertical = vertical//boolean if is a vertical border
        this.row = row;
        this.col = col;
        this.x = this.col * 30;
        this.y = this.row * 30;
        this.color = "#ACF";
        this.solid = false;
    }
    
    draw(){
        var rx = toRx(this.x);
        var ry = toRy(this.y);
        var rSideDiff = 30/zoomLevel;
        ctx.fillStyle = this.color;
        if(this.vertical){
            ctx.fillRect(rx, ry, 1, rSideDiff);
        }else{
            ctx.fillRect(rx, ry, rSideDiff, 1);
        }
    }
    
}

class SolidBorder extends Border{
    
    constructor(vertical, row, col){
        super(vertical, row, col);
        this.solid = true;
        this.color = "black";
    }
    
}

class Square{
    
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.y = this.row * 30;
        this.x = this.col * 30;
        this.color = "#F5F5F5"
        this.underMouseColor = "#E0E0E0"
        this.underMouse = false;
    }
    
    draw(){
        var rx = toRx(this.x);
        var ry = toRy(this.y);
        var rSideDiff = 30/zoomLevel;
        /* draw borders
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx+rSideDiff, ry);
        ctx.lineTo(rx+rSideDiff, ry+rSideDiff);
        ctx.lineTo(rx, ry+rSideDiff);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.closePath();
        */
        ctx.fillStyle = this.underMouse?this.underMouseColor:this.color;
        ctx.fillRect(rx, ry, rSideDiff, rSideDiff);
        this.underMouse = false;
    }
    
    click(){
        if(selection){
            
            bordersBetween(this.x + 15, this.y + 15, selection.x + 15, selection.y + 15, "green");
            solidBordersBetween(this.x + 15, this.y + 15, selection.x + 15, selection.y + 15, "red");
            
            this.color = "black";
            this.underMouseColor = "black";
            
            miscSprites.push({
                draw: function(){
                    ctx.strokeStyle = "red";
                    ctx.beginPath();
                    ctx.moveTo(this.x1, this.y1);
                    ctx.lineTo(this.x2, this.y2);
                    ctx.closePath();
                    ctx.stroke();
                },
                x1: this.x + 15,
                y1: this.y + 15,
                x2: selection.x + 15,
                y2: selection.y + 15
            })
            console.log(this);
            console.log(selection);
            selection = false;
        }else{
            selection = this;
            this.color = "#000";
            this.underMouseColor = "#000";
        }
    }
    
}