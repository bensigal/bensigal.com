topLoggedOutHTMLStr = 
    "<div id='senderHolder'>"+
        "<input id='un' onkeydown='trysubmit(event)' autofocus autocomplete name='un' type='text'>"+
        "<input id='pwd' onkeydown='trysubmit(event)' type='password' autocomplete name='pwd'>"+
    "</div>";
topLoggedInHTMLStr = "";
on=true;
function logout(){
    $.get("/server/logout", function(data){
		//"false" is successful because it indicates that you are not logged in >.<
        if(data!="false")
            viewText(data);
        else
            successfulLogout();
    });
}
var loginCheckInterval = setInterval(function(){
    $.get("/server/login", function(data){
        if(on&&data.trim()==="false")
            successfulLogout();
        if(!on&&data.trim()==="true")
            successfulLogin();
        console.log("Login: "+data+". Time: "+new Date());
    });
}, 100000);

function successfulLogout(){
    location.reload(true);
}