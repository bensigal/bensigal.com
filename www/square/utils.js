function mouseIsInBoard(){
    return(
        mouse.x > toRx(0) &&
        mouse.y > toRy(0) &&
        mouse.x < 600 &&
        mouse.x < toAx(1200) &&
        mouse.y < toAx(600)
    );
}

function findSquareUnderMouse(){
    
    var x = toAx(mouse.x);
    var y = toAy(mouse.y);
    
    return squares[rowBind(Math.floor(y/30))][colBind(Math.floor(x/30))]
    
}

function rowBind(row){
    return Math.min(19, Math.max(0, row));
}
function colBind(col){
    return Math.min(39, Math.max(0, col));
}

function solidBordersBetween(x1, y1, x2, y2, color){
    var allBorders = bordersBetween(x1, y1, x2, y2);
    console.log(allBorders);
    var results = [];
    allBorders.forEach(function(border){
        if(border.solid){
            results.push(border);
            if(color){
                border.color = color
            }
        }
    });
    return results;
}
//Note that corners are considered part of both barriers!
//color, if specified, sets color attribute of all selected borders
function bordersBetween(x1, y1, x2, y2, color){
    var lowX = Math.min(x1, x2);
    var highX = Math.max(x1, x2);
    
    var lowY = Math.min(y1, y2);
    var highY = Math.max(y1, y2);
    
    //y paired with lower x
    var lowPairedY = lowX==x1?y1:y2;
    //X paired with lower y
    var lowPairedX = lowY==y1?x1:x2;
    
    var slope = (y2 - y1)/(x2 - x1);
    if(highX == lowX)slope = Infinity;
    
    var results = [];
    
    //Verticals
    //Go through each vertical
    for(let x = Math.ceil(lowX/30)*30; x <= highX; x+=30){
        //rise = m*run
        let y = lowPairedY + slope * (x-lowX);
        results.push(verticals[Math.floor(y/30)][x/30]);
        if(y%30 === 0 && y > 0){
            results.push(verticals[y/30-1][x/30]);
        }
    }
    //horizontals
    for(let y = Math.ceil(lowY/30)*30; y <= highY; y+=30){
        //run = rise/m
        let x = lowPairedX + (y-lowY) / slope;
        /*console.log({
            y:y,
            x:x,
            slope:slope,
            lowY:lowY,
            lowPairedX:lowPairedX
        })*/
        results.push(horizontals[y/30][Math.floor(x/30)]);
        if(x%30 === 0 && x > 0){
            results.push(horizontals[y/30][x/30-1]);
        }
    }
    if(color)results.forEach(function(result){
        result.color = color;
    })
    return results;
}

function toRx(x){
    return x/zoomLevel - cameraOffsetLeft;
}
function toRy(y){
    return y/zoomLevel - cameraOffsetTop;
}
function toAx(rx){
    return (rx+cameraOffsetLeft)*zoomLevel;
}
function toAy(ry){
    return (ry+cameraOffsetTop)*zoomLevel;
}

$(document).keydown(function(e){
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
        keyboard.s=true;
        break;
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
        keyboard.s=false;
        break;
    }
});