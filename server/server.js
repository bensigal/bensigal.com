//Required modules
var http 	= require('http');
var fs   	= require('fs');
var url  	= require('url');
var qs 	 	= require('querystring');
var mime 	= require('mime');
var multiparty 	= require('multiparty');
var util      	= require('util');

//Create server
var httpServer = http.createServer(prepareLogs);
//To make it easier to read console output.
var numberOfRequests = 0;
//Pseudorandom hex strings. 48 bytes of value, but more in string form.
var sessionIds= [];
//Objects. Associated array with sessionIds
var sessions  = [];
//Base directory of server, parent of /www and /server
var root = __filename.replace(/\\/g, "/").split("/").slice(0, -2).join("/")+"/";
console.log("Root directory: "+root);
//Given to tunnels
var serverInfo = {};
//Time of start of execution
var startTime = new Date().getTime();
//0: no logging, 1: log to console, 2: log to files
var logging = process.argv[2];

var port = Number(process.argv[3]);
if(!(port > 0)){
	throw "Did not find valid port. Arguments should be:  node <pathtofile> <logging mode> <port>";
}

//Get date and time in format yyyy-mm-dd at hhmm and ss seconds.
//Uses PDT (that's where Ben lives) even though the server is elsewhere
function formatDate(input){
	
	var month = String(input.getMonth() + 1);
	if(month.length < 2){
		month = "0" + month;
	}
	
	var date = String(input.getDate());
	if(date.length < 2){
		date = "0" + date;
	}
	
	var hour = String(input.getHours());
	if(hour.length < 2){
		hour = "0" + hour;
	}
	
	var minute = String(input.getMinutes());
	if(minute.length < 2){
		minute = "0" + minute;
	}
	
	var second = String(input.getSeconds());
	if(second.length < 2){
		second = "0" + second;
	}
	
	return input.getYear() + "-" + month + "-" + date + " at " + hour + ":" + minute + " and "+second+" seconds."

}

//Called for each request, calls serverRespond at end
//Should really be part of serverRespond
function prepareLogs(req, res){
	
	//Index of this request, starting from 0
	req.serverOrder = numberOfRequests++;
	
	if(logging == 1 || logging == 2){
		console.log("Request "+req.serverOrder+" recieved for "+req.url+", at " + formatDate(new Date()) );
	}
	
	//Create directory for logs, when ready respond to server
	if(logging == 2){
		
		req.logLocation = root+"server/logs/"+startTime+"/"+req.serverOrder+"/";
		
		fs.mkdir(req.logLocation,function(err){
			
			if(err) throw err;
			
			//Create headers.log file with the headers recieved from the client
			//if(processOptions.includes("headersLog"))
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
					if(logging)
					fs.writeFile(req.logLocation+"main.log",req.logBody,function(err){
						if(err) throw err;
					});
				});
				
				//Once the file has been created, ready to respond to request.
				serverRespond(req,res);
				
			});
		});
	}
	
	//Direct request logs to console, then respond to server
	else if(logging == 1){
		req.log = function(output){
			console.log(req.serverOrder + ":" + output);
		}
		req.err = function(output){
			console.error(req.serverOrder + ":" + output);
		}
		serverRespond(req, res);
	}
	//Ignore request logs, respond to server
	else{
	    req.log = function(){};
	    req.err = function(next){console.error(req.serverOrder+":"+next)};
	    serverRespond(req, res);
	}
}

