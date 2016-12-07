module.exports = function(server, req, res){
    if(!req.on){
        server.redirect("login?"+req.path);
    }
}