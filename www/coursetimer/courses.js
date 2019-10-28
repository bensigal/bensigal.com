var sci = "#F00";
var sciD = "#C00";
var otherSci = "#D60";
var otherSciD = "#A30";
var other = "#0D0";
var otherD = "#0A0";

//Create all of the courses
$(function(){
    addCourse(0, "Physics 1AH", sci, [
        new Time(TUESDAY, [12, 1]),
        new Time(THURSDAY, [12, 1])
    ]);
    addCourse(7, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1AH Dis 1A", sciD, [
        new Time(THURSDAY, 8)
    ], "Phys 1A Dis");
    addCourse(12, "Electrical Engineering 1 Seminar", other, [
        new Time(WEDNESDAY, 5)
    ], "EC ENGR 1");
	addCourse(1, "Math 32A", sci, [
		new Time(MONDAY, 2),
		new Time(WEDNESDAY, 2),
		new Time(FRIDAY, 2)
	]);
	addCourse(2, "&nbsp;&nbsp;&nbsp;&nbsp;Math 32A Dis 4B", sciD, [
		new Time(THURSDAY, 2)
	], "Math 32A D");
	addCourse(3, "History 11B", other, [
		new Time(MONDAY, 11),
		new Time(WEDNESDAY, 11),
		new Time(FRIDAY, 11)
	]);
	addCourse(4, "&nbsp;&nbsp;&nbsp;&nbsp;History 11B Dis 1C", otherD, [
		new Time(FRIDAY, 12)
	], "History 11BD");
	addCourse(5, "Engineering 96", otherSci, [
		new Time(FRIDAY, 9)
	]);
	addCourse(6, "Engineering 96D", otherSci, [
		new Time(FRIDAY, 10)
	]);
});