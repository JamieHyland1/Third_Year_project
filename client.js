var ws = require("ws").Server; //require websocket library
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');
var express = require('express') // require express library
var app = express() // initialise express
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000


var url = 'mongodb://localhost:27017/myproject';
MongoClient.connect(url, function (err, db) { // Use connect method to connect to the Server
	assert.equal(null, err);
	console.log("MongoDB port open on 27017");
});
console.log("Web Server running on port 8081")

app.use(express.static('public')); //set up express to send static files
app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

})