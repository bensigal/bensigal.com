class Item{
    
    constructor(description, cost, activate){
        this.description = description;
        this.cost = cost;
        this.activate = activate;
    }
    
}
var tier1items = [
    new Item(["Anti-Gravity", "Unreliable", "$10"], 10, () => {player.hoverType = Player.SHAKY_HOVER}),
    new Item(["Jump-Boost", "Weak", "$10"], 10, () => {player.jumpHeight = 15}),
    new Item(["Running Boots", "Weak", "$10"], 10, () => {player.horizontalSpeed = 0.7}),
    new Item(["Life Refill", "Up to 5", "$10"], 10, () => {player.lives = 5}),
]