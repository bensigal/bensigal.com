module.exports = function(req, res, server){
    if(req.path.match(/\/login\/?$/)){
        server.getFile("login/index.html", req, res);
    }else{
        server.showErrorPage(404, req, res);
    }
}