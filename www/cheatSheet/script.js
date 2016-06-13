var allData, currents;
$(function(){
    $.get("/cheatSheet/data.txt",function(data){
        data=data.replace(/spd/gi, "&spades;");
        data=data.replace(/hrt/gi, "&hearts;");
        data=data.replace(/clb/gi, "&clubs;");
        data=data.replace(/dmnd|dmd/gi, "&diams;");
        
        allData={info:"No bids have been made."};
        
        currents = [allData];
        
        data.split("\n").forEach(function(line){
            if(!line || line.indexOf("##")>-1)return;
            var i,howFarIn = 0;
            for(i = 0; i < line.length; i++){
                if(line[i]!=" "){
                    break;
                }
            }
            howFarIn=i/4;
            console.log("How far in: "+howFarIn);
            line=line.substring(i);
            var self = {};
            if(line.indexOf(":")>-1){
                self.name=line.substring(0,line.indexOf(":"));
                self.info=line.substring(line.indexOf(":")+1);
            }else{
                self.name=line;
                self.info=false;
            }
            currents[howFarIn+1]=
            self;
            currents[howFarIn][self.name]=self;
        });
        reloadBody();
    });
});
var position=[];
var allData;
var currentData;
function reloadBody(){
    $("#table").html("");
    if(position.length){
        $("#message").html(position[0]);
        for(var i = 1; i < position.length; i++){
            $("#message").append("-"+position[i]);
        }
    }else{
        $("#message").html("&nbsp;");
    }
    currentData=allData;
    position.forEach(function(element){
        currentData=currentData[element];
    });
    console.log("Current Data:");
    console.log(currentData);
    if(position.length){
        $("#table").append($("<tr>").append(
                $("<td colspan=2 class='left'>Back</td>").click(function(){
                    position.pop();
                    reloadBody();
                })
            )
        );
    }
    $("#message2").html(currentData.info);
    for(var segment in currentData){
        if(segment=="info"||segment=="name"){
            continue;
        }
        var row = $("<tr>");
        var cell = $("<td>").append(segment).attr("data-code",segment);
        if(!isEmpty(currentData[segment])){
            cell.addClass("left").click(leftOnClick);
        }
        row.append(cell);
        if(!currentData[segment].info){
            cell.attr("colspan","2");
        }else{
            row.append($("<td>").append(currentData[segment].info));
        }
        $("#table").append(row);
    }
    if(isEmpty(currentData)){
        $("#table").html($("<tr>").append($("<td>").append("No info available")));
    }
}
function isEmpty(node){
    for(var i in node){
        if(i=="info"||i=="name"){
            continue;
        }else{
            return false;
        }
    }
    return true;
}
function bid(name, info){
    var obj = {name:name,info:info};
    for(var i = 2; i < arguments.length; i++){
        obj[arguments[i].name]=arguments[i];
    }
    return obj;
}
function leftOnClick(event){
    position.push($(event.target).attr("data-code"));
    reloadBody();
}