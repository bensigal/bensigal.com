$(function(){
    $("#speed").val("1");
    $("#play").click(function(e){
        playString($("#notes1").val());
        playString($("#notes2").val());
        playString($("#notes3").val());
        playString($("#notes4").val());
    });
});

function playString(input){
    var i = 0;
    var overallRate = $("#speed").val();
    var rate = overallRate;
    var octave = 5;
    var dotted = false;
    var volume = 1;
    function playNextNote(){
        
        while(" \n\t\r".includes(input[i])){
            console.log("Skipping space");
            i++;
        }
        if(i >= input.length) return;
        
        var note = input[i];
        var thisOctave = octave;
        
        //Volume
        if(input[i] == "v" && i<input.length-1){
            volume = (0.1*input[i+1])*(0.1*input[i+1]);
            i+=2;
            return playNextNote();
        }
        //Dotted note
        if(input[i] == "."){
            rate *= 2/3;
            i++;
            dotted = true;
            return playNextNote();
        }
        //Octave up
        if(input[i] == "H"){
            octave++;
            i++;
            return playNextNote();
        }
        //Octave down
        if(input[i] == "L"){
            octave--;
            i++;
            return playNextNote();
        }
        //Change rate
        if(i < input.length - 1 && input[i] == "r"){
            switch(input[i+1]){
            case "q":
                rate = 1*overallRate;
                break;
            case "e":
                rate = 2*overallRate;
                break;
            case "s":
                rate = 4*overallRate;
                break;
            case "h":
                rate = 0.5*overallRate;
                break;
            case "w":
                rate = 0.25*overallRate;
                break;
            case "d":
                rate = 0.125*overallRate;
                break;
            }
            console.log("Rate now "+rate);
            i+=2;
            return playNextNote();
        }
        //Rest
        if(input[i] == "R"){
            console.log("Resting");
            setTimeout(playNextNote, 1000*$("#C5")[0].duration/rate);
            i++;
            return;
        }
        //Sharp
        if(i < input.length - 1 && input[i+1] == "s"){
            note += "s";
            i++;
        }
        //Flat
        if(i < input.length - 1 && input[i+1] == "t"){
            switch(input[i]){
            case "A": note="Gs"; break;
            case "B": note="As"; break;
            case "D": note="Cs"; break;
            case "E": note="Ds"; break;
            case "G": note="Fs"; break;
            }
            i++;
        }
        //Lowercase (octave down)
        if(/^[a-g]/.test(note)){
            console.log("Shifting down octave");
            thisOctave--;
            note = note[0].toUpperCase() + note.substring(1);
        }
        
        i++;
        console.log("Playing sound "+note);
        var sound = $("#"+note+thisOctave)[0];
        
        if(sound.fastSeek)sound.fastSeek(0);
        else if(sound.currentTime){
            console.error("Nick bad");
            sound.currentTime = 0;
        }
        sound.volume = volume;
        sound.playbackRate = rate;
        sound.play();
        
        if(dotted){
            rate *= 3/2;
            dotted = false;
        }
        
        setTimeout(playNextNote, 1000*sound.duration/rate);
    }
    playNextNote();
}