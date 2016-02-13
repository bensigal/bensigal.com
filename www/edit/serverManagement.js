function deleteFile(s){
    $.post("/server/submit", {op:"delete", edit:"../"+currentDir+s}, function(data){
        if(data!==""){
            viewText(data).replace(/<[^>]+?>/g, "");
        }else{
            changeFiles(currentDir);
        }
    });
}
function delDir(s){
    if(s){
        console.log("../"+currentDir+s);
        $.post("/server/submit", {op:"deleteFolder", edit:"../"+currentDir+s}, function(data){
            if(data!==""){
                viewText(data.replace(/<[^>]+?>/g, ""));
            }else{
                changeFiles(currentDir);
            }
        });
    }
}
function newDir(s){
    if(s){
        $.post("/server/submit", {op:"mkdir", edit:"../"+currentDir+s}, function(data){
            if(data!==""){
                viewText(data.replace(/<[^>]+?>/g, ""));
            }else{
                changeFiles(currentDir);
            }
        });
    }
}
function renameFile(s, newName){
    $.post("/server/submit", 
        {op:"rename", edit:"../"+currentDir+s, value:"../"+currentDir+newName},
        function(data){
            if(data!==""){
                viewText(data.replace(/<[^>]+?>/g, ""));
            }else{
                changeFiles(currentDir);
            }
        }
    );
}
function tryUpload(){
    var files=document.getElementById("file").files;
    readers  = [];
    vals     = [];
    fileNames= [];
    for(var i=0; i<files.length; i++){
        console.log(files[i]);
        console.log(i);
        readers[i] = new FileReader();
        readers[i].benID=i;
        readers[i].onload=dumpToArray;
        readers[i].readAsBinaryString(files[i]);
        fileNames.push(files[i].name);
    }
}
function download(s){
    $("body").append("<iframe src='/server/download/"+s+"' display='none'>");
    setTimeout($("iframe").remove, 1000);
}
function dumpToArray(e){
    vals[e.target.benID]=e.target.result;
    if(vals.length==fileNames.length){
        data = {};
        data.length = vals.length;
        for(var i = 0; i<data.length; i++){
            data[i+"val"]=vals[i];
            data[i+"name"]="../"+currentDir+prompt("What shall this be called?", fileNames[i]);
        }
        $.post("/server/upload", data, function(result){
            if(result!=="Complete."){
                viewText(result);
            }else{
                changeFiles(currentDir);
            }
        });
    }
}