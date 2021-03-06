class Map{
    constructor(startingPositions, blocks, zoneTexts, zones, options){
        this.startingPositions = startingPositions;
        this.blocks = blocks;
        this.zoneTexts = zoneTexts;
        this.zones = zones;
        if(options)
        this.w100SlowZones = options.w100SlowZones;
    }
}

var maps = {
    
    bigMoney: new Map(
        [
            [340, 430],
            [440, 430]
        ],
        
        [
            //Bottom Floor
            new Block(0,450,800,150),
            //Center Platform
            new Platform(120, 350, 560),
            //Center Top Divider
            new Block(390, 0, 20, 150),
            //Middle zone platform
            new Platform(100, 247, 600),
            //Middle zone outer walls
            new Block(200, 0, 20, 250),
            new Block(580, 0, 20, 250),
            //Middle upper zone platform
            new Platform(100, 147, 600),
            //Outer zone first floor
            new Platform(0, 350, 100),
            new Platform(700, 350, 100),
            //Outer zone second floor
            new Platform(0, 250, 100),
            new Platform(700, 250, 100),
            //Outer zone third floor
            new Platform(0, 150, 100),
            new Platform(700, 150, 100),
            //Outer zone fourth floor
            new Platform(0, 50, 100),
            new Platform(700, 50, 100),
            //Outer zone wall
            new Block(100, 0, 20, 353),
            new Block(680, 0, 20, 353),
        ],
        [
            new ZoneText(50,30),
            new ZoneText(50,100),
            new ZoneText(50,200),
            new ZoneText(50,300),
            new ZoneText(200, 400),
            new ZoneText(310, 70),
            new ZoneText(310, 200),
            new ZoneText(160, 70),
            new ZoneText(160, 200),
            
            new ZoneText(750,30),
            new ZoneText(750,100),
            new ZoneText(750,200),
            new ZoneText(750,300),
            new ZoneText(600, 400),
            new ZoneText(490, 70),
            new ZoneText(490, 200),
            new ZoneText(640, 70),
            new ZoneText(640, 200),
        ],
        [
            new Zone(0,0,100,50,1,9),
            new Zone(0,51,100,100,1,6),
            new Zone(0,51,100,200,1,4),
            new Zone(0,51,100,300,1,3),
            new Zone(0,351,400,100,1,1),
            new Zone(220,0,180,150,1,2),
            new Zone(220,150,180,100,1,1),
            new Zone(120,0,80,150,1,4),
            new Zone(120,150,80,100,1,3),
            
            new Zone(700,0,100,50,2,9),
            new Zone(700,51,100,100,2,6),
            new Zone(700,51,100,200,2,4),
            new Zone(700,51,100,300,2,3),
            new Zone(400,351,400,100,2,1),
            new Zone(410,0,180,150,2,2),
            new Zone(400,150,180,100,2,1),
            new Zone(600,0,80,150,2,4),
            new Zone(600,150,80,100,2,3),
        ],
        {
            w100SlowZones: false
        }
    ),
    original: new Map(
    
    [
        [340, 380],
        [440, 380],
    ],
    
    [
        //Bottom left/right square
        new Block(  0, 500, 100, 100),
        new Block(700, 500, 100, 100),
        //Small squares above the corners
        new Block(  0, 425,  25,  25),
        new Block(775, 425,  25,  25),
        //Floor of 2 zone
        new Block(100, 400, 100, 200),
        new Block(600, 400, 100, 200),
        //Center floor
        new Block(300, 400, 200, 200),
        //"Flag" in corners
        new Block(100, 375,  25,  25),
        new Block(675, 375,  25,  25),
        //"Flagpole" in corners
        new Block( 75, 350,  50,  25),
        new Block(675, 350,  50,  25),
        //Floor of 1 zone
        new Block(200, 300, 100, 300),
        new Block(500, 300, 100, 300),
        //Floor of 3 zone
        new Block(  0, 200, 100,  50),
        new Block(700, 200, 100,  50),
        //Center platform
        new Block(350, 200, 100,  50),
        //Inner wall of 3 zone
        new Block(100,   0,  25, 150),
        new Block(675,   0,  25, 150),
        //1 zone platform
        new Block(215, 125,  70,  25),
        new Block(515, 125,  70,  25),
    ], 
    [
        new ZoneText(250, 220),
        new ZoneText(150, 220),
        new ZoneText( 50, 120),
        new ZoneText( 50, 485),
        
        new ZoneText(550, 220),
        new ZoneText(650, 220),
        new ZoneText(750, 120),
        new ZoneText(750, 485),
    ],
    [
        new Zone(200, 0, 100, 500, 1, 1),
        new Zone(100, 0, 100, 500, 1, 2),
        new Zone(0, 0, 100, 200, 1, 3),
        new Zone(0, 450, 100, 50, 1, 4),
        
        new Zone(500, 0, 100, 500, 2, 1),
        new Zone(600, 0, 100, 500, 2, 2),
        new Zone(700, 0, 100, 200, 2, 3),
        new Zone(700, 450, 100, 50, 2, 4),
    ]),
    //Platforms map
    modified: new Map(
    
    [
        [340, 280],
        [440, 280],
    ],
    
    [
        //Bottom left/right square
        new Block(  0, 500, 100, 100),
        new Block(700, 500, 100, 100),
        //Floor of 2 zone
        new Block(100, 400, 100, 200),
        new Block(600, 400, 100, 200),
        //Platforms above 4 zone
        new Platform(  0, 400, 100),
        new Platform(700, 400, 100),
        //Platforms above 2 zone
        new Platform(  0, 300, 200),
        new Platform(600, 300, 200),
        //Floor of 3 zone
        new Platform(  0, 150, 100),
        new Platform(700, 150, 100),
        //Center platform
        new Platform(300, 200, 200),
        //Center floor
        new Block(200, 300, 400, 400),
        //Floor under 3 zone
        new Block(  0, 220, 100,  15),
        new Block(700, 220, 100,  15),
        //Inner wall of 3 zone
        new Block(100,   0,  25, 153),
        new Block(675,   0,  25, 153),
        //1 zone platform
        new Block(125, 125, 125,  28),
        new Block(550, 125, 125,  28),
    ], 
    [
        new ZoneText( 50, 445),
        new ZoneText( 50, 100),
        new ZoneText(100, 360),
        new ZoneText(190, 60),
        new ZoneText(190, 205),
        
        new ZoneText(750, 445),
        new ZoneText(750, 100),
        new ZoneText(700, 360),
        new ZoneText(600, 60),
        new ZoneText(600, 205),
    ],
    [
        new Zone(  0, 400, 100, 100, 1, 3),
        new Zone(  0,   0, 100, 150, 1, 4),
        new Zone(  0, 300, 200, 100, 1, 2),
        new Zone(125,   0, 125, 125, 1, 2),
        new Zone(  0, 150, 250, 150, 1, 1),
        
        new Zone(700, 400, 100, 100, 2, 3),
        new Zone(700,   0, 100, 150, 2, 4),
        new Zone(600, 300, 200, 100, 2, 2),
        new Zone(550,   0, 125, 125, 2, 2),
        new Zone(550, 150, 250, 150, 2, 1),
    ]),
    
    //Pyramid
    pyramid: new Map(
        
        [
            [320, 330],
            [460, 330],
        ],
        
        [
            new Block(0, 500, 800, 100),
            new Block(100, 450, 600, 100),
            new Block(200, 400, 400, 100),
            new Block(300, 350, 200, 100),
            new Block(350, 250, 100, 25)
        ],
        
        [
            new ZoneText(250, 200),
            new ZoneText(150, 200),
            new ZoneText( 50, 200),
            
            new ZoneText(550, 200),
            new ZoneText(650, 200),
            new ZoneText(750, 200),
        ],
        
        [
            new Zone(200, 0, 100, 600, 1, 1),
            new Zone(100, 0, 100, 600, 1, 2),
            new Zone(  0, 0, 100, 600, 1, 3),
            
            new Zone(500, 0, 100, 600, 2, 1),
            new Zone(600, 0, 100, 600, 2, 2),
            new Zone(700, 0, 100, 600, 2, 3),
        ]
        
    ),
    
    //Maze
    maze:new Map(
        
        [
            [350, 430],
            [430, 430]
        ],
        
        [
            //Whole-width floor
            new Block(  0, 450, 800, 150),
            //Walls of starting room
            new Block(300, 325, 25, 75),
            new Block(475, 325, 25, 75),
            //Block in mud room
            new Block(200, 350, 25, 25),
            new Block(575, 350, 25, 25),
            //Ceiling of starting room
            new Block(300, 300, 200, 25),
            //Wall of mud room
            new Block(175, 300, 25, 100),
            new Block(600, 300, 25, 100),
            //Ceiling of bottom/horizontal edge room
            new Block(  0, 300, 200, 25),
            new Block(600, 300, 200, 25),
            //Ceiling of center tunnel
            new Block(350, 250, 100, 25),
            //Floor of little hole
            new Block( 50, 225,  25, 25),
            new Block(725, 225,  25, 25),
            //Foothold to top corner rooms
            new Block(100, 200,  25, 25),
            new Block(675, 200,  25, 25),
            //Middle of S floor
            new Block(195, 175,  130, 25),
            new Block(475, 175,  130, 25),
            //Wall of little hole
            new Block( 75, 150, 25, 100),
            new Block( 700, 150, 25, 100),
            //Ceiling of little hole
            new Block(  0, 150, 75, 25),
            new Block(725, 150, 75, 25),
            //Floor of top of s
            new Block(300, 75, 87, 25),
            new Block(412, 75, 87, 25),
            //Outer side of s
            new Block(170, 0, 25, 250),
            new Block(605, 0, 25, 250),
            //Center wall
            new Block(387, 0, 25, 250),
        ],
        
        [
            new ZoneText(344, 50),
            new ZoneText(456, 50),
            
            new ZoneText(62, 200),
            new ZoneText(737, 200),
            
            new ZoneText(85, 50),
            new ZoneText(715, 50),
            
            new ZoneText(250, 100),
            new ZoneText(550, 100),
            
            new ZoneText(87, 370),
            new ZoneText(702, 370),
            
            new ZoneText(368, 230),
            new ZoneText(426, 230),
            
            new ZoneText(362, 370),
            new ZoneText(432, 370),
        ],
        
        [
            new Zone(300, 0, 87, 75, 1, 6),
            new Zone(412, 0, 87, 75, 2, 6),
            
            new Zone( 50, 175, 25, 50, 1, 4),
            new Zone(725, 175, 25, 50, 2, 4),
            
            new Zone(  0, 0, 170, 150, 1, 4),
            new Zone(630, 0, 170, 150, 2, 4),
            
            new Zone(195, 0, 105, 200, 1, 3),
            new Zone(499, 0, 106, 200, 2, 3),
            
            new Zone(  0, 300, 175, 150, 1, 2),
            new Zone(625, 300, 175, 150, 2, 2),
            
            new Zone(350, 200,  37,  50, 1, 1),
            new Zone(412, 200,  38,  50, 2, 1),
            
            new Zone(325, 325,  75, 125, 1, 1),
            new Zone(400, 325,  75, 125, 2, 1),
        ]
    )
}