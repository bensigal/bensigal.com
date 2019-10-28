var sci = "#F00";
var sciD = "#C00";
var otherSci = "#D60";
var otherSciD = "#A30";
var other = "#0D0";
var otherD = "#0A0";

//Create all of the courses
$(function(){
	//Honors physics, 5 units
    addCourse("Physics 1BH", sci, [
        new Time(T, [12, 1]),
        new Time(R, [12, 1])
    ]);
    addCourse("TABPhysics 1BH Dis 1A", sciD, [
        new Time(M, 9)
    ], "Phys 1BH-D");
	
	//Physics lab, 2 units
	addCourse("Physics 4AL-1", sci, [
		new Time(M, [8, 9]),
		new Time(W, [8, 9])
	]);
	addCourse("Physics 4AL-2", sci, [
		new Time(M, [10, 11]),
		new Time(W, [10, 11])
	]);
	addCourse("Physics 4AL-3", sci, [
		new Time(M, [12, 1]),
		new Time(W, [12, 1])
	]);
	addCourse("Physics 4AL-4", sci, [
		new Time(M, [2, 3]),
		new Time(W, [2, 3])
	]);
	addCourse("Physics 4AL-5", sci, [
		new Time(T, [8, 9]),
		new Time(R, [8, 9])
	]);
	addCourse("Physics 4AL-6", sci, [
		new Time(T, [10, 11]),
		new Time(R, [10, 11])
	]);
	addCourse("Physics 4AL-7", sci, [
		new Time(T, [12, 1]),
		new Time(R, [12, 1])
	]);
	addCourse("Physics 4AL-8", sci, [
		new Time(T, [2, 3]),
		new Time(R, [2, 3])
	]);
	//Physics, 5 units
	addCourse("Physics 1B-1", sci, new Time([T, R], [2, 3]));
	addCourse("TABPhysics 1B-1A", sciD, new Time(M, 12));
	addCourse("TABPhysics 1B-1B", sciD, new Time(M, 1));
	addCourse("TABPhysics 1B-1C", sciD, new Time(M, 2));
	addCourse("TABPhysics 1B-1D", sciD, new Time(W, 4));
	addCourse("TABPhysics 1B-1E", sciD, new Time(W, 5));
	
	addCourse("Physics 1B-2", sci, new Time([T, R], [12, 1]));
	addCourse("TABPhysics 1B-2A", sciD, new Time(M, 9));
	addCourse("TABPhysics 1B-2B", sciD, new Time(M, 11));
	addCourse("TABPhysics 1B-2C", sciD, new Time(W, 9));
	addCourse("TABPhysics 1B-2D", sciD, new Time(W, 10));
	addCourse("TABPhysics 1B-2E", sciD, new Time(M, 10));
	
	//Multivar, 4 units
	addCourse("Math 32B-1", otherSci, new Time([M, W, F], 8));
	addCourse("TABMath 32B-1A", otherSciD, new Time(T, 8));
	addCourse("TABMath 32B-1B", otherSciD, new Time(R, 8));
	
	addCourse("Math 32B-2", otherSci, new Time([M, W, F], 10));
	addCourse("TABMath 32B-2A", otherSciD, new Time(T, 10));
	addCourse("TABMath 32B-2B", otherSciD, new Time(R, 10));
	
	addCourse("Math 32B-3", otherSci, new Time([M, W, F], 11));
	addCourse("TABMath 32B-3A", otherSciD, new Time(T, 11));
	addCourse("TABMath 32B-3B", otherSciD, new Time(R, 11));
	
	addCourse("Math 32B-4", otherSci, new Time([M, W, F], 4));
	addCourse("TABMath 32B-4A", otherSciD, new Time(T, 4));
	addCourse("TABMath 32B-4B", otherSciD, new Time(R, 4));
	
	//Linear algebra, 4 units
	addCourse("Math 33A-1", otherSci, new Time([M, W, F], 11));
	addCourse("TABMath 33A-1A", otherSciD, new Time(T, 11));
	addCourse("TABMath 33A-1B", otherSciD, new Time(R, 11));
	
	addCourse("Math 33A-2", otherSci, new Time([M, W, F], 12));
	addCourse("TABMath 33A-2A", otherSciD, new Time(T, 12));
	addCourse("TABMath 33A-2B", otherSciD, new Time(R, 12));
	
	addCourse("Math 33A-3", otherSci, new Time([M, W, F], 2));
	addCourse("TABMath 33A-3A", otherSciD, new Time(T, 2));
	addCourse("TABMath 33A-3B", otherSciD, new Time(R, 2));
	
	//Chemistry for Eng/phys sci, 4 units
	addCourse("Chem 20A", sci, new Time([M, W, F], 2));
	addCourse("TABChem 20A-A", sciD, new Time(T, 8));
	addCourse("TABChem 20A-B", sciD, new Time(T, 9));
	addCourse("TABChem 20A-C", sciD, new Time(W, 8));
	addCourse("TABChem 20A-D", sciD, new Time(W, 9));
	addCourse("TABChem 20A-E", sciD, new Time(R, 8));
	addCourse("TABChem 20A-F", sciD, new Time(R, 9));
	addCourse("TABChem 20A-G", sciD, new Time(R, 1));
	addCourse("TABChem 20A-H", sciD, new Time(F, 10));
	addCourse("TABChem 20A-I", sciD, new Time(F, 1));
	
	//Intro to CS, 4 units
	addCourse("CS 31", other, new Time([M, W], [4, 5]));
	addCourse("TABCS 31-1AB", otherD, new Time(F, [10, 11]));
	addCourse("TABCS 31-1CD", otherD, new Time(F, [12, 1]));
	addCourse("TABCS 31-1EF", otherD, new Time(F, [2, 3]));
	addCourse("TABCS 31-1GH", otherD, new Time(F, [4, 5]));
	addCourse("TABCS 31-1IJ", otherD, new Time(F, [6, 7]));
	
	//Major events in history of life, 4 units 
	addCourse("EPS 16*", other, new Time([T, R], [9, 10]));
	addCourse("TABEPS 16-1A", otherD, new Time(W, [9, 10]));
	addCourse("TABEPS 16-1B", otherD, new Time(W, [11, 12]));
	addCourse("TABEPS 16-1C", otherD, new Time(W, [1, 2]));
	addCourse("TABEPS 16-1D", otherD, new Time(W, [3, 4]));
	
});