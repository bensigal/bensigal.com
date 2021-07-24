//Do the two rectangles intersect?
function rectangularCollisionTest(a,b){
    
    var al = a.pos.x;
    var ar = a.pos.x+a.w;
    var at = a.pos.y;
    var ab = a.pos.y+a.h;
    
    var bl = b.pos.x;
    var br = b.pos.x+b.w;
    var bt = b.pos.y;
    var bb = b.pos.y+b.h;
    
    return !(
        al > br ||
        ar < bl ||
        at > bb ||
        ab < bt
    );
}

//Returns the distance from point to the line that goes through the endpoints.
//If the shortest distance to the line leads to a point not between the endpoints,
//returns false.
function perpendicularDistance(point, endpoint1, endpoint2){

    //unit vector parallel to the line, from 1 to 2
    var parallelUnit = endpoint2.minus(endpoint1).unit();
    //unit vector perpendicular to line
    var perpUnit = new Vector(1, endpoint1.angleTo(endpoint2) + Math.PI/2);

    //Distance of point's projection from endpoint1 towards endpoint2
    var parallelDistance = parallelUnit.dot(point.minus(endpoint1));
    //Perpendicular line does not go between endpoints
    if(parallelDistance < 0 || parallelDistance > endpoint1.distanceTo(endpoint2)){
        return false;
    }

    //Projection of the distance between endpoint1 and point onto perpendicular vector
    return Math.abs(perpUnit.dot(point.minus(endpoint1)));

}

function collidesWithMinesOrCoast(obj, mineTolerance){

    mineTolerance = mineTolerance || 0;
    var collides = false;

    map.topCoast.forEach(function(point){
        if(point.distanceTo(obj.pos) < obj.r) collides = true;
    });
    if(collides) {
        return true;
    };
    map.bottomCoast.forEach(function(point){
        if(point.distanceTo(obj.pos) < obj.r) collides = true;
    });
    if(collides) {
        return true;
    };

    for(var i = 0; i < map.topCoast.length - 1; i++){
        var perpDist = perpendicularDistance(obj.pos, map.topCoast[i], map.topCoast[i+1])
        if(perpDist && perpDist < obj.r){
            return true;
        }
    }
    for(var i = 0; i < map.bottomCoast.length - 1; i++){
        var perpDist = perpendicularDistance(obj.pos, map.bottomCoast[i], map.bottomCoast[i+1])
        if(perpDist && perpDist < obj.r){
            return true;
        }
    }

    map.mines.forEach(mine => {
        if(obj.pos.distanceTo(mine.pos) < mine.r + obj.r + mineTolerance){
            collides = true;
        }
    });
    if(collides) {
        return true;
    };

    return false;

}
