var ws = require("ws").Server; //require websocket library
var express = require('express') // require express library
var app = express() // initialise express
var noise = require("simplex-noise") //require noise algorithim
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000

//=========================================================================================================================================================




wss.on("connection", function (ws) {
	//setInterval(function (){console.log(genNumber(500))}, 500);
	setInterval(function () {
			var x = Math.round(Math.random() * 100) + 1;
			var data = JSON.stringify(x);
			ws.send(data)

		}, 1000)


	wss.on('close', function () {
		console.log('Client disconnected.') //log message to console when connection is closed
	});

	
		

	
	ws.onmessage = function(err,event){
		if(err)
			{
				throw err;
			}
		else{
					console.log(event.data)

		}
	}
})

console.log("WebSocket Server running on port 3000")
console.log("Web Server running on port 8081")

app.use(express.static('public')); //set up express to send static files
app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

})

