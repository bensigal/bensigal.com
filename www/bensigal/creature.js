var statAbbreviations = ["STR", "SPD", "DEX", "CON", "WIL", "WIS", "ANA"];
class Creature{
    
    constructor(stats){
        if(!stats){
            stats = [10,10,10,10,10,10,10];
        }
        this.stats = stats;
        this.hpBonus = 0;
        this.dodgeBonus = 0;
        this.initiativeBonus = 0;
        this.hitBonus = 0;
        reloadStats();
    }
    setStat(index, value){
        this.stats[index] = value;
        reloadStats();
    }
    reloadStatBased(){
        this.maxHp = this.stats[3] + this.hpBonus;
        this.dodge = this.stats[2] + this.stats[1] + this.dodgeBonus;
    }
    
}