board = {};
fs = require('fs');
module.exports = function(req, res, server, whereis){
    switch(req.path.split("/")[2]){
    case "get":
        return JSON.stringify(board);
    case "reload":
        fs.readFile(server.root+"www/hex/board.json", function(err, data){
            board = JSON.parse(data);
            server.sendString(data, req, res);
        })
    default:
        server.defaultTunnel(req, res, whereis);
    }
};
module.exports.init = function(server){
    fs.readFile(server.root+"www/hex/board.json", function(err, data){
        board = JSON.parse(data);
    });
};