//Get/generate the relevant files and send them back
function serverRespond(req, res){
	
	//Easier to manage URI
	req.path=url.parse(req.url).pathname.toLowerCase();
	
	//lastPath stores the last name in the path. E.g. for "one/two/three/" it has value "three"
	req.lastPath = req.path;
	while(req.lastPath.endsWith("/")) req.lastPath = req.lastPath.substring(0, req.lastPath.length - 1);
	req.lastPath = req.lastPath.substring(req.lastPath.lastIndexOf("/")+1);
	
	if(req.path===""){
		req.path="/";
		//Do not send redirect; most browsers redirect example.com/ to example.com
	}
	//Redirect index.html.var, which is an incorrect link to the homepage, to /
	if(req.path=="/index.html.var"){//Proxy index from .htaccess
        req.log("Request is for index.html.var, redirecting to /");
		req.path="/";
	}
	
	req.cookies=parseCookies(req);
	
	//Check if the session with given id is found
	var index = sessionIds.indexOf(req.cookies.sessid);
	//If so, give the information on the session to the request object
	if(req.cookies.sessid&&index!=-1){
		req.session=sessions[index];
		req.log("Session found with id "+ req.session.id);
	}
	//If not, create a new session and give a cookie so the client remembers it.
	else{
		req.session=new Session();
		res.setHeader('Set-Cookie','sessid='+req.session.id);
	}
	if(req.method=="POST"){
		//If there is no data, act like it's a GET request
		if(!req.headers["content-type"] || !(Number(req.headers["content-length"]))){
			req.method = "GET";
		}
		//If there is data, and it's multipart, parse it with the module multiparty
		else if(req.headers["content-type"].startsWith("multipart/form-data")){
			req.log("POST multipart/form-data");
			req.log("Waiting for body before sending through tunnel...");
			new multiparty.Form().parse(req,function(err,fields,files){
				if(err){
					req.err(err.stack);
					showErrorPage(500, req, res);
					return;
				}
				req.files=files;
				req.log(files);
				req.post=fields;
				req.log(req.post);
				sendThroughTunnel(req,res,"/");
			});
		}
		//If there is data and it's not multipart, parse it as a querystring and put the object in req.post
		else{
			var body = "";
			req.on('data', function(data){
				body+=data;
				if(body.length > 1e6){
					showErrorPage(413, req, res);
				}
			});
			req.on('end',function(){
				req.log(body);
				req.post=qs.parse(body);
				sendThroughTunnel(req,res,"/");
			});
			req.log("POST, not multipart. Assuming querystring. Actual: "+req.headers["content-type"]);
			req.log("Waiting for body before sending through tunnel...");
		}
	}
	//If the method was POST, the request will be sent through the / tunnel once the data are processed.
	//If it isn't POST, send it now.
	if(req.method!="POST"){
		sendThroughTunnel(req,res,"/");
	}
}
//What to do when encountering a folder without a "tunnel.node.js" file.
function defaultTunnel(req, res, whereis, options){

	req.log("At default tunnel at "+whereis);
	
	options = options || {};
	indexFile = options.indexFile||"index.html";

	//Find out if whereis is a legitimate folder
	fs.stat(root + "www" + whereis,function(err,stat){
		//File Not Found
		if(err&&err.code=="ENOENT"){
			req.log("Location of current tunnel not found.");
			showErrorPage(404, req, res);
			return;
		}
		//Other error
		else if (err){
			req.err("Error finding current location.");
			req.err(e.stack);
			showErrorPage(500);
			return;
		}
		
		//If there is obviously another folder to go through...
		if(countSlashes(req.path)>countSlashes(whereis)){
			
			//The rest of the url
			relativeUrl=req.path.substring(whereis.length);
			//The rest of the url until you hit a slash
			nextDir = relativeUrl.substring(0,relativeUrl.indexOf("/")+1);
			//Go through the next folder's tunnel.
			req.log("Found another supposed folder ("+nextDir+"). Attempting to send through tunnel.");
			sendThroughTunnel(req, res, whereis+nextDir);
			
		//If this is the requested destination, send the index file
		}else if(req.path==whereis){
		    
			req.log("Current location is request. Sending index file.");
			//Show index file, or, if id does not exist, show 403
			getFile(req.path+indexFile, req, res, {
                notFoundCallback: () => {
					req.log("Attempted to get index page where none exists. Forbidden")
					showErrorPage(403, req, res);
				},
                location: req.redirectPath,
                statusCode: req.redirectStatusCode
			});
			
		//There is another thing, but just one. Example: Request is /meep/hi, 
		//	Current directory is /meep/
		}else{
			
			req.log("Searching for "+req.path);
			
			//See if this is a shortcut for something else. If so, cchange req.path to the actual location.
			if(options.links){
                req.log("Searching for a link from "+req.path.substring(req.path.lastIndexOf("/")+1));
                var linkEnd = options.links[req.path.substring(req.path.lastIndexOf("/")+1)];
                req.log("Found "+linkEnd);
                if(linkEnd){
                    req.path=req.path.substring(0,req.path.lastIndexOf("/")+1) + linkEnd;
                    req.log("Set req.path to "+req.path);
                }
			}
			
			//Figure out what's at the url
			fs.stat(root + "www" + req.path,function statCallback(err,stats){
				if(err&&err.code=="ENOENT"){
				    //File Not Found
					showErrorPage(404, req, res);
				}else if(err){
				    //Other error
					req.err(err.stack);
					showErrorPage(500, req, res);
				}else if(stats.isDirectory()){
					//This is a directory. Send to its tunnel, add a slash to make clear to
					//tunnel is a directory to speed things up a bit.
					req.path=req.path+"/";
					//If request is bensigal.com, do not redirect client to bensigal.com/
					if(req.path != "/"){
					    console.log("Redirecting to trailing slash url.");
                        req.redirectPath = req.path;
                        req.redirectStatusCode = 301;
					}
                    req.url = req.url+"/";
					req.log("Found directory");
					sendThroughTunnel(req, res, req.path);				
				}else if(req.path.endsWith(".node.js")){
					req.log("Node js file found, showing 403.");
					//Stop the client from seeing or executing the code for the server
					showErrorPage(403, req, res);
				}else{
					//There is a file here. Send it.
					getFile(req.path, req, res);
				}
			});
		}
	});
}

var supportedErrorCodes = [401,403,404,405,500];
var messages = [
	"Authorization Required",
	"Currently Forbidden",
	"File Not Found",
	"Method Not Allowed",
	"Internal Server Error"
];

