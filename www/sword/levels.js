var levels = [
    {
        features: [
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 ), new FeaturePart( FeaturePart.MONEY_1, -8, 530)],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 ), new FeaturePart( FeaturePart.MONEY_1, -8, 530)],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 )],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 )],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 550 )],
            [new FeaturePart( FeaturePart.MONEY_1, -8, 530)],
        ],
        featureNumber: 5,
        featureLength: 100,
    },
    
    {
        features: [
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 ), new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 580 )],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 ), new FeaturePart( FeaturePart.MONEY_1, -8, 530)],
            [new FeaturePart( FeaturePart.SIMPLE_ENEMY, 0, 580 ), 
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 580 ),
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 550 ) 
            ],
            [new FeaturePart( FeaturePart.MONEY_1, 100, 520 ), 
            new FeaturePart( FeaturePart.MONEY_1, 100, 480 ), 
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 580 ),
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 550 ) 
            ],
            [new FeaturePart( FeaturePart.MONEY_1, 0, 510 ), 
                new FeaturePart( FeaturePart.MONEY_1, 0, 540 ), 
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 100, 580 ),
                new FeaturePart( FeaturePart.SIMPLE_ENEMY, 50, 520 ) 
            ],
            [new FeaturePart( FeaturePart.MONEY_1, -8, 530)],
        ],
        featureNumber: 3,
        featureLength: 200,
    }
];

function addFeatureSet(steps){
    
    activeFeatureSets.push({start: steps, length: calculateLength(levels[level])});
    
    var features = generateFeatures(levels[level], steps);
    
    Array.prototype.push.apply(enemies, features[0]);
    Array.prototype.push.apply(moneySprites, features[1]);
}

function calculateLength(level){
    return 300 + level.featureNumber * level.featureLength;
}

function generateFeatures(level, contextSteps){
    
    var enemyFeatures = [];
    var moneyFeatures = [];
    
    for(var i = 0; i < level.featureNumber; i++){
        
        var feature = level.features[Math.floor(Math.random()*level.features.length)];
        
        for(var featurePart of feature){
            var targetX = contextSteps - steps + 300 + i * level.featureLength;
            switch(featurePart.id){
            case FeaturePart.SIMPLE_ENEMY:
                enemyFeatures.push(new SimpleEnemy(targetX + featurePart.x, featurePart.y));
                break;
            case FeaturePart.MONEY_1:
                moneyFeatures.push(new Money(targetX + featurePart.x, featurePart.y, 1));
                break;
            }
        }
        
    }
    
    return [enemyFeatures, moneyFeatures];
    
}