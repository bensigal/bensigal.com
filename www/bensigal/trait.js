var traits = {
    honor:{
        name:"Honorable",
        key:"honor",
        description:"People and creatures can easily recognize your honor. Some effects are that enemies can never sneak up on you, and NPCs will be more likely to trust you. Certain actions may cause you to lose this trait.",
    },
    faith:{
        name:"Faithful",
        key:"faith",
        description:"Your god looks down upon you favorably, and may save you in a time of crisis. The first time you die, you will be revived." 
    },
    courage:{
        name:"Courage",
        key: "courage",
        description:'You have a strong sense of valor and bravery to push through adversity, to the point where you are well known as very stubborn. Fighting for a long time will temporarily increase your stats.'
    }
}
function gainTrait(choice){
    var trait = traits[choice];
    player.traits.push(trait);
    if(trait.init)trait.init();
    println("You have gained the trait: <span class='attr'>"+trait.name+"</span>");
    println(trait.description);
}