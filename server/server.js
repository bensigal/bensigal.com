//Required modules
var http 	= require('http');
var fs   	= require('fs');
var url  	= require('url');
var qs 	 	= require('querystring');
var mime 	= require('mime');
var multiparty 	= require('multiparty');
var util      	= require('util');

//To make it easier to read console output.
var numberOfRequests = 0;
//Pseudorandom hex strings. 48 bytes of value, but more in string form.
var sessionIds= [];
//Objects. Associated array with sessionIds
var sessions  = [];
//Given to tunnels
var serverInfo = {};
//Location of localhost, which is parent of www and server, folder.
var root = process.argv[2];
//Time of start of execution
var startTime = new Date().getTime();

//Respond to a request.
function prepareLogs(req, res){
	req.serverOrder = numberOfRequests++;
	console.log("Request "+req.serverOrder+" recieved: "+req.url)
	req.logLocation = root+"server/logs/"+startTime+"/"+req.serverOrder+"/";
	fs.mkdir(req.logLocation,function(err){
		if(err) throw err;
		fs.writeFile(req.logLocation+"headers.log",benSpect(req.headers),function(err){
			if(err) throw err;
			req.logBody="";
			req.log=function(next,noNewLine){
				next=next||"";
				req.logBody+=next;
				if(!noNewLine){
					req.logBody+="\r\n";
				}
			};
			req.err=function(next){
				req.log(next);
				console.error(req.serverOrder+":"+next);
			};
			res.on('finish',function(){
				fs.writeFile(req.logLocation+"main.log",req.logBody,function(err){
					if(err) throw err;
				});
			});
			serverRespond(req,res);
		});
	});
}
function serverRespond(req, res){
	
	req.path=url.parse(req.url).pathname;
	if(req.path=="/index.html.var"){//Proxy index from .htaccess
		req.path="/"
	}
	req.log(req.path);
	
	req.cookies=parseCookies(req);
	var index = sessionIds.indexOf(req.cookies.sessid);
	
	if(req.cookies.sessid&&index!=-1){
		req.log("\nSession found.");
		req.session=sessions[index];
		req.log(benSpect(req.session));
	}else{
		req.log("\nNo session found. Sending cookie header.")
		req.session=new Session();
		res.setHeader('Set-Cookie','sessid='+req.session.id);
	}
	req.log();
	if(req.method=="POST"){
		//If there is no data...
		if(!req.headers["content-type"] || !(Number(req.headers["content-length"]))){
			req.method = "GET";
		}
		//If there is data, and it's multipart
		else if(req.headers["content-type"].startsWith("multipart/form-data")){
			req.log("POST multipart/form-data")
			req.log("Waiting for body before sending through tunnel...")
			new multiparty.Form().parse(req,function(err,fields,files){
				if(err){
					req.err(err.stack);
					showErrorPage(500, req, res);
					return;
				}
				req.files=files;
				fs.writeFile(req.logLocation+"files.log",benSpect(files),function(err){
					if(err) throw err;
				});
				req.post=fields;
				fs.writeFile(req.logLocation+"fields.log",benSpect(fields),function(err){
					if(err) throw err;
				});
				req.log(req.post);
				sendThroughTunnel(req,res,"/");
			});
		}else{
			var body = "";
			req.on('data', function(data){
				body+=data;
				if(body.length > 1e6){
					showErrorPage(413, req, res);
				}
			});
			req.on('end',function(){
				fs.writeFile(req.logLocation+"body.log",function(err){
					if(err) throw err;
				});
				req.log(body);
				req.post=qs.parse(body);
				sendThroughTunnel(req,res,"/")
			});
			req.log("POST, not multipart. Assuming querystring. Actual: "+req.headers["content-type"])
			req.log("Waiting for body before sending through tunnel...")
		}
	}
	if(req.method!="POST"){
		req.log(req.method);
		sendThroughTunnel(req,res,"/")
	}
}
//What to do when encountering a folder without a "tunnel.node.js" file.
function defaultTunnel(req, res, whereis, indexFile){
	
	indexFile=indexFile||"index.html";

	req.log("At default tunnel at "+whereis);
	fs.stat("www"+whereis,function(err,stat){
		//File Not Found
		if(err&&err.code=="ENOENT"){
			req.log("Location of current tunnel not found.");
			showErrorPage(404, req, res);
			return;
		}else if (err){
			req.err("Error finding current location.");
			req.err(e.stack);
			showErrorPage(500);
			return;
		}
		
		//If there is obviously another folder to go through...
		if(countSlashes(req.path)>countSlashes(whereis)){
			
			relativeUrl=req.path.substring(whereis.length);
			nextDir = relativeUrl.substring(0,relativeUrl.indexOf("/")+1);
			//Go through the next folder's tunnel.
			req.log("Found another supposed folder. Sending through tunnel.")
			sendThroughTunnel(req, res, whereis+nextDir);
		//If this is the requested destination...
		}else if(req.path==whereis){
			req.log("Current location is request. Sending index file.");
			//Show index file, or, if id does not exist, show 403
			getFile(req.path+indexFile, req, res, ()=>showErrorPage(403, req, res));		
		//There is another thing, but just one. Example: Request is /meep/hi, 
		//	Current directory is /meep/
		}else{
			
			req.log("Searching for "+req.path);
			
			fs.stat("www"+req.path,function statCallback(err,stats){
				if(err&&err.code=="ENOENT"){
					showErrorPage(404, req, res);
				}else if(err){
					req.err(err.stack);
					showErrorPage(500, req, res);
				}else if(stats.isDirectory()){
					//This is a directory. Send to its tunnel, add a slash to make clear to
					//tunnel is a directory to speed things up a bit.
					req.path=req.path+"/";
			        req.url = req.url+"/";
					req.log("Found directory");
					sendThroughTunnel(req, res, req.path);				
				}else if(req.path.endsWith(".node.js")){
					req.log("Node js file found.");
					//TODO require("www"+req.path)(req,res);
				}else{

					getFile(req.path, req, res);
				}
			});
		}
	});
}

