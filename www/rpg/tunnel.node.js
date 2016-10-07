module.exports = function(req, res, server){
    console.log("At custom /rpg/ tunnel");
    server.defaultTunnel(req, res, "/rpg/", {
        links:{
            about: "about.html",
            meetings: "meetings.html",
            staff: "staff.html"
        }
    })
}