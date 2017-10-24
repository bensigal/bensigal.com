var statAbbreviations = ["STR", "SPD", "DEX", "CON", "WIL", "CHA", "ANA"];

var noWeaponObject = {
    name: "Bare Hands",
    description: "You are fighting with your bare hands. Unfortunately, these do not function as Bear Hands. No damage bonus, no hit bonus, crits do not multiply damage.",
    toHit:0,
    damage:0,
    critMultiplier:1
}

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
            "inventorySize":0,
            "physicalDamage":0,
        };
        this.bonuses = {};
        for(var key in this.skills){
            this.bonuses[key] = 0;
        }
        this.reloadSkills();
        this.health = this.skills.maxHealth;
        this.mana = this.skills.maxMana;
    }
    get weapon(){
        return this._weapon || noWeaponObject
    }
    set weapon(val){
        this._weapon = val;
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
        this.skills.inventorySize       = this.stat("str") + this.bonuses.inventorySize;
        this.skills.physicalDamage      = this.stat("str") + this.bonuses.physicalDamage;
        
        if(this instanceof Player && inventory){
            inventory.setMaxSize(player.stat("str"));
        }
        
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
    takeAction(){
        this.attack(player);
    }
    attack(target){
        if(this instanceof Player) println("You attack " + target.name + " with your "+this.weapon.name);
        else println(this.name + " attacks " + target.name + " with its "+this.weapon.name+".");
        console.log("to hit: "+ this.skills.toHit + this.weapon.toHit);
        var roll = d20();
        var total = roll + this.skills.toHit + this.weapon.toHit;
        console.log("roll: "+roll+" for a total of "+total);
        if(this instanceof Player){
            println("You have a "+(this.skills.toHit + this.weapon.toHit) + " to hit.");
            println("You rolled a "+span("roll", roll)+", for a total of "+span("roll", total));
        }
        if(total >= target){
            if(total - target < 1){
                println("It barely manages to hit.");
            }else if(total - target < 4){
                println("It hits.");
            }else if(total - target < 10){
                println("It hits easily.");
            }else if(total - target < 20){
                println("It hits quite easily.");
            }else{
                println("It hits with ridiculous ease.");
            }
            var damage = this.skills.physicalDamage + this.weapon.damage;
            println("It deals "+damage+" damage!");
            target.damage(damage);
        }else{
            if(target - total < 2){
                println("It barely misses.");
            }else{
                println("It misses.");
            }
        }
    }
    
}