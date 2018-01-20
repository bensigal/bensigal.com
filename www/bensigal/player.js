class Player extends Creature{
    
    constructor(){
        super(false, "You", "You look at yourself in a mirror. You look exactly the same as always.");
        this.traits = [];
    }
    heal(damage){
        super.heal(damage);
        println("You healed "+damage+" damage!");
        this.printCurrentHealth();
    }
    damage(amount){
        super.damage(amount);
        println("You took "+amount+" damage!");
        this.printCurrentHealth();
    }
    printCurrentHealth(){
        println("Current HP: <span class='health'>"+this.health+"/"+this.maxHealth+"</span>")
    }
    get weapon(){
        if(this.weapon)return this.weapon;
        return noWeaponObject;
    }
    
}
var player = new Player();

var inventory = {
    items: [],
    maxSize: 10,
    setMaxSize: function(size){
        this.maxSize = size;
        while(this.items.length > size){
            println("Because your maximum inventory size changed, "+this.items[this.items.length - 1].name+" fell to the ground!");
            floorInventory.push(this.items.pop());
        }
    },
    get: function(index){
        return this.items[index];
    },
    add: function(item){
        println(item.name + " was added to your inventory!");
        if(this.items.length < this.maxSize){
            this.items.push(item);
            item.onObtain();
        }else{
            println("However, your inventory is full, so it fell to the ground.");
            floorInventory.push(item);
        }
    }
};

var floorInventory = [];