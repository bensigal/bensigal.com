var statAbbreviations = ["STR", "SPD", "DEX", "CON", "WIL", "WIS", "ANA"];
class Creature{
    
    constructor(stats){
        if(!stats){
            stats = [10,10,10,10,10,10,10];
        }
        this.stats = stats;
        this.str = stats[0];
        this.spd = stats[1];
        this.dex = stats[2];
        this.con = stats[3];
        this.wil = stats[4];
        this.wis = stats[5];
        this.ana = stats[6];
    }
    
}