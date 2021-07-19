var mapNames = [
	"Empty Field",
	"Cage",
	"Ricochet",
	"Narrow"
];

maps = {
    "Empty Field": {
        hills: [],
        walls: [],
		name: "Empty Field",
		id: 0
    },
	//Cage
	"Cage": {
		hills: [],
		walls: [
			new Wall(550, 315, 10, 100),
			new Wall(550, 315, 100, 10),
			new Wall(550, 405, 100, 10),
			new Wall(640, 315, 10, 100)
		],
		name: "Cage",
		id: 1
	},
	//Richocet
	"Ricochet": {
		hills: [],
		walls: [
			new Wall(350, 280, 10, 170)
		],
		name: "Ricochet",
		id: 2
	},
	//Narrow
	"Narrow": {
		hills: [],
		walls: [
			new Wall(200, 285, 600, 10),
			new Wall(200, 435, 600, 10)
		],
		name: "Narrow",
		id: 3
	},
};