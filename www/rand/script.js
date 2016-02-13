window.onload=function(){
	$("#go").click(submit);
	$("#input").keydown(function(e){
		if(e.keyCode==13){
			submit();
		}
	});
	$("#info").click(showInfo);
};
working = false;
function trySubmit(){
	if(!working)submit();
}
function submit(){
	working=true;
	$("article").stop();
	var data = $("#input").val();
	var result="";
	data = data.split(",");
	for(i = 0; i<data.length; i++){
		data[i]=data[i].trim();
	}
	switch($("input:checked").val()){
		case "Order":
			result=data.shuffle();
			break;
		case "Choose":
			result=data[Math.floor(Math.random()*data.length)];
			break;
		case "Number":
			result=String(Math.ceil(Math.random()*data[0]));
	}
	$("article").css("display", "block");
	$("article").css("cursor", "pointer");
	$("article").animate({opacity:0.975});
	$("aside").html("<h3>Your Result Is:<br></h3><h1>"+result.toBenibianString()+"</h1>"+(result.toBenibianString().substr(0,3).toLowerCase()=="ben"?"<br>Hooray!":""));
	$("article, aside").click(function(){
		$("article").animate({opacity:0}, function(){
			$("article").css("display", "none");
			setTimeout(function(){working=false;}, 500);
		});
	});
}

Array.prototype.shuffle=function(){
  var m = this.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = this[m];
    this[m] = this[i];
    this[i] = t;
  }
  return this;
};

Array.prototype.toBenibianString=function(){
	return this.join(", ");
};
String.prototype.toBenibianString=function(){
	return this;
};