//Show an error page and send the appropriate error code.
function showErrorPage(errorCode, req, res, showAsText){
	
	req.log("Showing error "+errorCode);
	
	//If the error code isn't supported, send a 501 error.
	if(supportedErrorCodes.indexOf(errorCode) < 0){
	    errorCode = 501;
	}
	
	res.statusCode=errorCode;
	
	if(!showAsText){
		fs.readFile("www/"+errorCode+".shtml",function readErrorPageCallback(err, data){
			if(err){
				req.err(err.stack);
				data="Error "+errorCode+"<br>Also, failed to load"+
					" the error page.";
			}
			res.setHeader('Content-Type',"text/html");
			res.setHeader('Content-Length',data.length);
			res.end(data);
		});
	}else{
		res.end("Error "+errorCode);
	}
}

//Send the file at path
function getFile(path,req,res,options){
	
	options=options||{};
	req.log("Sending "+path);
	
	if(!options.pathNotFromWww)
		path=root+"www/"+path;
	
	fs.readFile(path, options.encoding||null, function readFileCallback(err, data){
		req.log(benSpect(data));
		if(err && err.code=="ENOENT"){
			req.log("File not found.");
			if(options.notFoundCallback){
				req.log("Executing special callback.");
				options.notFoundCallback();
			}else{
				req.log("Showing 404 page.");
				showErrorPage(404, req, res);
			}
		}else if(err){
		    //Error besides file not found, show a generic 500
			req.err(err.stack);
			showErrorPage(500, req, res);
		}else{
			res.setHeader('Content-Length',data.length);
			res.setHeader('Content-Type'    ,
				options.encoding=="binary"?"application/octet-stream":mime.getType(path)
			);
			if(options.location)
                res.setHeader('Location', options.location);
			if(options.cookie)
				res.setHeader('Set-Cookie',options.cookieName+'='+options.cookie+";");
			res.statusCode=options.statusCode||200;
			res.end(data);
			req.log("File sent.");
		}
	});
}
function sendString(output, req, res, options){
	options=options||{};
	if(typeof options == "number"){
	    options = {statusCode: options};
	}
	req.log("Sending string data.");
	if(logging == 2){
	    fs.writeFile(req.logLocation+"responseText.log",output,function(err){
	    	if(err)req.err(err);
	    });
	}
	try{
    	res.setHeader('Content-Length',output.length);
    	res.setHeader('Content-Type',options.contentType||"text/plain");
	}catch(e){console.error(e.stacktrace)}
	res.statusCode=options.statusCode||200;
	res.end(output);
}
//Send 302 (default) redirect to specified path.
function redirect(path, req, res, options){
	if(typeof options == "number")options = {statusCode: options};
	options = options || {};
	options.statusCode = options.statusCode || 302;
	
	res.writeHead(options.statusCode, {Location: path});
	res.end();
}

//The request has reached this folder along its path to the correct file. If there is a tunnel.node.js, use that, otherwise, use defaultTunnel.
function sendThroughTunnel(req, res, path){
	
	req.log("Sending through tunnel "+path);
	var nextTunnel = null;
	
	//Try to get the tunnel.node.js
	try{
		nextTunnel = require(root+"www"+path+"tunnel.node.js");
		if(nextTunnel.init && !nextTunnel.didInit){
		    nextTunnel.init(serverInfo);
		    nextTunnel.didInit = true;
		}
	}catch(e){
		//If not found, or another error, use defaultTunnel
		if(e.code=="MODULE_NOT_FOUND"){
			req.log("Tunnel not found at "+root+"www"+path+"tunnel.node.js");
		}else{
			req.log("Error in tunnel initialization."); 
			req.log(e.stack);
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

//count slashes in string
function countSlashes(input){
	return (input.match(/\/.?/g)||[]).length //.? at end of regex is to stop syntax highlight from reading comment.
}
//Got this from... somewhere. Sorry, citation got lost somewhere. All credit goes to whoever wrote this. Returns an object when given a cookie string.
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
	//The value that will be given to the client to identify their session.
	this.id=id||require('crypto').randomBytes(48).toString('hex')
	//Add the id and this object to arrays. The id will be used to locate this object, which will contain other information on the client.
	sessionIds.push(this.id);
	sessions.push(this);
}


//Log folder, actually start server.
if(logging > 1){
	fs.mkdir(root + "server/logs/"+startTime,function(err){
		if(err) throw err;
		httpServer.listen(port, function(){
			console.log("Server listening on localhost:"+port+"! Let's serve some files!");
		});
	});
}else{
	httpServer.listen(port, function(){
		console.log("Server listening on localhost:"+port+"! Let's serve some files!");
	});
}

//Make a readable string representing an object
function benSpect(obj){
	return util.inspect(obj,{depth:null});
}

function purgeCache(path){
	try{
		delete require.cache[require.resolve(root+path)];
		return path+" uncached";
	}catch(e){
		return e.name+": "+e.message+"\n"+e.stack;
	}
}

//Put these variables in serverInfo to be passed to tunnels
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
	"redirect",		redirect,
	"purgeCache", purgeCache
);


require(root+"www/trailblazer/tunnel.node.js").init(serverInfo);//This tunnel should have a bit of time to load a couple files before called for the first time, so do it now 
