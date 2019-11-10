class Course{
    
    constructor(id, name, credits, color){
		this.id = id;
        this.name = name;
        this.credits = credits;
        
        this.element = $("<div draggable='true'>")
            .addClass("course")
            .css("background-color", color)
            .attr("id", "course"+this.id)
            .html(this.name + "<br>("+this.credits+")")
        ;
    }
    
}

var courses = [];

function addCourse(name, credits, color){
    var course = new Course(courses.length, name, credits, color);
    courses.push(course);
    course.element.appendTo($("#depo"));
}