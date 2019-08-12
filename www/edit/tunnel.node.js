//EDIT TUNNEL
module.exports=function(req,res,server){
	if(!req.session.on){
		req.log("Not logged in. Sending login page.");
		server.redirect("/login?edit",req,res);
	}else{
		server.defaultTunnel(req,res,"/edit/");
	}
}