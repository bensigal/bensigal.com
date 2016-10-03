module.exports = function(req, res, server){
    console.log("At custom /rpg/ tunnel");
    server.defaultTunnel(req, res, "/rpg/", {
        links:{
            style: "style.css"
        }
    })
}