var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var cubeSpeed = 0.1
var cubesMoving = true;

var textureLoader = new THREE.TextureLoader();

var tntTop = new THREE.MeshLambertMaterial({map:textureLoader.load("/3d/images/tntTop.png")});
var tntBottom = new THREE.MeshLambertMaterial({map:textureLoader.load("/3d/images/tntBottom.png")});
var tntSide = new THREE.MeshLambertMaterial({map:textureLoader.load("/3d/images/tntSide.png")});
var tntMaterials = [
    tntSide,
    tntSide,
    tntTop,
    tntBottom,
    tntSide,
    tntSide,
]

var tntMaterial = new THREE.MeshFaceMaterial(tntMaterials);

function createCube(x){
    
    var cube = new THREE.Mesh(geometry, tntMaterial);
    
    cube.position.set(x, 0.5, -20)
    cube.rotation.y = Math.random();
    cube.tick = cubeTick;
    cube.tntTicks = 0;
    cube.tntTotalTicks = 0;
    return cube;
    
}

function createCubeArray(){
	
	var cubes = [];
	
    for(var i = -4.5; i <= 4.5; i++){
        cubes.push(createCube(i*Math.sqrt(2)));
	}
	cubes.forEach(function(cube, index){
        cube.position.setZ(
            index*20/4.5 - 50
        )
	})
	
	return cubes;
	
}
function cubeTick(){
    
    this.rotation.y += 3/60;
    if(cubesMoving && this.position.y == 0.5){
        this.position.z += cubeSpeed;
    }else if(this.hitPlayer){
        this.tntTotalTicks++;
        this.tntTicks+=0.05;
        this.tntTicks%=2;
        var emissiveness = this.tntTicks > 1?  2 - this.tntTicks : this.tntTicks;
        emissiveness *= 3/4
        var emissiveColor = new THREE.Color(emissiveness,emissiveness,emissiveness);
        tntTop.emissive = emissiveColor;
        tntSide.emissive = emissiveColor;
        tntBottom.emissive = emissiveColor;
        if(this.tntTotalTicks > 120){
            this.tntTicks = 0;
            boundaries.forEach(function(boundary){
                boundary.position.y -= 2;
            });
            cubes.forEach(function(cube){
                if(!cube.velocity){
                    var angle = Math.random() * 2 * Math.PI;
                    cube.velocity = new THREE.Vector3(Math.sin(angle),1,Math.cos(angle)).setLength(1/2);
                }
                cube.position.add(cube.velocity);
            })
            player.getWrecked = (new THREE.Vector3(0,0,0)).subVectors(player.position, this.position).normalize();
        }
        return;
    }
    if(this.position.y > 0.5){
        this.position.y -= 0.125
    }
    
    if(this.position.z > 3){
        this.position.z = -20;
        this.position.x = Math.sqrt(2) * (Math.floor(Math.random()*10) - 5)
        this.position.y = 15;
    }
}