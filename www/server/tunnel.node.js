var fs       	= require("fs");
var exec     	= require("child_process").exec;
var passwords	= require("../../passwords.js");

//NOTE: THIS FILE CONTAINS ALL OF THE INTENTIONALLY DANGEROUS FUNCTIONS OF THE SERVER. 
var openFunctions = [
    "login",
    "throwerror",
    "login.html",
    "post"
];
var authorizationRequired = [
    "logout",
    "sitemap",
    "purgecache",
];
var partialPermissions = [
    "save",
    "getfilecontents",
];
var adminRequired = [
    "exit",
    "delete",
    "ssh",
    "getfilecontents",
    "javac",
    "save",
    "exec",
    "mkdir",
    "rmdir",
];
module.exports=function(req,res,server){
    if(new RegExp(openFunctions.join("|")).test(req.path)){
        
        if (/post/i.test(req.path)){
            
            server.getFile("server/post.html",req,res);
            
        }else if(/throwerror.*/i.test(req.path)){
            
        	server.showErrorPage(Number(req.path.substring(req.path.lastIndexOf("/")+1)),req,res);
        	
        }else if(/login\/?/i.test(req.path)){
            
            if(req.method=="POST"){
                req.log("Login attempt");
                var unIndex=users.indexOf(req.post.un.toLowerCase());
                if(unIndex>-1&&unIndex==passwords.indexOf(new Buffer(req.post.pwd).toString("base64"))){
                    req.session.on=true;
                    req.session.un=req.post.un;
                    req.session.pwd=req.post.pwd;
                }
            }
            return req.session.on?"true":"false";
            
        }
        
    }
    else if(new RegExp(authorizationRequired.join("|")).test(req.path)){
        if(!req.session.on){
            server.getFile("server/login.html",req,res,{
                statusCode: 401,
                pathNotFromWww:true
            });
            return;
        }
        if(/logout\/?/i.test(req.path)){
            req.log("Logging out.");
            req.session.on=false;
            return "false";
        }
        else if(/purgecache\/?/i.test(req.path)){
            req.log("Deleting cached tunnel "+req.post.path);
            server.purgeCache(req.post.path);
            server.sendString(req.post.path+" uncached", req, res);
        }else if(/sitemap\/?/i.test(req.path)){
            if(!req.post || !req.post.dir)
            	server.sendString("No sitemap location sent.",req,res);
            //Not allowed to go up a directory. The server doesn't like that.
            if(req.post.dir.includes(".."))
            	server.sendString("Invalid request: String .. in filepath dangerous.",req,res);
            //Looking into non-home-directory folders is dangerous. Best to shut out non-admins.
            if(!req.post.dir.startsWith("/home/bensigal")&&req.session.un!="Ben")
            	server.sendString("Non-admins are not allowed to navigate out of home directory.",req,res);
            req.log("Generating sitemap for "+req.post.dir);
            fs.readdir(req.post.dir,function(err,items){
            	if(err){
            		if(err.code=="ENOENT")
            			server.sendString("Folder not found.",req,res);
            		else{
            			server.sendString("Unknown error.",req,res);
            			req.log(err.stack);
            		}
            		return;
            	}
            	if(items.length===0){
            	    req.log("Empty.");
            	    server.sendString("\n",req,res);
            	    return;
            	}
            	var dirs = [];
            	var files= [];
            	var responsesLeft = items.length;
            	items.forEach(function(file){
            		//This is some weird code, but necessary for a good async paradigm.
            		//Each execution of the callback to stat needs the file name,
            		//Because stat objects don't contain the file name. So, we have a 
            		//closure to retain the variable file, which is a string from items.
            		//Because they will not necessarily finish in order, each has the capacity
            		//to send off the completed list. Closures for the win.
            		fs.stat(req.post.dir+file,function(file){
            			return function(err, stats){
            				responsesLeft--;
            				if(err){
            					req.err(err.stack);
            					files.push(file+"<br>INACCESSIBLE");
            				}else if(stats.isDirectory()){
            					dirs.push(file);
            				}else{
            					files.push(file);
            				}
            				if(responsesLeft===0){
            					req.log("COMPLETE "+dirs+files);
            					server.sendString(dirs.join(";")+"\n"+files.join(";"),req,res);
            				}
            			};
            		}(file));
            	});
            });
        }
    }
    else if(new RegExp(partialPermissions.join("|")).test(req.path) && req.session.un.toLowerCase() == "nick"){ //Nick permissions
        if(/getfilecontents\/?/i.test(req.path)){
            if(!req.post.edit.startsWith("/home/bensigal/www/bensigal") || req.post.edit.indexOf("..") > -1)
                return server.sendString("You only have the permissions to edit: /home/bensigal/www/bensigal/", req, res);
            req.log("Reading file contents for "+req.post.edit);
            server.getFile(req.post.edit,req,res,{
                pathNotFromWww:true,
                notFoundCallback:function(){
                    server.sendString("Error: File not found.",req,res);
                },
                encoding:"binary"
            });
        }else if(/save\/?/i.test(req.path)){
            var file = String(req.post.file);
            console.error(file);
            if(!(file.startsWith("/home/bensigal/www/bensigal/") || file.startsWith("/home/bensigal/www/explosiongolf/")) || file.indexOf("..") > -1)
                return server.sendString("You lack the permissions to edit "+file, req, res);
            req.log("Saving to file "+file);
            if(req.post.value){
                fs.writeFile(file, req.post.value, function(err){
                    if(err){
                        server.showErrorPage("Could not write to file: "+err.message, req, res);
                    }else{
                        server.sendString("Success!", req, res);
                    }
                });
            }else{
                var is = fs.createReadStream(req.files.contents[0].path);
                var os = fs.createWriteStream(file);
                is.pipe(os);
                is.on('end',function(err){
                    if(err)server.sendError;
                    fs.unlink(req.files.contents[0].path,function(err){
                        if(err)throw err;
                        server.sendString("Success!",req,res);
                    });
                });
            }
        }
    }
    else if(new RegExp(adminRequired.join("|")).test(req.path)){
        if(!req.session.on){
            server.sendString("Not logged on", req, res);
        }else if(req.session.un.toLowerCase() != "ben"){
        
        	server.sendString("Admin permissions required", req,res);
        	
        }else if(/exit\/?/i.test(req.path)){
            server.process.exit();
            return;
        }else if(/delete\/?/i.test(req.path)){
            req.log("Attempting to delete file "+req.post.path);
            fs.unlink(req.post.path, function(err){
                if(err){
                    req.err(err.stack);
                    server.showErrorPage("Failure",req,res);
                }else{
                    server.sendString("Success!",req,res);
                }
            });
        }
        else if(/getfilecontents\/?/i.test(req.path)){
            if(!req.post || !req.post.edit){
                return server.showErrorPage(400, req, res);
            }
            req.log("Reading file contents for "+req.post.edit);
            server.getFile(req.post.edit,req,res,{
                pathNotFromWww:true,
                notFoundCallback:function(){
                    server.sendString("Error: File not found.",req,res);
                },
                encoding:"binary"
            });
        }else if(/save\/?/i.test(req.path)){
            if(!req.post){
                return server.showErrorPage(400, req, res);
            }
            console.log("Saving to file "+req.post.file);
            console.error("Testing, got to 201");
            if(!req.post.value || !req.post.file){
                return server.showErrorPage(400, req, res);
            }
            console.error("Writing to "+req.post.file+" with length "+req.post.value.length);
            fs.writeFile(req.post.file, req.post.value, function(err){
                if(err)return server.showErrorPage(err.message, req, res);
                server.sendString("Success!", req, res);
            });
        }else if (/delete\/?/i.test(req.path)){
    	    req.log("Deleting "+req.post.file);
    	    return "";
    	}else if (/javac\/?/i.test(req.path)){
    	    exec("javac "+req.post.args+" "+req.post.file, function(error, stdout, stderr){
                if(error){
                    server.sendString(error.stack,req,res);
                }else{
                    server.sendString(stdout.toString()+stderr.toString(),req,res);
                }
    	    });
    	}
    	else if (/exec\/?/i.test(req.path)){
    		var process = exec(req.post.command, function(err, out, code){
    			server.sendString("Error: " + err + "<br>"+ out + "<br>With exit code: "+code, req, res)
    		});
    	}
        else if(/mkdir\/?/i.test(req.path)){
            req.log("Attempting to make directory at "+req.post.path);
            fs.mkdir(req.post.path, function(err){
                if(err){
                    req.err(err.stack);
                    server.showErrorPage("Failure",req,res);
                }else{
                    server.sendString("Success!",req,res);
                }
            });
        }
        else if(/rmdir\/?/i.test(req.path)){
            req.log("Attempting to remove (hopefully empty) directory at "+req.post.path);
            fs.rmdir(req.post.path, function(err){
                if(err){
                    req.err(err.stack);
                    server.showErrorPage(err.message,req,res);
                }else{
                    server.sendString("Success!",req,res);
                }
            });
        }
    }else{
		server.showErrorPage(404,req,res);
	}
};

//Should be all lowercase.
var users=[
	"ben",
	"jakob",
	"nick",
	"trailblazer"
];

module.exports.initialized=0;
module.exports.init=function(passedRoot,passedServer){
	root=passedRoot;
	server=passedServer;
};
