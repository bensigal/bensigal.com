var keyboard = {};

var motionMagnitude = 0.015;
var maxSpeed        = 0.08;
var friction        = 0.95;

var leftMoveVector  = new THREE.Vector3( -motionMagnitude, 0, 0);
var rightMoveVector = new THREE.Vector3( motionMagnitude , 0, 0);

var upMoveVector    = new THREE.Vector3(0, 0, -motionMagnitude);
var downMoveVector  = new THREE.Vector3(0, 0, motionMagnitude );

var bounceXVector = new THREE.Vector3(-1, 0, 1);
var bounceZVector = new THREE.Vector3(1, 0, -1);

function createPlayer(){
    
    var player = new THREE.Mesh(
        new THREE.SphereGeometry(0.5,64,64),
        new THREE.MeshLambertMaterial({color: "#FF0000"})
    );
    player.position.y = 0.5;
    player.position.z = -1;
    player.xVel = 0;
    player.zVel = 0;
    
    player.velocity = new THREE.Vector3();
    
    player.raycasters = [];
    for(var i = 0; i < Math.PI * 2; i += Math.PI / 8){
        
        player.raycasters.push(new THREE.Raycaster(player.position, new THREE.Vector3(Math.sin(i), 0, Math.cos(i)), 0, 0.52));
        
    }
    player.hit = -1;
    
    player.tick = function(){
        
        if(this.hit > 0){
            this.position.z -= 0.5;
            return;
        }
        
        if(keyboard.left){
            this.velocity.add(leftMoveVector);
        }
        if(keyboard.right){
            this.velocity.add(rightMoveVector);
        }
        if(keyboard.up){
            this.velocity.add(upMoveVector);
        }
        if(keyboard.down){
            this.velocity.add(downMoveVector);
        }
        
        if(this.velocity.length() > maxSpeed){
            this.velocity.setLength(maxSpeed);
        }
        
        this.velocity.setLength(this.velocity.length()*friction)
        
        this.position.add(this.velocity)
        
        if(this.position.x > 5 * Math.sqrt(2) - 0.5){
            this.position.x = 5 * Math.sqrt(2) - 0.5;
            this.velocity.multiply(bounceXVector);
        }
        if(this.position.x < -5 * Math.sqrt(2) + 0.5){
            this.position.x = -5 * Math.sqrt(2) + 0.5;
            this.velocity.multiply(bounceXVector);
        }
        
        if(this.position.z > -0.5){
            this.position.z = -0.5;
            this.velocity.multiply(bounceZVector);
        }
        if(this.position.z < -19.5){
            this.position.z = -19.5;
            this.velocity.multiply(bounceZVector);
        }
        
        var hitThisRound = false;
        
        this.raycasters.forEach(function(raycaster){
            raycaster.set(this.position, raycaster.ray.direction)
            cubes.forEach(function(cube){
                hitThisRound = hitThisRound || Boolean(raycaster.intersectObject(cube).length)
            });
        }, this);   
        if(hitThisRound){
            this.hit++;
        }
    }
    return player;
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
    case 32:
        location.reload();
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
    }
});