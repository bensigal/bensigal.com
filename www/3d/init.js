var player, cubes, scene, renderer, ticks, cubes, boundaries, score = 0;

$(function(){
    
    prepareScreen();
    
    player = createPlayer();
    scene.add(player);
	
	cubes = createCubeArray();
	cubes.forEach(function(cube){
	    scene.add(cube);
	});
	
	boundaries = createBoundaries();
	boundaries.forEach(function(boundary){
	    scene.add(boundary);
	});
	
	var render = function () {
		requestAnimationFrame( render );
		ticks++;
		cubeSpeed = Math.sqrt(ticks/10000) + 0.01
		
		player.tick();
		
		cubes.forEach(function(cube){
		    cube.tick();
		});
		
		if(cubesMoving){
		    score++;
		}
		drawScore(score);
		
		renderer.render(scene, camera);
	};
	
	var size = 10;
    var step = 1;
    /*
    var gridHelper = new THREE.GridHelper( 10, 1 );
    gridHelper.position.set(0, 0.01, -10)
    scene.add( gridHelper );
	*/
	setTimeout(render, 1000);
});

function prepareScreen(){
    scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 );
	
	renderer = new THREE.WebGLRenderer();
	
	renderer.setSize( 800, 600 );
	$("body").append( renderer.domElement );
    
    ticks = 0;
	
	directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); 
    directionalLight.position.set(-20, 50, -20); 
    scene.add(directionalLight); 
    
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    
    camera.position.y = 6;
    camera.position.z = 4.5;
    camera.rotation.x = -Math.PI/8;
}