var currentEditor=1;
var editors=[];
var noEditors=0;
var tabs;
var selectedFile="";
var selectedDir="";
var currentDir="/home/bensigal/server/www";
var readers  = [];
var vals	 = [];
var fileNames= [];
$(function(){
	tabs = $("#tabs").tabs();
	$("#tabs").on("tabsactivate", function(event, ui){
		currentEditor=ui.newTab.index()+1;
		$("#editor"+currentEditor).height("calc(100vh - 146px)");
		editors[currentEditor].editor.focus();
	});
	var fakeui = {};
	fakeui.newTab={};
	fakeui.newTab.index = function(){return 0;};
	editors[1]=new BenEditor(1);
	noEditors=1;
	$("#tabs").trigger("tabsactivate", [fakeui]);
	tabs.delegate( "span.ui-icon-close", "click", function() {
		var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
		$( "#" + panelId ).remove();
		tabs.tabs( "refresh" );
		noEditors--;
	});
	$(".ui-widget-header").css({backgroundImage: "none"});
});
var BenEditor = function(num, str){
	this.editor = ace.edit("editor"+num);
	this.editor.setOption("showPrintMargin", false);
	this.editor.setTheme("ace/theme/cobalt");
	this.editor.setOptions({
		fontSize: "16px"
	});
	if(str){
        if(str.indexOf(".")>-1){
            str = str.split(".").pop();
        }
		changeLanguage(str, this.editor);
	}
};
function changeLanguage(str, editor){
	switch(str){
	case "js":
		str="javascript";
		break;
	case "html":
	case "shtml":
	case "htm":
	case "php":
		str="php";
		break;
	case "java":
	case "json":
	case "css":
		break;
	default:
		str=false;
	}
	if(!str){
		editor.getSession().setMode("text");
	}else{
		editor.getSession().setMode("ace/mode/"+str);
	}
}
var dirMenu = {
	selector:".dirButton",
	callback:function(key, options){
		if(key=="Delete"){
			if(confirm("Are you sure?")){
				delDir(this[0].innerHTML)
			}
		}else{
			var s=prompt("What shall it be called?\n\n"+
			"To move a file or folder, type in a relative path"+
			"as the new name. If you don't know what that is,"+
			"why are you using my editor?");
			if(s){
				renameFile(this[0].innerHTML, s);
			}
		}
	},
	items:{
		Delete:{name:"Delete"},
		"Rename/Move":{name:"Rename/Move"}
	}
}
var fileMenu = {
	selector:".fileButton",
	callback:function(key, options){
		if(key=="Delete"){
			if(confirm("Are you sure?")){
				deleteFile(this[0].innerHTML)
			}
		}else if(key=="Rename/Move"){
			var s=prompt("What shall it be called?\n\n"+
			"To move a file or folder, type in a relative path"+
			"as the new name. If you don't know what that is,"+
			"why are you using my editor?");
			if(s){
				renameFile(this[0].innerHTML, s);
			}
		}else{
			download(currentDir+this[0].innerHTML);
		}
	},
	items:{
		Delete:{name:"Delete"},
		"Rename/Move":{name:"Rename/Move"},
		Download:{name:"Download"}
	}
}
function activateContextMenu(){
	$(function(){
		$.contextMenu(dirMenu);
		$.contextMenu(fileMenu);
		$(".dirButton").on("contextmenu", function(event){
			selectedDir=event.target.innerHTML;
		});
		$(".fileButton").on("contextmenu", function(event){
			selectedFile=event.target.innerHTML;
		});
	});
}
function changeFiles(s, e){
	if(e)e.stopPropagation();
	if(s.substring(s.length-1)!="/"){
		s+="/";
	}
	currentDir=s;
	$.post("/server/siteMap", {dir:s}, function(data){
		//Data is in format:
		//dir1;dir2;dir3<newline>
		//file1;file2;file3
		data=data.split("\n");
		var dirs=data[0];
		var files=data[1];
		if(dirs)dirs=dirs.split(";");
		if(files)files=files.split(";");
		var strTemp=currentDir.substring(0,currentDir.length-1);
		if(strTemp.indexOf("/")+1){
			strTemp=strTemp.substring(0,strTemp.lastIndexOf("/"));
			console.log("STRTEMP: "+strTemp);
		}else{
			strTemp="";
		}
		//This is bad OOP. I should probably change it.
		dirsString="<div class='dirButton' onclick='changeFiles(\""+
		strTemp+"\",event)'>../</div>";
		for(var i in dirs){
			dirsString+="<div class='dirButton' "+
			"onclick='changeFiles(\""+currentDir+dirs[i]+"\", event)'>"+
			dirs[i]+"</div>";
		}
		dirsString="<td id='dirsHolder'>"+dirsString+"</td>";
		var filesString="";
		for(i in files){
			filesString+="<div class='fileButton' onclick='trykeyfile(\""+currentDir+
			files[i]+"\");"+
			"closeFiles()'>"+files[i]+"</div>";
		}
		filesString="<td id='filesHolder'>"+filesString+"</td>";
		$("#inner").html("<table id='table'><tr>"+dirsString+filesString+
			"</tr></table>"+
			'<section id="optionsHolder">'+
				"<div id='newDir' "+
					"onclick='newDir(prompt(\"What should its name be?\"))'>"+
					"New Directory</div>"+
				"<div id='newFile' onclick='"+
					'var s = prompt("What should its name be?");if(s){'+
					"editors[currentEditor].file=currentDir+s;"+
					'editors[currentEditor].editor.setValue("");save();'+
					'trykeyfile(editors[currentEditor].file);'+
					"changeFiles(currentDir);}"+
				"'>New File</div>"+
				"<div id='uploadButton' onclick='$(\"#file\").click()'>"+
					"Upload</div>"+
			"</section>"
		);
		activateContextMenu();
	});
}

