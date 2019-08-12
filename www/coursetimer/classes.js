//Represents which hours of a certain day a class takes up
//Hours is an array. For example, [1,2] represents a class
//that takes up hour 1 and hour 2 (1pm-159pm and 2pm-259pm)
class Time{
    //Day should be 0-4, representing mon-thurs. hours is an array as 
    //described above.
    constructor(day, hours){
        this.day = day;
        //if hours is a number, interpret it as an array with just that number.
        if(typeof hours == "number"){
            hours = [hours];
        }
        this.hours = hours;
    }
}

//constants for each day to be used with the Time class.
var MONDAY = 0, 
    TUESDAY = 1,
    WEDNESDAY = 2, 
    THURSDAY = 3,
    FRIDAY = 4;
    
//Represents one set of times, with a name.
class Course{
    
    constructor(id, name, color, times, shortName){
        this.name = name;
        this.times = times;
        this.color = color;
        //If shortName is specified, it will be used instead of name
        //when drawing on the canvas as there's less space there than
        //the checkbox list.
        this.shortName = shortName || name;
        //Create a new p element with a checkbox
        $("<p>")
            .html("<in"+"put type='checkbox'>"+this.name)
            .attr("id", "course"+id)
            .appendTo($("#courses"))
        ;
    }
    
}

var courses = [];
function addCourse(id, name, color, times, shortName){
    var course = new Course(id, name, color, times, shortName);
    courses[id] = course;
}