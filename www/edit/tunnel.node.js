//EDIT TUNNEL
module.exports=function(req,res,server){
	if(!req.session.on){
		req.log("Not logged in. Sending login page.");
		server.redirect("login?edit",req,res);
	}else if(/(ugly|contextMenu)\.css/.test(req.path)){
		server.getFile(req.path,req,res);
	}else if(/(editor|serverManagement|userManagement|contextMenu)\.js$/.test(req.path)){
		server.getFile(req.path,req,res);
	}else if(/\/edit\/?$/.test(req.path)){
		server.getFile("edit/index.html",req,res);
	}else{
		req.log("File not found.");
		server.showErrorPage(404,req,res);
	}
}