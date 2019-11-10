var currentMajor;

$(function(event){
    
    //Make the elements in #depo and .courseHolder draggable, and movable between each other.
    $("#depo").sortable({
        connectWith: ".courseHolder",
    });
    $(".courseHolder").sortable({
        connectWith: [".courseHolder", "#depo"],
        update: refreshCredits
    });
    
    //When the View Data button is clicked, call viewCode
    $("button#viewData").click(function(event){
        //Calculate the current code and show it as a popup
        alert("Copy/paste the code below and save it somewhere. Next time you come to this page, use 'Load from Data' to get the classes you saved.\n\n" + getCurrentCode());
    });
    
    //When the Load from Data button is clicked, call openCode
    $("button#loadFromData").click(function(event){
        openCode(prompt("Please enter the data obtained by previously using 'View Data.'"));
    })
    
    //When the Save button is clicked, send a message to /server/save to save the current
    $("button#save").click(function(event){
        var fileName = prompt("What should the file be called?") + ".courseplanner";
        $.post("/server/save", {value: getCurrentCode(), file: "/courseplanner/plans/"+fileName}, function(data){
            alert(data)
        });
    });
    
    //When the Open button is clicked, obtain and display a list of existing files, ask which to open
    $("button#open").click(function(event){
        $.get("/courseplanner/list", function(data){
            var fileName = prompt("Known files are:\n"+data+"\nWhich would you like to open?");
            $.get("/courseplanner/plans/"+fileName+".courseplanner", function(data){
                //If the data matches the expected format 1,3,2;4,9 etc.
                if(data.match(/^(((\d+,)*\d*);)*((\d+,)*\d*)$/)){
                    openCode(data);
                }else{
                    alert("Error: "+data);
                }
            });
        })
    });
	
	//When the dropdown menu's selected option is changed, load that major.
	$("#majorSelect").change(function(e){
		loadMajor(e.target.value);
	});
	
	//Load the major currently selected
	loadMajor($("#majorSelect").val());
});

//Replace all courses with the one indicated by the string major.
function loadMajor(major){
	
	//Remove all courses
	$(".course").remove();
	courses = [];
	
	currentMajor = major;
	
	//Make sure the dropdown menu is in the right place
	$("#majorSelect").val(major);
	
	switch(major){
	case "EE":
		majors.ee();
		break;
	case "ME":
		majors.me();
		break;
	default:
		alert("Major '"+major+"' not found!");
	}
	
	refreshCredits();
}

//Calculate how many credits are in each section. Called every time a course moves.
function refreshCredits(){
    $(".box").each(function(index, element){
        var credits = 0;
        $(element).find(".courseHolder > *").each(function(i, e){
            var id = Number($(e).prop("id").substring(6));
            credits += courses[id].credits;
        });
        $(element).children("h3").text("Credits: "+credits);
    });
}

//Move the courses based on a string with format 1,2,3;4,5,7;;10
//In that case, the first section has courses 1, 2, and 3 by id, the second has 4, 5, and 7,
//the third has none, and the fourth has 10.
function openCode(code){
	
    var sections = code.split(";");
	//Add all courses to the selection box
    $(".course").appendTo("#depo");
	//Load the major specified
	loadMajor(sections[0]);
	
    sections.forEach(function(element, index){
		//First 'section' is the major code
		if(index === 0)return;
        element.split(",").forEach(function(e, i){
			//Get the indexth (minus one because major code was element 0) box,
            $(".courseHolder").eq(index - 1)
				//and add the course to it.
				.append($("#course"+e));
        });
    });
    
    refreshCredits();
}

//Generate a string representing the locations of courses according to the format described above.
function getCurrentCode(){
    var result = currentMajor;
    $(".courseHolder").each(function(index, element){
        result+=";";
        $(element).children().each(function(i, e){
            if(i)result+=","
            result += $(e).prop("id").substring(6);
        });
    });
    return result;
}