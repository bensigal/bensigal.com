var room;
function enterRoom(newRoom){
    room = newRoom;
    room.init();
}
class Room{
    constructor(){
        
    }
    init(){}
    command(words){}
    getInteriorDescription(){
        if(this.interiorDescription)return this.interiorDescription;
        this.interiorDescription = "This room has a "+randomNoun()+" made of "+randomMaterial()+" hidden under a "+randomNoun()+" made of "+randomMaterial()+". These don't seem useful.";
        return this.interiorDescription;
    }
    getExteriorDescription(){
        return "This door seems pretty average.";
    }
}