var room;
var level = 0;
function enterRoom(newRoom){
    println("<hr>");
    room = newRoom;
    room.generateInteriorDescription();
    if(!newRoom.hideDescription)println(room.interiorDescription);
    room.init();
}
function generateRandomRoom(){
    var index = Math.random()*100;
    if(index < 30){
        return new EmptyRoom();
    }
    if(index < 100){
        return new TrapRoom();
    }
}
function threeDoors(){
    enterRoom(new ThreeDoorsRoom());
}
class Room{
    constructor(){}
    init(){}
    command(words){
        if(words[0] == "leave" && this.allowLeaving){
            threeDoors();
        }
    }
    generateInteriorDescription(){
        if(this.interiorDescription)return this.interiorDescription;
        this.interiorDescription = "This room has a "+randomNoun()+" made of "+randomMaterial()+" hidden under a "+randomNoun()+" made of "+randomMaterial()+". These don't seem useful.";
    }
    getExteriorDescription(){
        return "This door seems pretty average.";
    }
    allowLeaving(){
        this.allowLeaving = true;
        if(level < 10)println("Enter &quot;leave&quot; to leave.");
    }
}
class EmptyRoom extends Room{
    init(){
        println("Seeing nothing interesting in this room, you decide to move on.");
        this.allowLeaving();
    }
}
class IntroRoom extends Room{
    constructor(){
        super();
        this.hideDescription = true;
    }
    init(){
        println("Welcome to this game. It is a good game.");
        println("You find yourself in a dark room.");
        println("The room is triangular, with a low ceiling.");
        println("Each wall has a door in it with a sign above. They read Courage, Faith, and Honor.");
        println("(Enter &quot;help&quot; to see a list of commands. Enter &quot;help all&quot; to see a list of commands and their functions.");
        println("(Enter one of the words to go through the respective door.)");
    }
    command(words){
        var choice = words[0];
        console.log("recieving command "+choice);
        if(["honor", "courage", "faith"].indexOf(choice) < 0){
            return false;
        }
        println("You have chosen: "+choice);
        gainTrait(choice);
        enterRoom(new IntroStatBalancingRoom(0));
        return true;
    }
}
class ThreeDoorsRoom extends Room{
    constructor(){
        super();
        this.hideDescription = true;
    }
    init(){
        level++;
        println("Level "+level);
        println("You find yourself in a dark room.");
        println("The room is triangular, with a low ceiling. Each wall has a door.");
        if(player.health < player.maxHealth){
            println("Your natural regenration (STR) kicks in.");
            player.heal(player.stat("str"));
        }
        var roll = d20();
        var perception = roll + player.skills.perception;
        println("You examine your options. Your perception is "+player.skills.perception+", you rolled a "+roll+", for a total of "+perception);
        this.rooms = [];
        for(var i = 1; i <= 3; i++){
            var newRoom = generateRandomRoom();
            this.rooms.push(newRoom);
            println("Door "+i+": "+newRoom.getExteriorDescription(perception));
        }
        println("Enter &quot;1&quot;, &quot;2&quot;, or &quot;3&quot; to choose.");
    }
    command(words){
        var choice = words[0];
        console.log("recieving command "+choice);
        if(["1", "2", "3", "door"].indexOf(choice) < 0){
            return false;
        }
        if(choice == "door")choice = words[1];
        enterRoom(this.rooms[Number(choice)-1]);
        return true;
    }
}
class IntroStatBalancingRoom extends Room{
    
    constructor(index){
        super();
        this.hideDescription = true;
        this.index = index;
        this.stat1Index = this.index * 2;
        this.stat2Index = this.index * 2 + 1;
        this.stat1Name = statAbbreviations[this.stat1Index];
        this.stat2Name = statAbbreviations[this.stat2Index];
    }
    init(){
        println("You enter a new room and have an urge to change yourself.");
        println("You may now balance your "+this.stat1Name+" and your "+this.stat2Name);
        println("Enter an integer less than 20 and more than 1 that you want your "+this.stat1Name+" to be. Your "+this.stat2Name+" will be 20 - whatever you enter.");
        println("Enter &quot;info stats&quot; to see a description of the stats.");
    }
    command(words){
        var choice = words[0];
        if(choice != Number(choice)){
            return false;
        }
        choice = Math.floor(choice);
        if(!(0 < choice && choice < 20) || Math.floor(choice) != choice){
            return println("Please enter an integer less than 20 and more than 1.");
        }
        player.stat(this.stat1Index, choice);
        player.stat(this.stat2Index, 20 - choice);
        if(this.index < 2)
            enterRoom(new IntroStatBalancingRoom(this.index + 1));
        else{
            player.hp = player.maxHp;
            enterRoom(new IntroItemsRoom());
        }
    }
    
}
class IntroItemsRoom extends Room{
    constructor(){
        super();
        this.interiorDescription = "This room has several items lying conveniently on a silver platter. Unfortunately, the silver platter is a hologram. Or maybe a metaphor.";
    }
    init(){
        println("You take the items.");
        if(player.stat("str") < items[0].length){
            println("Unfortunately, you're hella weak, so you drop some of them.");
        }
        items[0].forEach(function(element, index){
            inventory.add(element);
        });
        println("You see nothing else interesting, and decide to leave as quickly as possible.");
        this.allowLeaving();
    }
}
class TrapRoom extends Room{
    constructor(){
        super();
        this.interiorDescription = "There are STAIRS in this room!";
    }
    getExteriorDescription(perception){
        if(perception > 45){
            return "This room contains stairs.";
        }
        if(perception > 35){
            return "This room smells like a useless waste of time.";
        }
        if(perception > 25){
            return "This room smells like it can hurt.";
        }
        return super.getExteriorDescription();
    }
    init(){
        println("Even just looking at the stairs causes you great psychological trauma.");
        player.damage(level);
        println("You leave this room as quickly as you can.");
        threeDoors();
    }
}
function randomNoun(){
    var nouns = ["laptop", "bed", "table", "head", "corpse", "statue", "painting", "periodic table of the elements", "philosophy textbook", "psat answer key", "dead pikachu", "dead squirrel", "dead koala", "dead horse", "half of a fedora", "footpath", "welcome mat", "keyboard", "copy of Trailblazer", "board game",'copy of Squad Leader'];
    return nouns[Math.floor(Math.random()*nouns.length)];
}
function randomMaterial(){
    var materials = ["denim", "hopes and dreams", "death", "intangible concepts", "vegetables", "old laptop parts", "unstrustworthy construction components", "paint", "corpses", "trees", "amoeba", "plastic", "vomit", "spit", "blood", "diabolical runes", "chalk", "pure magic", "darkness", "light", "orange juice", "board games", "older"]
    return materials[Math.floor(Math.random()*materials.length)];
}