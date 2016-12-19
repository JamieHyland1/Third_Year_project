var ws = require("ws").Server; //require websocket library
var express = require('express') // require express library
var app = express() // initialise express
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var noise = require("simplex-noise") //require noise algorithim
var wss = new ws({ //set the WebSocket Server to port 3000
	port: 3000
});
var data;
setInterval(function(){console.log("global data variable: " + data)
},1000)


wss.on("connection", function (ws) {
	
	setInterval(function () {
		window.data  = Math.floor(Math.random() * 100) + 1; 	//create a random whole number between 1-100
		var msg = JSON.stringify(msg); 					//convert data to JSON string
		ws.send(msg); 									//send JSON string to client
	}, 500);
	wss.on('close', function () 
	{
		console.log('Client disconnected.')			//log message to console when connection is closed
	});

})

console.log("WebSocket Server running on port 3000") 
console.log("Web Server running on port 8081")

app.use(express.static('public')); 					//set up express to send static files
app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

})




// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("MongoDB port open on 27017");
});




