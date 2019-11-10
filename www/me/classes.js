class Course{
    
    constructor(id, name, credits, type, required, description){
        this.id = id;
        this.name = name;
        this.credits = credits;
        this.type = type;
        this.description = description;
        this.required = required;
        
        this.element = $("<div draggable='true'>")
            .addClass("course")
            .addClass(this.type)
            .attr("id", "course"+this.id)
            .html(this.name + "<br>("+this.credits+")")
            .on("contextmenu", (event) => {
                event.preventDefault();
                alert(this.description);
            })
        ;
        if(this.required){
            this.element.addClass("required");
        }
    }
    
}

var courses = [];

function addCourse(id, name, credits, type, required, description){
    var course = new Course(id, name, credits, type, required, description);
    courses[id] = course;
    course.element.appendTo($("#depo"));
}