var ws = require("ws").Server; //require websocket library
var express = require('express') // require express library
var app = express() // initialise express
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
const perlin = require('pf-perlin');
 
// Create a 3D Perlin Noise generator. 
const Perlin3D = perlin({dimensions: 1});
 
// Use it to make a 100x100x100 grid of values 

      
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000

//=========================================================================================================================================================




wss.on("connection", function (ws)
{
	var res = 900;
	setInterval(function()
	{
		var x = Math.floor(Math.random() * 8);
		var data = Perlin3D.get((x/res))*1000;
		var msg = JSON.stringify(data);
		ws.send(msg)

	
	
	},1000)
	

	wss.on('close', function () {
		console.log('Client disconnected.') //log message to console when connection is closed
	});

	ws.onmessage = function(event)
	{
			console.log(event.data)
			var insert = JSON.parse(event.data)
			var url = 'mongodb://localhost:27017/stockData';
			// Use connect method to connect to the Server
			MongoClient.connect(url, function(err, db)
			{
				assert.equal(null, err);
				console.log("Connected correctly to server");

				// Insert a single document
				db.collection('stockData').insertOne(insert, function(err, r)
				{
				 assert.equal(null, err);
				 assert.equal(1, r.insertedCount);

				 db.close();
				});
			});
		}
	

});

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

