var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var cubeSpeed = 0.1
var material = new THREE.MeshLambertMaterial({color: "#FFFF00"})
var textureLoader = new THREE.TextureLoader();

var tntTop = new THREE.MeshBasicMaterial({map:textureLoader.load("/3d/images/tntTop.png")});
var tntBottom = new THREE.MeshBasicMaterial({map:textureLoader.load("/3d/images/tntBottom.png")});
var tntSide = new THREE.MeshBasicMaterial({map:textureLoader.load("/3d/images/tntSide.png")});
var tntMaterials = [
    tntSide,
    tntSide,
    tntTop,
    tntBottom,
    tntSide,
    tntSide,
]

var updatedMaterial = new THREE.MeshFaceMaterial(tntMaterials);

function createCube(x){
    
    var cube = new THREE.Mesh(geometry, updatedMaterial);
    
    cube.position.set(x, 0.5, -20)
    cube.rotation.y = Math.random();
    cube.tick = cubeTick;
    
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
    if(this.position.y > 0.5){
        this.position.y -= 0.125
    }else{
        this.position.z += cubeSpeed;
    }
    
    if(this.position.z > 3){
        this.position.z = -20;
        this.position.x = Math.sqrt(2) * (Math.floor(Math.random()*10) - 5)
        this.position.y = 15;
    }
}