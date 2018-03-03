var logText = "";
var token;
var sections = [];
var grades = [];
var sectionsById = {};
var sectionsByCourseId = {};
var assignments = [];

$(function(){
    $("#input").on("keyup", function(e){
        if(e.keyCode == 13){
            e.preventDefault();
            var input = $("#input").val();
            switch(input){
            case ":a":
                displayAssignments();
                break;
            case ":g":
                displayGrades();
                break;
            default:
                api(input, log);
            }
        }
    });
    api("$ume/sections", function(data){
        var json = JSON.parse(data);
        sections = json.section;
        grabAssignmentList();
    });
});

function grabAssignmentList(){
    
    assignmentsById = {};
    var sectionsLeft = sections.length;
    sections.forEach(function(section){
        api("sections/"+section.id+"/assignments", function(json){
            var assignments = JSON.parse(json).assignment;
            assignments.forEach(function(assignment){
                assignmentsById[assignment.id] = assignment;
            });
            if(--sectionsLeft === 0){
                displayAssignments();
            }
        });
    });
    
}

function displayAssignments(){
    
    var assignments = [];
    api("$ume/grades", function(json){
        var defaultSections = JSON.parse(json).section;
        console.log(defaultSections);
        var html = "<table id='assignmentsTable'>";
        defaultSections.forEach(function(defaultSection){
            defaultSection.period.forEach(function(period){
                period.assignment.forEach(function(partialAssignment){
                    var assignment = assignmentsById[partialAssignment.assignment_id]
                    if(!assignment){
                        console.log("Assignment "+partialAssignment.assignment_id+" does not exist, making up stuff");
                        var assignment = {};
                        assignment.title = "Unknown Assignment "+partialAssignment.assignment_id;
                        assignment.id = partialAssignment.assignment_id;
                        assignment.max_points = partialAssignment.max_points | "???";
                    }
                    assignment.grade = partialAssignment.grade;
                    assignment.timestamp = partialAssignment.timestamp;
                    assignments.push(assignment);
                });
            });
        });
        assignments.sort(function(a, b){
            if(a.timestamp < b.timestamp)return 1;
            if(a.timestamp > b.timestamp)return -1;
            return 0;
        });
        assignments.forEach(function(assignment){
            if(assignment.timestamp < 1)return; //Assignment has not yet been graded
            var date = new Date(assignment.timestamp * 1000);
            html+="<tr id='"+assignment.id+"'>"+
                "<td class'assignmentName'>"+assignment.title+"</td>"+
                "<td class='assignmentGrade'>"+assignment.grade+"/"+assignment.max_points+"</td>"+
                "<td id='assignmentTimestamp'>"+(date.getMonth()+1)+"/"+(date.getDate())+"</td>"+
            "</tr>";
        })
        html+="</table>";
        $("#results").html(html);
    });
    
}

function showAssignmentsTable(){
    
    var html = "<table id='assignmentsTable'>";
    assignments.forEach(function(assignment){
        html+= "<tr id='"+assignment.id+"'><td class='assignmentName'>"+assignment.name+"</td><td class='assignmentGrade'>"+assignment.grade+"/"+assignment.max+"</td></tr>";
    });
    html += "</table>";
    $("#results").html(html);
}

function displayGrades(){
    
    var html = "<table id='gradesTable'>";
    sections.forEach(function(section){
        html+="<tr id='"+section.id+"'><td class='courseTitle'>"+section.course_title+"</td><td class='courseGrade'>Loading...</td></tr>"
        api("$ume/grades?section_id="+section.id, function(data){
            var section = JSON.parse(data).section[0];
            console.log(section);
            $("#"+section.section_id+" .courseGrade").text(section.final_grade[0].grade);
        });
    });
    html+="</table>";
    $("#results").html(html);
    
    /*api("/users/50977236/grades?section_id=1139843112", function(data){
        var section = JSON.parse(data).section[0];
        console.log(section);
        $("#"+section.section_id+" .courseGrade").text(section.final_grade[0].grade);
    });*/
    
}

function log(text){
    $("#results").html(text.replace(/([,{}\[\]])/g, "$1<br>").replace(/([{}\[\]])/g, "<br>$1"));
}

function clapi(urlTarget){
    api(urlTarget, function(data){console.log(JSON.parse(data))})
}
function api(urlTarget, callback){
    
    urlTarget = urlTarget.replace(/\$me/gi, "50977236");
    urlTarget = urlTarget.replace(/\$ume/gi, "users/50977236");
    
    var settings = {
        success: callback,
        method:"POST",
        data:{url:urlTarget, token:token},
        url:"api",
    }
    
    $.ajax(settings);
}