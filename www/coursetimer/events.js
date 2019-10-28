var canvas, ctx;

//When document is ready
$(function(){
    
    //Whenever the value of an input is changed, generate the schedule.
    $("input").change(generateSchedule);
    //Find the canvas and the context used to draw on it
    canvas = $("#canvas")[0];
    canvas.width = 800;
    canvas.height = 500;
    ctx = canvas.getContext("2d");
    //Set text to be drawn centered at the given coordinates
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Georgia";
    
    //Show the gridlines and basic labels of the diagram
    generateSchedule();
    
});

function generateSchedule(){
    
    //Clear the canvas
    ctx.clearRect(0,0,800,600);
    
    //Set the background color to white
    $("body").css("background-color", "white");
    
    //Set up a 2d array to track which spots are occupied
    var timesOccupied = [];
    for(let i = 0; i < 5; i++){
        timesOccupied.push([]);
        for(let j = 1; j <= 12; j++){
            timesOccupied[i].push(false)
        }
    }
    
    //For each checked course
    $("input:checked").each(function(){
		
        //the course id is the id of the element, ignoring the first 6 letters ("course")
        console.log($(this))
        var id = $(this).parent().attr("id").substring(6);
        var course = courses[id]
		
        //For each of the Time objects in the course...
        course.times.forEach(function(time){
			//For each day...
			time.days.forEach(function(day){
				//For each of the hours in the time object...
				time.hours.forEach(function(hour){
					//If it's already occupied, fill it black and write ERROR.
					if(timesOccupied[day][hour]){
						ctx.fillStyle = "#000";
						ctx.fillRect(dayToX(day), hourToY(hour), canvas.width/6, canvas.height/12);
						ctx.fillStyle = "white";
						ctx.fillText("OVERLAP", dayToX(day)+canvas.width/12, hourToY(hour) + canvas.height/24);
						$("body").css("background-color", "#FCC");
					}
					//Otherwise, set the space to occupied, fill it black, and write shortName in white.
					else{
						timesOccupied[day][hour] = true;
						
						ctx.fillStyle = course.color;
						ctx.fillRect(dayToX(day), hourToY(hour), canvas.width/6, canvas.height/12);
						
						ctx.fillStyle = "white";
						ctx.fillText(course.shortName.replace(/TAB/g, ""), dayToX(day)+canvas.width/12, hourToY(hour) + canvas.height/24);
					}
				});
			});
        });
    });
    
    //Draw the horizontal grid lines. i is the y value of each
    ctx.fillStyle = "black";
    for(let i = canvas.height/12; i < canvas.height; i+=canvas.height/12){
        ctx.fillRect(0, i, 800, 1);
    }
    //Draw the vertical. i is the x value of each
    for(let i = canvas.width/6; i < canvas.width; i+=canvas.width/6){
        ctx.fillRect(i, 0, 1, 600);
    }
    
    //Draw the hours
    var hourTexts = ["8-8:50", "9-9:50", "10-10:50", "11-11:50","12-12:50",
        "1-1:50", "2-2:50", "3-3:50", "4-4:50", "5-5:50", "6-6:50", "7-7:50"];
    for(let i = 3*canvas.height/24; i < canvas.height; i+=canvas.height/12){
        //Print the first element of hourTexts and remove it
        ctx.fillText(hourTexts.shift(), canvas.width/12, i);
    }
    
    //Draw the days
    var dayTexts = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for(let i = 3*canvas.width/12; i < canvas.width; i+=canvas.width/6){
        //Print the first element of dayTexts and remove it
        ctx.fillText(dayTexts.shift(), i, canvas.height/24);
    }
}

//Return the x coordinate of the left of the corresponding day.
function dayToX(day){
    return (day+1)*canvas.width/6;
}
//Return the y of the top of the hour.
function hourToY(hour){
    if(hour > 7){
        hour -= 7;
    }
    else{
        hour += 5;
    }
    return hour*canvas.height/12;
}