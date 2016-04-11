module.exports = function(req, res, server){
	
	if(!req.session.on){
		return server.redirect("/login?coup",req,res);
	}
	//Main Page
	if(/coup\/?/.test(req.path)){
		server.getFile("coup/index.html",req,res);
	}
}