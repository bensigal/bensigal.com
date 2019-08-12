var fs = require("fs");

module.exports=function(req,res,server){
	if(/list/.test(req.path)){
		fs.readdir("/home/bensigal/www/courseplanner/plans", function(err, files){
		    if(err){
		        console.error(err.message + err.stacktrace);
		        return server.showErrorPage(500, req, res);
		    }
		    files.forEach(function(element, index){
		        files[index] = element.substring(0, element.indexOf(".courseplanner"));
		    });
		    server.sendString(files.join(","), req, res);
		});
	}else{
		server.defaultTunnel(req,res, "/courseplanner/");
	}
};