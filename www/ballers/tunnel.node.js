//Lib to access files
var fs = require('fs');

//Called whenever a file is accessed
module.exports = function(req, res, server){
    //Switch based off whatever comes after /explosiongolf/, until the next slash
    switch(req.path.split("/")[2]){
    default:
        server.defaultTunnel(req, res, "/ballers/");
        break;
    }
    
};

//Called the first time the folder is opened
module.exports.init = function(serverInfo){
    
};
