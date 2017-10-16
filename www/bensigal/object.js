class Item{
    constructor(description){
        this.description = description;
    }
    onObtain(){
        
    }
    onLoss(){
        
    }
}
class BonusItem{
    
    constructor(description, property, amount){
        super(description);
        this.property = property;
        this.amount = amount;
    }
    onObtain(){
        super();
        player[this.property+"Bonus"] += this.amount;
        player.reloadStatBased();
    }
    onLoss(){
        super();
        player[this.property+"Bonus"] -= this.amount;
    }
    
}
class MultiBonusItem{
    
    constructor(description, properties, amounts){
        super(description);
    }
    onObtain(){
        super();
        properties.forEach(function(element, index){
            player[element+"Bonus"] += amounts[index];
        })
    }
    onLoss(){
        super();
        properties.forEach(function(element, index){
            player[element+"Bonus"] -= amounts[index];
        })
    }
    
}
class Weapon{
    constructor(description, toHit, damage, critMultiplier){
        super(description);
        this.toHit = toHit;
        this.damage = damage;
        this.critMultiplier = critMultiplier;
    }
}

var items = {
    rustyOldSword: new Weapon("This sword is made of rusty wood. It's useless unless you <b>equip</b> it. No hit bonus, no damage bonus, crits deal x2 damage.", 0, 0, 2),
    lensLessMonocle: new BonusItem("This is a monocle without a lens. +1 to hit, +1 perception.", ["hit", "perception"], [1,1])
};