<?php session_start();?>
<html>
<head>
    <title>Ben's Great Editor</title>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<link rel="stylesheet" type="text/css" href="/lib/contextMenu.css">
	<link rel="icon" href="../favicon.ico">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.8/ace.js"></script>
	<script src="/jquery.min.js"></script>
	<script src="/lib/contextMenu.js"></script>
    <script src="/jqui/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href=
		"//code.jquery.com/ui/1.11.4/themes/dot-luv/jquery-ui.css">
	<?php 
        echo "<script>on=".($_SESSION['on']?"true;":"false;");
        if($_SESSION['on'])
            echo "namePerson='".$_SESSION['un']."';";
        echo "</script>";
    ?>
    <script src="serverManagement.js"></script>
    <script src="userManagement.js"></script>
	<script src="editor.js"></script>
	<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js"></script>
	<link rel="stylesheet" type="text/css" href="ugly.css">
</head>
<body>
	<div id="tabs">
		<ul>
			<li>
				<a href="#win1" id="link1">File 1</a>
				<span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span>
			</li>
		</ul>
		<div id="win1" class="win">
			<div id="editor1"></div>
		</div>
	</div>
	<nav id='nav' class="ui-widget ui-corner-all ui-widget-content">
		<div id="top">
			<script>
				document.write(on?topLoggedInHTMLStr:topLoggedOutHTMLStr)
			</script>
		</div>
	</nav>
    <article id='article'>
        <aside id='aside'>
            <section id='inner'></section>
        </aside>
    </article>
    <input type="file" name="file" id="file" onchange='tryUpload()' multiple>
</body>
</html>