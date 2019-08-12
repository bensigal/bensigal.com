var currentEditor=1;
var editors=[];
var noEditors=0;
var tabs;
var selectedFile="";
var selectedDir="";
var currentDir="/home/bensigal/www";
var readers  = [];
var vals     = [];
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
var BenEditor = function(num, str, ap){
	this.editor = ace.edit("editor"+num);
	this.editor.setOption("showPrintMargin", false);
	this.editor.setTheme("ace/theme/cobalt");
	this.editor.setOptions({
		fontSize: "16px"
	});
	this.ap = Boolean(ap);
	if(str){
		str = str.split(".").pop();
		changeLanguage(str, this.editor);
	}
};
function changeLanguage(str, editor){
    switch(str){
    case "js":
        str="javascript";
        break;
    case "html":
    case "htm":
    case "php":
        str="php";
        break;
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
var dirMenu = [
    {'Delete':function(){
        if(confirm("Are you sure?")){
            delDir(selectedDir);
        }
    }},
    {'Rename/Move':function(){
        var s=prompt("What shall it be called?\n\n"+
            "To move a file or folder, type in a relative path"+
            "as the new name. If you don't know what that is,"+
            "why are you using my editor?");
        if(s){
            renameFile(selectedFile, s);
        }
    }}
];
var fileMenu = [
    {'Delete':function(){
        if(confirm("Are you sure?")){
            deleteFile(selectedFile);
        }
    }},
    {'Rename/Move':function(){
        var s=prompt("What shall it be called?\n\n"+
            "To move a file or folder, type in a relative path"+
            "as the new name. If you don't know what that is,"+
            "why are you using my editor?");
        if(s){
            renameFile(selectedFile, s);
        }
    }},
    {'Download':function(){
        download(currentDir+selectedFile);
    }}
];
function activateContextMenu(){
    $(function(){
        $(".dirButton").contextMenu(dirMenu, {theme:'vista'});
        $(".fileButton").contextMenu(fileMenu, {theme:'vista'});
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
    if(s!==""&&s.substring(s.length-1)!="/"){
        s+="/";
    }
    currentDir=s;
    console.log(s);
    $.post("/server/sitemap", {dir:s}, function(data){
        data=data.split("\n");
        var dirs=data[0];
        var files=data[1];
        dirs=dirs.split(";");
        files=files.split(";");
        var strTemp=currentDir.substring(0,currentDir.length-1);
        if(strTemp.indexOf("/")+1){
            strTemp=strTemp.substring(0,strTemp.lastIndexOf("/"));
        }else{
            strTemp="";
        }
        dirsString="<div class='dirButton' onclick='changeFiles(\""+
        strTemp+"\",event)'>../</div>";
        dirs.forEach(function(i){
            dirsString+="<div class='dirButton' "+
            "onclick='changeFiles(\""+currentDir+i+"\", event)'>"+
            i+"</div>";
        });
        dirsString="<td id='dirsHolder'>"+dirsString+"</td>";
        var filesString="";
        files.forEach(function(i){
            filesString+="<div class='fileButton' onclick='trykeyfile(\""+currentDir+
            i+"\");"+
            "closeFiles()'>"+i+"</div>";
        });
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
	if(e.keyCode>48&&e.keyCode<58&&(e.altKey || e.ctrlKey)){ //ALT + 1-9
	    var keyNum = e.keyCode - 48;
		if(editors[keyNum]){
			e.preventDefault();
			$("#link"+(keyNum)).click();
		}
	}
	else if(e.keyCode==87&&e.altKey){
		$(".ui-state-active > span").click();
	}
	else if(e.keyCode==78&&(e.altKey||e.ctrlKey)){ //ALT + N
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
	else if(e.keyCode==83&&(e.altKey || e.ctrlKey)){ //ALT + S
		e.preventDefault();
		save();
	}
	else if(e.keyCode==77&&(e.altKey || e.ctrlKey)){ //ALT + M
        e.preventDefault();
        if($("#sender").is(":focus"))
            editors[currentEditor].editor.focus();
        else
            $("#sender").focus();
    }
    else if(e.keyCode==79&&(e.altKey || e.ctrlKey)){ //ALT + O
        e.preventDefault();
        if($("#article").css("display")=="table")
            closeFiles();
        else
            viewFiles(currentDir);
	}
	else if(e.keyCode==76&&(e.altKey || e.ctrlKey)){   //ALT + L
        e.preventDefault();
        logout();
	}
	else if(e.keyCode==82&&(e.altKey || e.ctrlKey)){ //ALT + R
		e.preventDefault();
		trykeyfile(editors[currentEditor].editor.file);
	}
};

function save(){
    $("body").animate({backgroundColor: "#990"}, 400);
    $.post("/server/save/"+Math.floor(Math.random()*10000),
        {
            value: editors[currentEditor].editor.getValue(),
            file: editors[currentEditor].file
        },
        function(data){
            if(data!="Success!"){
                $("body").animate({backgroundColor: "#900"}, 400, function(){
                    viewText(data.replace(/<[^>]+?>/g, ""));
                }); 
            }else{
                $("body").animate({backgroundColor: "#090"}, 400);
            }
            $("body").animate({backgroundColor: "#39B"}, 400) ;
        }
    );
}

function trykeyfile(f){
	$.post("/server/getfilecontents", {edit: f}, function(data){
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
    var colors="123,123,123";
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