document.onkeydown=function(e){
	if(e.keyCode>48&&e.keyCode<58&&(e.ctrlKey||e.altKey)){ //CTRL/alt + 1-9
		var keyNum = e.keyCode - 48;
		if(editors[keyNum]){
			e.preventDefault();
			$("#link"+(keyNum)).click();
		}
	}
	else if(e.keyCode==87&&e.altKey){
		$(".ui-state-active > span").click();
	}
	else if(e.keyCode==78&&(e.ctrlKey||e.altKey)){ //CTRL/alt + N
		console.log("MEEP");
		e.preventDefault();
		if(noEditors==9)return;
		noEditors++;
		$("div#tabs ul").append(
			"<li><a href='#win" + noEditors + "' id='link"+noEditors+"'>File " + noEditors + 
			"</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"
		);
		$("div#tabs").append(
			"<div id='win" + noEditors + "'><div id='editor" + noEditors + "'></div></div>"
		);
		$("div#tabs").tabs("refresh");
		editors[noEditors]=new BenEditor(noEditors);
		$("#link"+noEditors).click();
		viewFiles(currentDir);
	}
	else if(e.keyCode==83&&(e.ctrlKey||e.altKey)){ //CTRL/alt + S
		e.preventDefault();
		save();
	}
	else if(e.keyCode==79&&(e.altKey||e.ctrlKey)){ //ALT/ctrl + O
		e.preventDefault();
		if($("#article").css("display")=="table")
			closeFiles();
		else
			viewFiles(currentDir);
	}
	else if(e.keyCode==76&&(e.altKey||e.ctrlKey)){   //ALT/ctrl + L
		e.preventDefault();
		logout();
	}
	else if(e.keyCode==82&&(e.altKey||e.altKey)){ //ALT/ctrl + R
		e.preventDefault();
		trykeyfile(editors[currentEditor].editor.file);
	}
};

function save(){
	$("body").animate({backgroundColor: "#990"}, 400);
	var formData = new FormData();
	formData.append("file",editors[currentEditor].file);
	formData.append("contents",new File([
	    new Blob(
	       [editors[currentEditor].editor.getValue()], 
	       {type:"application/octet-stream"}
	   )
	], "temp.txt"));
	$.ajax("/server/save",{
		'data':formData,
		'contentType':false,
		'processData':false,
		'type':"POST",
		'success':function(data){
			if(data=="Success!"){
				$("body").animate({backgroundColor: "#090"},400);
			}else{
				$("body").animate({backgroundColor:"#900"},400,function(){
					viewText(data.replace(/<[^>]+?>/g,""));
				});
			}
			$("body").animate({backgroundColor:"#39B"},400);
		},
		'error':function(jqXHR, statusString, status){
			viewText(status);
		}
	});
}

function trykeyfile(f){
	$.post("/server/getFileContents", {edit: f}, function(data){
	    console.log("Data recieved. File: "+f)
		editors[currentEditor].editor.setValue(data, -1);
		editors[currentEditor].file=f;
		changeLanguage(
			editors[currentEditor].file.split(".").pop(),
			editors[currentEditor].editor
		);
		$("#link"+currentEditor).text(
			editors[currentEditor].file.substring(
				editors[currentEditor].file.lastIndexOf("/") + 1
			)
		);
	});
}
function viewFiles(s){
	changeFiles(s);
	var colors="200,200,230";
	$("article").css("background-color", "rgba("+colors+", 0)");
	$("article").css("display", "table");
	$("article").animate({
		backgroundColor:"rgba("+colors+", 0.93)"
	})
	$("aside").animate({opacity:1})
	$("article, aside").click(function(event){
		if(event.target===this){
			closeFiles();
		}
	});
}
function viewText(s, t){
	var colors;
	$("#inner").html(s);
	if(t){
		colors="220,25,25";
		$("article").css("background-color", "rgba("+colors+", 0)");
	}else{
		colors="102,102,102";
		$("article").css("background-color", "rgba("+colors+", 0)");
	}
	$("article").css("display", "table");
	$("article").animate({
		backgroundColor:"rgba("+colors+", 0.93)"
	})
	$("aside").animate({opacity:1})
	$("article, aside").click(function(event){
		if(event.target===this){
			closeFiles();
		}
	});
}
function closeFiles(){
	$("#editor").css("display", "table");
	$("body").animate({backgroundColor:"#39B"});
	$("article").animate({backgroundColor:"rgba(102,102,102,0)"},
		function(){
			$("article").css("display", "none");
			$("article").css("background-color", "#666");
			editors[currentEditor].editor.focus();
		}
	);
	$("aside").animate({opacity:0})
}