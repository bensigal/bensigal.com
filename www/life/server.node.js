var boardLength = 150;
var boardHeight = 150;

var server = module.exports;

server.board = [];
server.ticks = 0;

server.serializeAll = function(server){
    return function(){
        //Serialize all the things
        return server.board.map(
            (element) => {
                return element.map(
                    (square) => {return square.initial()}
                ).join("");
            }
        ).join("\n");
    };
}(server);

server.stop = function(server){
    return function(){
        delete server.board;
        clearInterval(server.intervalCode);
    }
}(server);

var templates = {
    blank: {
        tick: () => {},
        create: function(){
            this.food = 0;
        },
        serialize: () => {return "b0"}, 
        initial: () => {return "b"}
    },
    carnivore: {
        tick: function(){
            if(this.movedOn == server.ticks)return;
            this.food--;
            var randomAdjacent = this.randomAdjacent();
            this.getAllAdjacent().forEach(function(element){
                if(element.type == "hungry"){
                    this.food += element.food;
                    element.setType("blank");
                }
            }, this);
            randomAdjacent = this.randomAdjacent();
            if(this.food > 1000){
                if(randomAdjacent.type == "blank"){
                    randomAdjacent.setType("carnivore");
                    this.food -= 750;
                }
            }else if(randomAdjacent.type == "blank"){
                this.moveTo(randomAdjacent);
                this.universalTick();
            }
        },
        create: function(){this.food = 250},
        serialize: function(){
            return "c"+this.food;
        },
        initial: () => {return "c"}
    },
    phyto: {
        tick: function(){
            this.food++;
            if(this.food > 50){
                var randomAdjacent = this.randomAdjacent();
                if(randomAdjacent.type == "blank"){
                    randomAdjacent.setType("phyto");
                    this.food -= 25;
                }else if(randomAdjacent.type == "phyto"){
                    randomAdjacent.food+=25;
                    this.food-=25;
                }
            }
            if(Math.random() < 0.0005){
                this.setType("hungry");
            }
        },
        create: function(){this.food=25},
        serialize: function(){return "p"+this.food},
        initial: () => {return "p"}
    },
    hungry: {
        tick: function(){
            if(this.movedOn == server.ticks)return;
            this.food--;
            var randomAdjacent = this.randomAdjacent();
            this.getAllAdjacent().forEach(function(element){
                if(element.type == "phyto"){
                    this.food += element.food/2;
                    element.setType("blank");
                }
            }, this);
            randomAdjacent = this.randomAdjacent();
            if(this.food > 100){
                if(randomAdjacent.type == "blank"){
                    randomAdjacent.setType("hungry");
                    this.food -= 75;
                }
            }else if(randomAdjacent.type == "blank"){
                this.moveTo(randomAdjacent);
                this.universalTick();
            }
            if(Math.random() < 0.0005){
                this.setType("carnivore");
            }
        },
        create: function(){this.food = 25},
        serialize: function(){return "h"+this.food},
        initial: () => {return "h"}
    }
}

class Square{
    
    constructor(row, col){
        this.row = row;
        this.col = col;
    }
    
    setType(requestedType){
        
        this.type = requestedType;
        this.tick = templates[requestedType].tick;
        this.create = templates[requestedType].create;
        this.serialize = templates[requestedType].serialize;
        
        this.create();
        
    }
    
    getAllAdjacent(){
    	
    	var result = [];
    	
    	if(server.board[this.row - 1])
	    	result.push(server.board[this.row-1][this.col]);
    	if(server.board[this.row + 1])
	    	result.push(server.board[this.row+1][this.col]);
    	if(server.board[0][this.col - 1])
	    	result.push(server.board[this.row][this.col-1]);
    	if(server.board[0][this.col + 1])
	    	result.push(server.board[this.row][this.col+1]);
	    	
	return result;
    	
    }
    
    //square must be blank
    moveTo(square){
        square.setType(this.type);
        square.food = this.food;
        square.movedOn = server.ticks;
        this.setType("blank");
    }
    
    toString(){
        return this.type;
    }
    
    randomAdjacent(){
        var result = null;
        while(!result){
            switch(Math.floor(Math.random()*4)){
                
            case 0:
                if(server.board[this.row - 1])
                    result = server.board[this.row-1][this.col];
                break;
            case 1:
                if(server.board[this.row + 1])
                    result = server.board[this.row+1][this.col];
                break;
            case 2:
                result = server.board[this.row][this.col + 1];
                break;
            case 3:
                result = server.board[this.row][this.col - 1];
                break;
                
            }
        }
        return result
    }
    
    universalTick(){
        if(this.food < 0){
            this.setType("blank");
        }
        if(Math.random() < 0.0005){
            this.setType("phyto");
        }
    }
    
}

for(var row = 0; row < boardHeight; row++){
    
    server.board.push([]);
    for(var col = 0; col < boardLength; col++){
        server.board[row].push(new Square(row, col));
    }
}

server.createBoard = function(server){
    return function(){
        server.board.forEach(function(element, index){
            element.forEach(function(element, index){
                element.setType("blank");
            });
        });
    };
}(server);

server.tick = function(server){
    return function(){
    	server.ticks++;
        server.board.forEach(function(row, index){
            row.forEach(function(square, index){
                square.tick();
                square.universalTick();
            });
        });
    };
}(server);

server.start = function(server){
    return function(){
        server.createBoard();
        
        for(var i = 0; i < 400; i++){
            server.tick();
        }
        
        server.intervalCode = setInterval(server.tick, 500);
    };
}(server);