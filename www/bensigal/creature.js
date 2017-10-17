var statAbbreviations = ["STR", "SPD", "DEX", "CON", "WIL", "WIS", "ANA"];
class Creature{
    
    constructor(stats){
        if(!stats){
            stats = [10,10,10,10,10,10,10];
        }
        this.stats = stats;
        this.skills = {
            "maxHp":0,
            "dodge":0,
            "initiative":0,
            "perception":0,
            "toHit":0,
        };
        this.bonuses = {};
        for(var key in this.skills){
            this.bonuses[key] = 0;
        }
        this.hp = this.maxHp;
        this.reloadSkills();
    }
    stat(index, value){
        if(typeof index == "string")index = statAbbreviations.indexOf(index);
        if(value){
            this.stats[index] = value;
            this.reloadSkills();
        }
        return this.stats[index];
    }
    getStat(abbreviation){
        return this.stats[statAbbreviations.indexOf(abbreviation)];
    }
    reloadSkills(){
        
        this.skills.maxHp = this.stats[3] * 10 + this.bonuses.maxHp;
        this.skills.dodge = this.stats[2] + this.stats[1] + this.bonuses.dodge;
        this.skills.perception = this.stats[6] + this.bonuses.perception;
        
        if(this.skills.maxHp > this.hp)this.hp = this.skills.maxHp;
    }
    heal(damage){
        damage = Math.ceil(damage);
        if(damage < 0)return;
        this.hp += damage;
        if(this.skills.maxHp > this.hp)this.hp = this.skills.maxHp;
    }
    
}