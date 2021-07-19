//Reference to the HTML object.
var canvas,
//Reference to the object used to draw on the canvas
ctx, 
//how many ticks have passed
ticks, grenadeTicks,
//Space was pressed for aiming
hasStartedAiming,
//Game objects
balls, meter, hills, targetBall, nextBall, walls, map,
//Which part of the playing scene is taking place. String.
step,
//Active whoever is playing, 1 or 2
activePlayer,
//Status of each player
p1BallsLeft, p2BallsLeft,
//boolean for game mode
multiplayer,
//who won, 1 or 2
winner,
//id of online match
matchId,
//1 is always host player, 2 is joiner.
myPlayerNumber,
//String corresponding to what should be displayed
//Determines function(s) to call each tick
scene;

//Menu options
var options = [
    ["Local Multiplayer", "Host Multiplayer", "Tutorial"],
    ["Empty Field", "Cage", "Ricochet", "Narrow", "Back"]
];
//Height of dashboard above field of play
var fieldTop = 130;
//Menu status
var depth = 0, optionSelected = 0;
//Store status of mouse and which keys are down
var keyboard = {};
var mouse = {};

var p1Score = 0;
var p2Score = 0;

//Earliest time the next tick should occur, initialized to current time and incremented by 16ms every tick
var nextTick = new Date().getTime();
