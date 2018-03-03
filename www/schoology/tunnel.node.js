var http = require("http");

module.exports = function(req, res, server, whereis){
    if(req.lastPath == "api"){
        var settings = {
            path: "/v1/"+req.post.url,
            hostname:"api.piedmont.schoology.com",
            rejectUnauthorized:false,
            headers:{
                Authorization:oauthHeaders({
                    realm: "Schoology API",
                    oauth_consumer_key: "53de821338d447ad50667e117ed73d6605a6b4bdb",
                    oauth_token: "",
                    oauth_nonce: nonce(),
                    oauth_timestamp: Math.floor(new Date()/1000),
                    oauth_version: "1.0",
                    oauth_signature_method: "PLAINTEXT",
                    oauth_signature: "fb46f25098175cc9095df02130f4b6ac%26"
                })
            }
        };
        console.error(JSON.stringify(settings));
        http.get(settings, function(response){
            var result = "";
            response.on("data", function(data){
                result+=data;
            });
            response.on("end", function(data){
                server.sendString(result, req, res);
            });
        });
    }else{
        server.defaultTunnel(req, res, "/schoology/");
    }
    return false;
}
function nonce(){
    var result = "";
    for(var i = 0; i < 16; i++){
        result += "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random()*36)];
    }
    return result;
}
function oauthHeaders(headers){
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