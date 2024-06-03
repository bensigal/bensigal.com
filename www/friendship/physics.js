//sets up stuff idk
const { World } = pl;
var Vec2 = pl.Vec2;

const world = new World();

//Starts the playspace
function startPlaySpace(){    
    // Defines the upper limit of the play space within the canvas
    const TopBarBuffer = 135;

    // Creates the playspace body which is later to be comprised of wall fixtures
    var playspace = world.createBody();

    //Walls Positions
    var topWall = pl.Edge(Vec2(0.0, 0.0 + TopBarBuffer), Vec2(800.0, 0 + TopBarBuffer));
    var bottomWall = pl.Edge(Vec2(0.0, 470.0 + TopBarBuffer), Vec2(800.0, 470.0 + TopBarBuffer));
    var leftWall = pl.Edge(Vec2(0.0, 0.0  + TopBarBuffer), Vec2(0.0, 470.0 + TopBarBuffer));
    var rightWall = pl.Edge(Vec2(800.0, 0.0 + TopBarBuffer), Vec2(800.0, 470.0 + TopBarBuffer));

    //Adds wall fixtures to the placespace body
    playspace.createFixture(topWall, 0);
    playspace.createFixture(bottomWall, 0);
    playspace.createFixture(leftWall, 0);
    playspace.createFixture(rightWall, 0);

    return playspace
}


//Makes the golf ball
function startBall(ballStartPosition){
    const BallRadius = 20;
    var ballBodyDef = {
      bullet : true,
      position : ballStartPosition,
      type : 'dynamic',
      allowSleep : false,
      bullet: true,
      linearDamping : 0.1,
      angularDamping : 1.6
    };
    var ballFixtureDef ={
        friction: 1,
        restitution: .99,
        density: .001,
    };
    
    var ball = world.createDynamicBody(ballBodyDef).createFixture(pl.Circle(BallRadius),ballFixtureDef);
    return ball
    }  