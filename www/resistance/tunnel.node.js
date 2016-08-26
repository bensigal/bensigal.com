var chat = {
    messages: [],
    Message: function(message, user, time){
        this.message = htmlentities(message);
        this.user = user;
        this.time = time;
    },
    addMessage: function(message, user, time){
        this.messages.push(new this.Message(message, user, time));
    },
    getMessageHTML: function(){
        var result = "";
        this.messages.forEach(function(message){
            result+="<div class='message' title='"+message.time+"'>"+message.user+": "+message.message+"</div>";
        });
        return result;
    }
};

chat.addMessage("Meep!","Ben","Now");

function htmlentities(input){
    return input.replace(/[><"'\&\u00A0-\u9999]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });
}

module.exports = function(req,res,server){
    
    if(!req.session.on){
        server.showErrorPage(401, req, res);
    }else if(req.path.endsWith("getChat")){
        server.sendString(chat.getMessageHTML(),req,res, {contentType:"text/html"});
    }else{
        server.defaultTunnel(req,res,"/resistance/");
    }
}