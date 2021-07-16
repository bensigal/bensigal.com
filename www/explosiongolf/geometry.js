//Do the two rectangles intersect?
function rectangularCollisionTest(a,b){
    
    var al = a.x;
    var ar = a.x+a.w;
    var at = a.y;
    var ab = a.y+a.h;
    
    var bl = b.x;
    var br = b.x+b.w;
    var bt = b.y;
    var bb = b.y+b.h;
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    );
}

//Probably hugely inefficient, couldn't think of an easier way to do it
function pointDistanceFromLine(px,py,lx1,ly1,lx2,ly2){
    var lineSlope = (ly2-ly1)/(lx2-lx1);
    
    // y - y1 = m(x - x1)
    // y = mx - mx1 + y1
    //when x=0, y=-mx1+y1
    
    //Where the given line intersects the y axis
    var lineYInt = -lineSlope * lx1 + ly1;
    
    //Slope of any line perpendicular to given
    var perpendicularSlope = -1/lineSlope;
    
    //Where the y-intercepts are of the lines that go through the two given endpoints and are perpendicular to the given line.
    var perpindicularYInt1 = -perpendicularSlope * lx1 + ly1;
    var perpindicularYInt2 = -perpendicularSlope * lx2 + ly2;
    
    //Which is bigger and smaller
    var maxPerpendicularYInt = Math.max(perpindicularYInt1, perpindicularYInt2);
    var minPerpendicularYInt = Math.min(perpindicularYInt1, perpindicularYInt2);
    
    //The y-intercept of the line perpendicular to given, through point
    var pointPerpendicularYInt = -perpendicularSlope * px + py;
    
    if(pointPerpendicularYInt > maxPerpendicularYInt || pointPerpendicularYInt < minPerpendicularYInt){
        //the perpendicular through the given point does not go through the given line
        return false;
    }
    //Intersection of point's 
    //y= (mPerp)x+(pointPerpendicularYInt)
    //y= (m)x+(lineYInt)
    //(m)x + lineYInt = (mPerp)x + (pointPerpendicularYInt)
    //mx-mPerpx = pointPerpendicularYInt - lineYInt
    //x = (pointPerpendicularYInt-lineYInt)/((m)-(mPerp))
    //y = (m)x + lineYInt
    var intersectionX = (pointPerpendicularYInt-lineYInt)/(lineSlope - perpendicularSlope);
    var intersectionY = lineSlope*intersectionX + lineYInt;
    //By perpendicular bisector theorem or  something like that, intersection is closest point on line to given point
    //console.log(distance(intersectionX, intersectionY, px, py))
    return distance(intersectionX, intersectionY, px, py);
}

//Is point within <tolerance> pixels of the line?
function pointLineCollision(px,py,lx1,ly1,lx2,ly2,tolerance){
    var result = pointDistanceFromLine(px,py,lx1,ly1,lx2,ly2);
    if(result === false)return false;
    return result < tolerance;
}

function angleFrom(item1, item2){
    return Math.atan2(item2.y - item1.y, item2.x - item1.x);
}

function distance(x1,y1,x2,y2){
    if(x2 === undefined){
        return Math.sqrt((x1.x-y1.x)*(x1.x-y1.x)+(x1.y-y1.y)*(x1.y-y1.y))
    }
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}