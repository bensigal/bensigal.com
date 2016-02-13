module.exports=function(req,res){
	res.writeHead(302,{
		'Location':'https://server27.websitehostserver.net:2096'
	});
	res.end();
};