var supportedErrorCodes = [401,403,404,405,500];
var messages = [
	"Authorization Required",
	"Forbidden",
	"File Not Found",
	"Method Not Allowed",
	"Internal Server Error"
];

function showErrorPage(errorCode, req, res, showAsText){
	req.log("Showing error "+errorCode);
	res.statusCode=errorCode;
	if(!showAsText && supportedErrorCodes.indexOf(errorCode)>=0){
		fs.readFile("www/"+errorCode+".shtml",function readErrorPageCallback(err, data){
			if(err){
				req.err(err.stack);
				data="Error "+errorCode+"<br>Also, 404 error trying to find"+
					" the error page.";
			}
			res.setHeader('Content-Type',"text/html");
			res.setHeader('Content-Length',data.length);
			res.end(data);
		});
	}else if(showAsText=="INFO" || !showAsText){
		res.end("Error "+errorCode);
	}else{
		req.err("Unknown showAsText value.");
		showErrorPage(500,req,res);
	}
}

function getFile(path,req,res,options){
	options=options||{};
	req.log("Sending "+path+" with options "+benSpect(options));
	
	if(!options.pathNotFromWww)
		path=root+"www/"+path;
	
	fs.readFile(path, options.encoding||null, function readFileCallback(err, data){
		req.log(benSpect(data));
		if(err && err.code=="ENOENT"){
			req.log("File not found.")
			if(options.notFoundCallback){
				req.log("Executing special callback.");
				options.notFoundCallback();
			}else{
				req.log("Showing 404 page.");
				showErrorPage(404, req, res);
			}
		}else if(err){
			req.err(err.stack);
			showErrorPage(500, req, res);
		}else{
			res.setHeader('Content-Length',data.length);
			res.setHeader('Content-Type'    ,
				options.encoding=="binary"?"application/octet-stream":mime.lookup(path)
			);
			if(options.cookie)
				res.setHeader('Set-Cookie',options.cookieName+'='+options.cookie+";");
			res.statusCode=options.statusCode||200;
			res.end(data);
		}
	});
}
function sendString(output, req, res,options){
	options=options||{};
	req.log("Sending string data.");
	fs.writeFile(req.logLocation+"responseText.log",output,function(err){
		if(err)req.err(err)
	});
	res.setHeader('Content-Length',output.length);
	res.setHeader('Content-Type',options.contentType||"text/plain");
	res.statusCode=options.statusCode||200;
	res.end(output);
}
function redirect(path, req, res, options){
	if(typeof options == "number")options = {statusCode: options};
	options = options || {};
	options.statusCode = options.statusCode || 302;
	
	res.writeHead(options.statusCode, {Location: path});
	res.end();
}
function sendThroughTunnel(req, res, path){
	req.log("Sending through tunnel "+path);
	try{
		var nextTunnel = require(root+"www"+path+"tunnel.node.js");
	}catch(e){
		if(e.code=="MODULE_NOT_FOUND"){
			req.log("Tunnel not found at "+root+"www"+path+"tunnel.node.js");
		}else{
			req.err("Error in tunnel initialization."); 
			req.err(e.stack);
			showErrorPage(500, req, res);
			return;
		}
		defaultTunnel(req, res, path);
		return;

	}
	if(typeof nextTunnel == "function"){
	
		try{
			var tunnelResponse = nextTunnel(req, res, serverInfo, path);
		}catch(e){
			req.err("Error in tunnel execution.");
			req.err(e.stack);
			showErrorPage(500, req, res);
			return;
		}
		
		if(typeof tunnelResponse == "string"){
			req.log("Detected output from tunnel; sending as plain text.");
			sendString(tunnelResponse, req, res);
		}
		
	}else{
		defaultTunnel(req,res,path);
	}
}
function countSlashes(input){
	return (input.match(/\/.?/g)||[]).length //.? at end of regex is to stop syntax highlight from reading comment.
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

//Constructor for a session. Has a property id, which is pushed into sessionIds, and 
//the session is pushed into sessions. Other data should be added dynamically.
var Session = function(id){
	this.id=id||require('crypto').randomBytes(48).toString('hex')
	sessionIds.push(this.id);
	sessions.push(this);
}

var supportedErrorCodes = [401,403,404,405,500];
var messages = [
	"No Authorization",
	"Forbidden",
	"File Not Found",
	"Method Not Allowed",
	"Internal Server Error"
];
//Log folder, actually start server.
fs.mkdir("server/logs/"+startTime,function(err){
	if(err) throw err;
	http.createServer(prepareLogs).listen(8000, function(){
		console.log("Server listening on localhost:8000! Let's serve some files!");
	});
});
function benSpect(obj){
	return util.inspect(obj,{depth:null});
}
function exportRefs(){
	for(var i = 0; i < arguments.length; i+=2){
		serverInfo[arguments[i]]=arguments[i+1];
	}
}
exportRefs(
	"showErrorPage",	showErrorPage,
	"defaultTunnel",	defaultTunnel,
	"getFile",		getFile,
	"process",		process,
	"sendString",		sendString,
	"root",			root,
	"supportedErrorCodes",	supportedErrorCodes,
	"messages",		messages,
	"parseCookies",		parseCookies,
	"countSlashes",		countSlashes,
	"sessions",		sessions,
	"sessionIds",		sessionIds,
	"Session",		Session,
	"startTime",		startTime,
	"redirect",		redirect
);