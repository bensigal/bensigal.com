var http = require("http");
var consumer_key = "53de821338d447ad50667e117ed73d6605a6b4bdb";
var signature = "fb46f25098175cc9095df02130f4b6ac%26";
var url = require("url");

module.exports = function(req, res, server, whereis){
    if(req.lastPath == "api"){
        var oauthHeaders = createOauthHeaders({
            realm: "Schoology API",
            oauth_consumer_key: consumer_key,
            oauth_token: req.session.token,
            oauth_nonce: nonce(),
            oauth_timestamp: timestamp(),
            oauth_version: "1.0",
            oauth_signature_method: "PLAINTEXT",
            oauth_signature: signature + req.session.token_secret
        });
        var settings = {
            path: "/v1/"+req.post.url,
            hostname:"api.piedmont.schoology.com",
            rejectUnauthorized:false,
            headers:{
                Authorization:oauthHeaders
            }
        };
        http.get(settings, function(response){
            var result = "";
            response.on("data", function(data){
                result+=data;
            });
            response.on("end", function(data){
                server.sendString(result, req, res);
            });
        });
    }else if(req.lastPath == "token"){
        var settings = {
            path: "/v1/oauth/request_token",
            hostname: "api.piedmont.schoology.com",
            rejectUnauthorized: false,
            headers:{
                Authorization: createOauthHeaders({
                    realm: "Schoology API",
                    oauth_consumer_key: consumer_key,
                    oauth_timestamp: timestamp(),
                    oauth_nonce: nonce(),
                    oauth_signature: signature,
                    oauth_signature_method: "PLAINTEXT",
                    oauth_callback: "/grades/callback",
                    oauth_version: "1.0"
                })
            }
        }
        http.get(settings, function(response){
            var result = "";
            response.on("data", function(data){
                result+=data;
            });
            response.on("end", function(data){
                if(data)result+=data;
                var parts = result.split("&");
                if(!parts[0].startsWith("oauth_token=")){
                    server.sendString("oauth token not found", req, res);
                }
                if(!parts[1].startsWith("oauth_token_secret=")){
                    server.sendString("oauth token not found", req, res);
                }
                req.session.token = parts[0].substring(12);
                req.session.token_secret = parts[1].substring(19);
                //%26 is ampersand
                server.redirect("http://piedmont.schoology.com/oauth/authorize?return_url=http://bensigal.com/grades/main.html&"+parts[0], req, res);
            });
        });
    }else if(req.lastPath == "grades"){
        var match = req.url.match(/oauth_token=(^&+)/);
        var passedToken = false;
        if(match)
            if(match.length > 0)
                var passedToken = match[1];
        if(passedToken){
            server.defaultTunnel(req, res, "/grades/");
        }else if(req.session.isVerified && (req.lastPath == "main.html" || req.lastPath == "grades")){
            server.redirect("/grades/verified.html", req, res);
        }
        else{
            console.error(req.session.isVerified + ", "+req.lastPath)
            server.redirect("/grades/token", req, res);
        }
    }else if(req.lastPath == "access"){
        req.session.token = req.post.token;
        req.session.token_secret = req.post.token_secret;
        req.session.isVerified = true;
        server.sendString("Success!", req, res);
    }else if(req.lastPath == "logout"){
        req.session.token = false;
        req.session.isVerified = false;
        server.sendString("Successfully logged out of <a href='/grades'>bensigal.com/grades</a>. <br><br>Please note that to log out of schoology itself, you must go to <a href='https://piedmont.schoology.com'>their website</a>.",
            req, res, {contentType: 'text/html'});
    }
    else{
        server.defaultTunnel(req, res, "/grades/");
    }
    return false;
}

function timestamp(){
    return Math.floor(new Date()/1000);
}
function nonce(){
    var result = "";
    for(var i = 0; i < 16; i++){
        result += "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*36)];
    }
    return result;
}
function createOauthHeaders(headers){
    var result = "OAuth ";
    for(var key in headers){
        //if(!headers[key])continue;
        result+=key;
        result+='="';
        result+=headers[key];
        result+='", ';
    }
    return result;
}