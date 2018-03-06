const http = require("http");
const express = require("express");
const socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketio(server);
var locations = {};

server.listen(10002);

app.use("/", express.static(__dirname + "/public"));

io.on("connection", socket => {
	socket.on("init", href => {
		if (!(href in locations)) {
			locations[href] = {
				buffer: "Empieza a hablar...",
				sockets: []
			}
		}

		var loc = locations[href];

		loc.sockets.push(socket);
		socket.emit("update", loc.buffer);
		console.log("Nueva conexión desde", href);

		socket.on("write", buffer => {
			console.log("Actualización desde", href, "-", buffer.length, "caracteres");
			loc.buffer = buffer;
			loc.sockets.forEach(s => s !== socket && s.emit("update", buffer));
		});
	});
});
