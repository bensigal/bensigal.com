class Item{
    constructor(name, description){
        this.name = name;
        this.description = description;
    }
    onObtain(){
        
    }
    onLoss(){
        
    }
}
class BonusItem extends Item{
    
    constructor(name, description, property, amount){
        super(name, description);
        this.property = property;
        this.amount = amount;
    }
    onObtain(){
        super.onObtain();
        player.bonuses[this.property] += this.amount;
        player.reloadSkills();
    }
    onLoss(){
        super.onLoss();
        player.bonuses[this.property] -= this.amount;
        player.reloadSkills();
    }
    
}
class MultiBonusItem extends Item{
    
    constructor(name, description, properties, amounts){
        super(name, description);
        this.properties = properties;
        this.amounts = amounts;
    }
    onObtain(){
        super.onObtain();
        this.properties.forEach(function(element, index){
            player.bonuses[element] += this.amounts[index];
        }, this);
        player.reloadSkills();
    }
    onLoss(){
        super.onLoss();
        this.properties.forEach(function(element, index){
            player.bonuses[element] -= this.amounts[index];
        });
        player.reloadSkills();
    }
    
}
class Weapon extends Item{
    constructor(name, description, toHit, damage, critMultiplier){
        super(name, description);
        this.toHit = toHit;
        this.damage = damage;
        this.critMultiplier = critMultiplier;
    }
}
class UsableItem extends Item{
    constructor(name, description, onUse, onObtain = false, onLoss = false){
        super(name, description);
        this.onUse = onUse;
        if(onObtain)this.onObtain = onObtain;
        if(onLoss)this.onLoss = onLoss;
    }
}

//Each element is an array of the items with rarity index
var items = [
    //Rarity 0
    [
        new Weapon("Rusty Stick", "This stick is rusty. It's useless unless you <b>equip</b> it. 2 hit bonus, 2 damage bonus, crits deal x2 damage.", 2, 2, 2),
        new MultiBonusItem("Lensless Monocle", "This is a monocle without a lens. +1 to hit, +1 perception.", ["hit", "perception"], [1,1]),
        new MultiBonusItem("Old smelly banana", "This an old banana. It is smelly, but healthy to hold. -1 Perception, +3 max hp.", ["perception", "maxHealth"], [-1,10]),
        new UsableItem("Glass of Water", "This is an item Ben needs to live. Use to heal 20 hit points.", function(){
            player.heal(20);
        }),
    ]
]