var namespace;
var playerX = 100;
var playerY = 100;

module.exports = function(req, res, server){
    server.defaultTunnel(req, res, "/live/");
};

module.exports.needsToInit = true;

module.exports.init = function(server){
    
    console.error("INITIALIZING LIVE");
    module.exports.needsToInit = false;
    
    namespace = server.io.of("/live");
    
    namespace.on("connection", function(socket){
        socket.emit("status", {x:1, y:1});
        socket.on("jump", function(data){
            playerY += 100;
            socket.emit("jump", {});
        });
    });
    
    setInterval(function(){
        tick();
        namespace.emit("status", {x: playerX, y:playerY});
    }, 200);
    
};

function tick(){
    if(playerX > 500)playerX = 100;
    playerX++;
    if(playerY > 100)playerY--;
}