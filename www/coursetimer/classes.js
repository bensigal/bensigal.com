//Represents which hours of days a class takes up
//Hours is an array. For example, [1,2] represents a class
//that takes up hour 1 and hour 2 (1pm-159pm and 2pm-259pm)
class Time{
    //Day should be 0-4, representing mon-thurs. hours is an array as 
    //described above.
    constructor(days, hours){
        //if number, interpret it as an array with just that number.
        if(typeof days == "number"){
			days = [days];
		}
        if(typeof hours == "number"){
            hours = [hours];
        }
        this.hours = hours;
		this.days = days;
    }
}

//constants for each day to be used with the Time class.
var M = 0, 
    T = 1,
    W = 2, 
    R = 3,
    F = 4;

var lastId = -1;
//Represents one set of times, with a name.
class Course{
    
    constructor(id, name, color, times, shortName){
        this.name = name;
		//if only one Time is given, make array
		if(times instanceof Time){
			times = [times];
		}
        this.times = times;
        this.color = color;
        //If shortName is specified, it will be used instead of name
        //when drawing on the canvas as there's less space there than
        //the checkbox list.
        this.shortName = shortName || name;
        //Create a new p element with a checkbox
        $("<p>")
            .html("<in"+"put type='checkbox'>" +
				this.name.replace(/TAB/g, "&nbsp;&nbsp;&nbsp;&nbsp;"))
            .attr("id", "course"+id)
            .appendTo($("#courses"))
        ;
    }
    
}

var courses = [];
function addCourse(name, color, times, shortName){
	var id = courses.length;
    var course = new Course(id, name, color, times, shortName);
    courses[id] = course;
}