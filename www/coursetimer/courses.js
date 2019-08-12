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
    addCourse(1, "Physics 1A - Mornings (lecture 1 or 2)", sci, [
        new Time(MONDAY, 8),
        new Time(TUESDAY, 8),
        new Time(WEDNESDAY, 8),
        new Time(FRIDAY, 8),
    ], "Physics 1A");
    addCourse(2, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1A Dis 1A", sciD, [
        new Time(TUESDAY, 2)
    ], "Phys 1A Dis");
    addCourse(3, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1A Dis 1B", sciD, [
        new Time(TUESDAY, 3)
    ], "Phys 1A Dis");
    addCourse(4, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1A Dis 1C", sciD, [
        new Time(TUESDAY, 4)
    ], "Phys 1A Dis");
    addCourse(5, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1A Dis 1D", sciD, [
        new Time(THURSDAY, 3)
    ], "Phys 1A Dis");
    addCourse(6, "&nbsp;&nbsp;&nbsp;&nbsp;Physics 1A Dis 1E", sciD, [
        new Time(THURSDAY, 4)
    ], "Phys 1A Dis");
    addCourse(8, "Intro to Computer Science I - Noon (lecture 1)", otherSci, [
        new Time(MONDAY, [12, 1]),
        new Time(WEDNESDAY, [12, 1])
    ], "CS 31");
    addCourse(13, "Intro to Computer Science I - Afternoon (lecture 2)", otherSci, [
        new Time(MONDAY, [4, 5]),
        new Time(WEDNESDAY, [4, 5])
    ], "CS 31");
    addCourse(9, "&nbsp;&nbsp;&nbsp;&nbsp;Intro to CS I Dis A/B/C", otherSciD, [
        new Time(FRIDAY, [10, 11])
    ], "CS 31 Dis");
    addCourse(10, "&nbsp;&nbsp;&nbsp;&nbsp;Intro to CS I Dis D/E/F", otherSciD, [
        new Time(FRIDAY, [12, 1])
    ], "CS 31 Dis");
    addCourse(11, "&nbsp;&nbsp;&nbsp;&nbsp;Intro to CS I Dis G/H", otherSciD, [
        new Time(FRIDAY, [2, 3])
    ], "CS 31 Dis");
    addCourse(12, "Electrical Engineering 1 Seminar", other, [
        new Time(WEDNESDAY, 5)
    ], "EC ENGR 1");
});