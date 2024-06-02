class Vector{
    constructor(amplitude, angle){
        this.amplitude = amplitude;
        this.angle = angle;
    }
    get amplitude(){
        return this._amplitude;
    }
    set amplitude(value){
        if(Math.abs(value) < Vector.amplitudeTolerance){
            value = 0;
        }
        if(value < 0){
            value = 0;
        }
        this._amplitude = value;
        return value;
    }
    get angle(){
        return this._angle;
    }
    set angle(value){
        while(value < 0){
            value += Math.PI*2;
        }
        while(value >= Math.PI*2){
            value -= Math.PI*2;
        }
        this._angle = value;
        return this._angle;
    }
    get y(){
        return this.amplitude * Math.sin(this.angle);
    }
    get x(){
        return this.amplitude * Math.cos(this.angle);
    }
    set x(postX){
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        if(preY === 0){
            preY = 0;
        }
        
        this.amplitude = Math.sqrt(postX*postX + preY*preY);
        this.angle = Math.atan2(preY,postX);
    }
    set y(postY){
        var preX = this.x;
        var preY = this.y;
        
        //-0 can cause problems with atan
        if(preX === 0){
            preX = 0;
        }
        if(preY === 0){
            preY = 0;
        }
        
        this.amplitude = Math.sqrt(preX*preX + postY*postY);
        this.angle = Math.atan2(postY,preX);
    }
    
    plus(other){
        var result = this.clone();
        result.x += other.x;
        result.y += other.y;
        return result;
    }
    
    minus(other){
        var result = this.clone();
        result.x -= other.x;
        result.y -= other.y;
        return result;
    }
    
    minusLog(other){
        var result = this.clone();
        result.x -= other.x;
        result.y -= other.y;
        console.log([this.x, this.y, other.x, other.y, result.x, result.y]);
        return result;
    }
    
    distanceTo(other){
        return this.minus(other).amplitude;
    }
    
    clone(){
        return new Vector(this.amplitude, this.angle);
    }
    
    angleTo(other){
        return other.minus(this).angle;
    }
}
Vector.amplitudeTolerance = 0.1;

Vector.xy = function(x, y){
    var result = new Vector(0, 0);
    result.x += x;
    result.y += y;
    return result;
};

class PowerMeter{
    
    constructor(){
        
        this.angle = 0;
        this.pos = Vector.xy(20, 300);
        this.length = 50;
        this.progress = 0.05;
        this.progressIncreasing = true;
        
    }
    
    tick(){
        
        if(keyboard.right && this.angle < Math.PI/2)
            this.angle += 0.03;
        if(keyboard.left && this.angle > -Math.PI/2)
            this.angle -= 0.03;
        
        
        // this.pos = nextBall.pos.clone();
        // this.pos.x += Math.cos(this.angle) * 15;
        // this.pos.y += Math.sin(this.angle) * 15;

        if(keyboard.space){
            this.progress += this.progressIncreasing ? 0.025 : -0.025;
            if(this.progress < 0.05){
                this.progress = 0.05;
                this.progressIncreasing = true;
            }
            if(this.progress > 1){
                this.progress = 1;
                this.progressIncreasing = false;
            }
        }
        
    }
    
    draw(){
        var lineOneAngle = this.angle - Math.PI/12;
        var lineTwoAngle = this.angle + Math.PI/12;
        
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        
        ctx.moveTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        ctx.lineTo(this.pos.x + Math.cos(lineOneAngle)*(this.length+3) + Math.sin(lineOneAngle) * 2, 
            this.y + Math.sin(lineOneAngle)*(this.length+3) - Math.cos(lineOneAngle) * 2);
        
        ctx.arc(this.pos.x, this.pos.y, this.length+3, lineOneAngle, lineTwoAngle+0.05);
        
        ctx.moveTo(this.pos.x + Math.cos(lineTwoAngle)*(this.length+3) - Math.sin(lineTwoAngle) * 2, 
            this.pos.y + Math.sin(lineTwoAngle)*(this.length+3) + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x - Math.sin(lineTwoAngle) * 2, this.pos.y + Math.cos(lineTwoAngle) * 2);
        ctx.lineTo(this.pos.x + Math.sin(lineOneAngle) * 2, this.pos.y - Math.cos(lineOneAngle) * 2);
        
        ctx.stroke();
        ctx.closePath();
        
        ctx.lineWidth = "1px";
        
        for(var i = 2; i <= Math.floor(this.progress*this.length); i++){
            ctx.strokeStyle = "rgb(255, " + Math.floor(255-i*255/this.length) +", 20)";
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, i, lineOneAngle, lineTwoAngle);
            ctx.stroke();
            ctx.closePath();
        }
    }
    
}

var options = [
    ["test1", "test2", "test3"],
    ["1", "2", "3"]
];
var depth = 0;
var optionSelected = 0;
var powerMeter = new PowerMeter();

function drawSplash(){
    ctx.fillText("hi nick", 100, 100);
    var splash = document.getElementById('splash');
    ctx.drawImage(splash,0,0);
}

//Called while on menu
function drawMenu(){
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    
    //Draw each option for whatever you're on
    options[depth].forEach(function(element, index){
        ctx.fillStyle = index == optionSelected ? "black" : "#BBB";
        ctx.textAlign = "center";
        ctx.font = "italic bold 24px Arial";
        ctx.fillText(element, 400, 300 + 40 * (index-options[depth].length/2));
    });
}

//Enter was pressed while on the menu
function selectMenuOption(index){
    
    optionSelected = 0;
    //If you were on back, go back
    if(options[depth][index]=="Back")return depth--;
    
    switch(depth){
    //If on the first page of options, go to next page
    case 0:
        depth++;
        break;
    //If on second page, start game.
    case 1:
        initGame();
        break;
    }
}
