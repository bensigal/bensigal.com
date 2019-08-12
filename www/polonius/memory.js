var objects = [
	"Ms. Foster",
	"PHS",
	"a lion",
	"room 38",
	"Benjamin Sigal",
	"a cardboard crown",
	"a castle",
	"King Claudius",
	"curtains",
	"an embarrassing letter",
	"a jug of ear poison",
	"a ghost",
	"a self-portrait",
	"a cloud",
	"someone named Gogol",
	"Shakespeare's hat"
];

var chosen, shownOrder, memoryCorrect, correctlyGuessed;

function prepareMemoryNarration(){
	chosen = [];
	memoryCorrect = 0;
	while(chosen.length < 8){
		var randomObject = objects[Math.floor(Math.random()*objects.length)];
		if(chosen.indexOf(randomObject) < 0){
			chosen.push(randomObject);
		}
	}
	narrationLettersLeft = [
		"Well, that first cloud looks like............ "+chosen[0],
		"If I have to choose for the second cloud..... "+chosen[1],
		"The third cloud is obviously................. "+chosen[2],
		"Which must make the fourth cloud............. "+chosen[3],
		"I'm not sure about the fifth, but I think.... "+chosen[4],
		"Which makes me confident that the sixth is... "+chosen[5],
		"Following from that, the seventh one is...... "+chosen[6],
		"Finally, the last one is..................... "+chosen[7],
		"",
		"You have 10 seconds to memorize. Think fast!"
	]
	setTimeout(prepareMemory, 23000);
}

function prepareMemory(){
	scene = "memory";
	sceneReady = false;
	shownOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
	correctlyGuessed = [false, false, false, false, false, false, false, false];
}

function renderMemory(){
	
	ctx.drawImage($("#cloudsImage")[0], 0, 0);
	
	ctx.textAlign = "center";
	for(var i = 0; i < 8; i+=2){
		
		ctx.fillStyle = "#DDD";
		if(mouse.x > 100 && mouse.x < 400 &&
			mouse.y > 100+100*(i/2) &&
			mouse.y < 200+100*(i/2) )
		{
			ctx.fillStyle = "#CCC";
		}
		if(correctlyGuessed[i]){
			ctx.fillStyle = "#0F0";
		}
		
		ctx.fillRect(100, 100+100*(i/2), 300, 100);
		
		ctx.fillStyle = "black";
		ctx.fillText(chosen[shownOrder[i]], 250, 160+100*(i/2));
	}
	
	for(var i = 1; i < 8; i+=2){
		
		ctx.fillStyle = "#DDD";
		var height = 100 + 100*(i-1)/2;
		if(mouse.x > 400 && mouse.x < 700 &&
			mouse.y > height &&
			mouse.y < 100+height )
		{
			ctx.fillStyle = "#CCC";
		}
		if(correctlyGuessed[i]){
			ctx.fillStyle = "#0F0";
		}
		
		ctx.fillRect(400, height, 300, 100);
		
		ctx.fillStyle = "black";
		ctx.fillText(chosen[shownOrder[i]], 550, 60+height);
	}
}

function memoryProcessClick(){
	
	//If mouse isn't on one of the eight buttons, do nothing
	if(mouse.y < 100 || mouse.y > 500 || mouse.x < 100 || mouse.x > 700){
		return;
	}
	//If on the left side
	var index;
	if(mouse.x < 400){
		index = 
			Math.floor((mouse.y - 100) / 100) //starting from the top of the buttons (100), how many 100's down?
			* 2 //because only even on left
	}else{
		index = 
			Math.floor((mouse.y - 100) / 100) * 2 + 1 //One more than the one on the left
	}
	//if this one was already guessed ignore the click
	if(correctlyGuessed[index])return;
	//If it's not the right one
	if(shownOrder[index] != memoryCorrect){
		console.log([shownOrder, shownOrder.indexOf(index), index, memoryCorrect]);
		prepareNarration(6);
	}else{
		correctlyGuessed[index] = true;
		memoryCorrect++;
		if(memoryCorrect == 8){
			setTimeout(function(){
				prepareNarration(1)
			}, 500);
		}
	}
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
