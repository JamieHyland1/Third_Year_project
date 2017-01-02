var ws = require("ws").Server; //require websocket library
var express = require('express') // require express library
var app = express() // initialise express
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
var PerlinGenerator = require("proc-noise");
var Perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument 

// Use it to make a 100x100x100 grid of values 

      
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000

//=============================================================================================================================================




wss.on("connection", function  (ws)
{
		
	var beginning = 250
	var t = 0.000000000000001;
	var insertArray = []; // will hold every value generated every second for one minute 
	var count = 0; // counter for when to insert data to the database
	setInterval(function()
	{
		var x = Math.random().toFixed(2);
		var data = beginning + Perlin.noise(t);
		insertArray.push(data)
		var msg = JSON.stringify(data);
		ws.send(msg, function(error){
			//Prevents the server from crashing if connection drops
			console.log("connection dropped")
		})

	t++
	count++;
	if(count == 60)
	{
		insertData(insertArray) //calling function to insert data to mongo on a per minute basis
		insertArray = []; // wipe the array of all current index's
		counter = 0; // set counter to 0 to begin the loop again
	}
	
	},1000)
	

	ws.onclose = function(event)
	{
		console.log("Connection Closed")
	
	}
	ws.onmessage = function(event)
	{
			console.log(event.data)
			var insert = JSON.parse(event.data)
		
		}
	
	
});

	function sortNumber(a,b) //function to make sure array.sort sorts by size and not alphabetically, if not added array.sort outputs bizarre results
	{
     return a - b;
	}

function insertData(array)
{
	 var open = array[0]; //get the first value for the minute
	 var close = array[array.length-1]; // get the last value for the minute
	 array.sort(sortNumber); //sort the array by size from lowest to highest
	 var high = array[array.length-1]; //get the highest value from the array
	// console.log(high)
	var low = array[0];
	// console.log(high)
	var obj = {"high": high, "low": low, "open": open, "close": close};
	
	var url = 'mongodb://localhost:27017/stockData'; 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db)
	{
		assert.equal(null, err);
		console.log("Connected correctly to server");
		// Insert a single document
		db.collection('stockData').insertOne(obj, function(err, r)
		{
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			
			db.close();
		});
	});
}

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

