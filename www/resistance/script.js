$(function(){
    getChat();
    setInterval(function(){
        getChat();
    },500);
})
function getChat(){
    $.get("/resistance/getChat", function(data){
        $("#chat").html(data);
    });
}
function chatInputKeydown(e){
    if(e.keyCode == 13){
        alert("SEND")
    }
}