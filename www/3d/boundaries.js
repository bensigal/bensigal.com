//var geometry = new THREE.BoxGeometry( 1, 1, 1 );

function createBoundaries(){
    var floorTexture = new THREE.TextureLoader().load("/3d/images/iceTexture.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(16,16);

    var material = new THREE.MeshLambertMaterial({map:floorTexture})
    
    var floor = new THREE.Mesh(
        new THREE.BoxGeometry(Math.sqrt(2)*10, 1, 20),
        material
    );
    floor.position.y = -0.5;
    floor.position.z = -10
    
    var leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 20),
        material
    );
    leftWall.position.set(-5*Math.sqrt(2) - 0.5, 2, -10)
    
    var rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 20),
        material
    );
    rightWall.position.set(5*Math.sqrt(2) + 0.5, 2, -10)
    
    boundaries = [floor, leftWall, rightWall]
    return boundaries;
}