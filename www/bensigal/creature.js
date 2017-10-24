var statAbbreviations = ["STR", "SPD", "DEX", "CON", "WIL", "CHA", "ANA"];
class Creature{
    
    constructor(stats){
        if(!stats){
            stats = [10,10,10,10,10,10,10];
        }
        this.stats = stats;
        this.skills = {
            "maxHealth":0,
            "healthRegen": 0,
            "dodge":0,
            "initiative":0,
            "perception":0,
            "toHit":0,
            "mentalResistance":0,
            "physicalResistance":0,
            "manaRegen": 0,
            "maxMana":0,
            
        };
        this.bonuses = {};
        for(var key in this.skills){
            this.bonuses[key] = 0;
        }
        this.reloadSkills();
        this.health = this.skills.maxHealth;
        this.mana = this.skills.maxMana;
    }
    
    get maxHealth(){return this.skills.maxHealth;}
    get maxMana(){return this.skills.maxMana;}
    
    stat(index, value){
        if(typeof index == "string")index = statAbbreviations.indexOf(index.toUpperCase());
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
        
        this.skills.maxHealth   = this.stat("con") * 10 + this.bonuses.maxHealth;
        this.skills.healthRegen = this.stat("str") + this.bonuses.healthRegen;
        this.skills.dodge       = this.stat("spd") + this.stat("dex") + this.bonuses.dodge;
        this.skills.initiative  = this.stat("spd") + this.stat("ana") + this.bonuses.initiative;
        this.skills.perception  = this.stat("ana") + this.bonuses.perception;
        this.skills.toHit       = this.stat("dex") * 2 + this.bonuses.toHit;
        this.skills.mentalResistance    = this.stat("wil") + this.bonuses.mentalResistance;
        this.skills.physicalResistance  = this.stat("con") + this.bonuses.physicalResistance;
        this.skills.manaRegen   = this.stat("cha") + this.bonuses.manaRegen;
        this.skills.maxMana     = this.stat("cha") + this.bonuses.maxMana;
        
        this.checkMaxHealthAndMana()
        
    }
    checkMaxHealthAndMana(){
        if(this.maxHealth < this.health)this.health = this.maxHealth;
        if(this.maxMana < this.mana)this.mana = this.maxMana
    }
    damage(amount){
        amount = Math.ceil(amount);
        if(amount < 0)return;
        this.health -= amount;
        if(this.health < 1){
            println("You died!");
            submit = function(){};
        }
    }
    heal(damage){
        damage = Math.ceil(damage);
        if(damage < 0)return;
        this.health += damage;
        this.checkMaxHealthAndMana()
    }
    
}