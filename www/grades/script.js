var logText = "";
var token;
var sections = [];
var grades = [];
var sectionsById = {};
var sectionsByCourseId = {};
var assignments = [];
var finishedWithGrades = false;
var uid = 0;
var waitingForGradesToFinish = false;
var previouslyVerified = previouslyVerified || false;

$(function(){
    //If this page is verified.html, previouslyVerified will be true, meaning exchanging a request token for an acess token is not necessary.
    if(previouslyVerified){
        accessTokenObtained();
    }else{
        //Send request to server to obtain access token from schoology.
        api("oauth/access_token", function(data){
            console.log(data);
            //bensigal.com will return a value in the format oauth_token=abcdef...&oauth_token_secret=abcdef...
            var token = data.match(/oauth_token=([^&]+)/)[1];
            var token_secret = data.match(/oauth_token_secret=([^&]+)/)[1];
            if(!token || !token_secret){
                alert("Error verifying. Please try logging out and returning to bensigal.com/grades.");
            }
            //Actually give the access tokens to the server
            //shut up security doesn't really matter
            $.post("/grades/access", {token:token, token_secret:token_secret}, function(data){
                if(data == "Success!"){
                    accessTokenObtained();
                }else{
                    alert(data);
                }
            })
        });
    }
});

function accessTokenObtained(){
    //List of buttons to be added
    var buttons = [
        $("<button>Show Recent Assignments</button>").click(showAssignmentsTable),
        $("<button>Custom API Request (if you know what you're doing)</button>").click(function(e){
            api(prompt("Request URL?"), log);
        }),
        $("<button>Log Out</button>").click(function(){
            location.href="/grades/logout";
        })
    ];
    $("#results").html("Please select an action.");
    $("#buttons").html("");
    $("#buttons").append(buttons);
    //Obtain id of current user
    api("app-user-info", function(json){
        var data = JSON.parse(json);
        uid = data.api_uid;
        //Obtain list of sections belonging to this user
        api("$ume/sections", function(data){
            var json = JSON.parse(data);
            sections = json.section;
            grabAssignmentList();
        });
    });
}

//Get list of assignments, with no data specific to this user, for each section.
function grabAssignmentList(){
    
    assignmentsById = {};
    var sectionsLeft = sections.length * 3;
    sections.forEach(function(section){
        api("sections/"+section.id+"/assignments?limit=9999", function(json){
            var assignments = JSON.parse(json).assignment;
            assignments.forEach(function(assignment){
                assignmentsById[assignment.id] = assignment;
            });
            if(--sectionsLeft === 0){
                findGrades();
            }
        });
        api("sections/"+section.id+"/assessments?limit=9999", function(json){
            var assignments = JSON.parse(json).assessment;
            if(!assignments){
                sectionsLeft--;
                return;
            }
            assignments.forEach(function(assignment){
                assignmentsById[assignment.id] = assignment;
            });
            if(--sectionsLeft === 0){
                findGrades();
            }
        });
        api("sections/"+section.id+"/discussions?limit=9999", function(json){
            var assignments = JSON.parse(json).discussion;
            assignments.forEach(function(assignment){
                assignmentsById[assignment.id] = assignment;
            });
            if(--sectionsLeft === 0){
                findGrades();
            }
        });
    });
    
}

function findGrades(){
    
    assignments = [];
    finishedWithGrades = false;
    api("$ume/grades", function(json){
        var defaultSections = JSON.parse(json).section;
        console.log(defaultSections);
        defaultSections.forEach(function(defaultSection){
            defaultSection.period.forEach(function(period){
                period.assignment.forEach(function(partialAssignment){
                    var assignment = assignmentsById[partialAssignment.assignment_id]
                    if(!assignment){
                        //console.log("Assignment "+partialAssignment.assignment_id+" does not exist, making up stuff");
                        assignment = {};
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
        //Sort by date
        assignments.sort(function(a, b){
            if(a.timestamp < b.timestamp)return 1;
            if(a.timestamp > b.timestamp)return -1;
            return 0;
        });
        //When 'show assignments' is pressed they can be loaded immediately
        finishedWithGrades = true;
        //if it was already pressed show now
        if(waitingForGradesToFinish){
            showAssignmentsTable();
        }
    });
}

//Create table with row for each assignment showing name, grade, max possible, percent, and date
function showAssignmentsTable(){
    if(!finishedWithGrades){
        waitingForGradesToFinish = true;
        $("#results").html("Loading...")
        console.log("Set waiting for grades to finish");
        return;
    }
    var html = "<table id='assignmentsTable'>";
    assignments.forEach(function(assignment){
        var date = new Date(assignment.timestamp * 1000);
        if(date < new Date(2018, 0))return; //Assignment is from before 1/1/2018, will not work
        html+="<tr id='"+assignment.id+"'>"+
            "<td class='assignmentName'>"+assignment.title+"</td>"+
            "<td class='assignmentGrade'>"+assignment.grade+"/"+assignment.max_points+"</td>"+
            "<td class='assignmentPercent'>"+Math.round(assignment.grade/assignment.max_points *10000)/100+"%</td>"+
            "<td class='assignmentTimestamp'>"+(date.getMonth()+1)+"/"+(date.getDate())+"</td>"+
        "</tr>";
    })
    html+="</table>";
    $("#results").html(html);
}

//TODO
function displayGrades(){
    
    
    
}

//Set #results to this, slightly prettifying json
function log(text){
    $("#results").html(text.replace(/([,{}\[\]])/g, "$1<br>").replace(/([{}\[\]])/g, "<br>$1"));
}

//call api and log the json object resulting
function clapi(urlTarget){
    api(urlTarget, function(data){console.log(JSON.parse(data))})
}

//Send request to bensigal.com for them to send request to schoology, at urlTarget, with callback. See developers.schoology.com/api for details.
function api(urlTarget, callback){
    
    //$me and $ume are shortcuts for user id
    urlTarget = urlTarget.replace(/\$me/gi, uid);
    urlTarget = urlTarget.replace(/\$ume/gi, "users/"+uid);
    
    var settings = {
        success: callback,
        method:"POST",
        data:{url:urlTarget, token:token},
        url:"api",
    }
    
    $.ajax(settings);
}