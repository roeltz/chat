(function(){

var BASE = "cerebro.shiftactive.com:10002";

function placeCaretAtEnd(el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
	&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}

function loadScript(path, exports, callback) {
	var script = document.createElement("script");
	script.src = path;
	document.body.appendChild(script);
	var iid = setInterval(function(){
		if (window[exports]) {
			clearInterval(iid);
			callback(window[exports]);
		}
	}, 100);
}

loadScript("https://code.jquery.com/jquery-3.3.1.min.js", "jQuery", function($){
	loadScript("http://" + BASE + "/socket.io/socket.io.js", "io", function(io){
		$("body").one("dblclick", function(e){
			var socket = io("http://" + BASE + "/");

			e.target.contentEditable = "true";
			e.target.focus();

			$(e.target).on("input", function(){
				setTimeout(function(){
					socket.emit("write", e.target.innerHTML);
				}, 100);
			});

			socket.on("update", function(buffer){
				e.target.innerHTML = buffer;
				placeCaretAtEnd(e.target);
			});

			socket.on("connect", function(){
				socket.emit("init", location.href);
			});
		});
		alert("Haz doble click donde sea para empezar");
	});
});

})();
