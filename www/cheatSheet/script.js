//Guide to which openings mean what when in bridge, by Benjamin Sigal

//List of possible bids
var allData, 
    //list of elements to be shown
    currents;

$(function(){
    //Load the list of bids, do all this when done
    $.get("/cheatSheet/data.txt",function(data){
        
        //Everywhere data.txt uses these abbreviations, replace them with the HTML code for the respective suit
        data=data.replace(/spd/gi, "&spades;");
        data=data.replace(/hrt/gi, "&hearts;");
        data=data.replace(/clb/gi, "&clubs;");
        data=data.replace(/dmnd|dmd/gi, "&diams;");
        
        //Description of where we are currently
        allData={info:"No bids have been made."};
        
        //Add where we are to what should be shown
        currents = [allData];
        
        //For each line
        data.split("\n").forEach(function(line){
            //Ignore empty or commented lines (## anywhere comments)
            if(!line || line.indexOf("##")>-1)return;
            
            //Count how many characters until a non-space character
            var i;
            for(i = 0; i < line.length; i++){
                if(line[i]!=" "){
                    break;
                }
            }
            
            //Divide by 4 to get the indentation level
            howFarIn=i/4;
            //Ignore all the spaces at the beginning
            line=line.substring(i);
            
            //The data the line represents
            var self = {};
            
            //If a description (after :) is present, put name and info into self, otherwise just name.
            if(line.indexOf(":") > -1){
                self.name=line.substring(0,line.indexOf(":"));
                self.info=line.substring(line.indexOf(":")+1);
            }else{
                self.name=line;
                self.info=false;
            }
            
            currents[howFarIn + 1] = self;
            currents[howFarIn][self.name]=self;
            
        });
        //Show the changes
        reloadBody();
    });
});

//Selected bids
var position = [];
//All bid data that comes after current position
var currentData;

function reloadBody(){
    //Clear the table
    $("#table").html("");
    
    //If any bids have been selected, show them all (eg. 1spd-2hrt-3spd)
    if(position.length){
        $("#message").html(position[0]);
        for(var i = 1; i < position.length; i++){
            $("#message").append("-"+position[i]);
        }
    }else{
        $("#message").html("&nbsp;");
    }
    
    //Set currentData to only the data that comes after the current bid
    currentData=allData;
    position.forEach(function(element){
        currentData=currentData[element];
    });
    
    //If any bids have been selected, add a back button in a new row
    if(position.length){
        $("#table").append($("<tr>").append(
                //When button with text back is clicked, remove the latest bid from position and reload information.
                $("<td colspan=2 class='left'>Back</td>").click(function(){
                    position.pop();
                    reloadBody();
                })
            )
        );
    }
    
    //Show description of latest bid
    $("#message2").html(currentData.info);
    
    //For all bids in currentData (meaning still possible at position)...
    for(var segment in currentData){
        
        //If the property is info or name, it's not a bid, so ignore it.
        if(segment=="info"||segment=="name"){
            continue;
        }
        
        //Make a new row, add a cell to it with the data text of the bid
        var row = $("<tr>");
        var cell = $("<td>").append(segment).attr("data-code",segment);
        row.append(cell);
        
        //If it has more information, make it clickable
        if(!isEmpty(currentData[segment])){
            cell.addClass("left").click(leftOnClick);
        }
        
        //If it has a description, add a cell for that.
        if(!currentData[segment].info){
            cell.attr("colspan","2");
        }else{
            row.append($("<td>").append(currentData[segment].info));
        }
        
        //Add the row to the table
        $("#table").append(row);
        
    }
    
    //If there's no bids left, add no info message to table.
    if(isEmpty(currentData)){
        $("#table").html($("<tr>").append($("<td>").append("No info available")));
    }
}

//Check if a bid has any bids after it.
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
//Click event handler. Add that bid to the list of what's happened, reload the page.
function leftOnClick(event){
    position.push($(event.target).attr("data-code"));
    reloadBody();
}