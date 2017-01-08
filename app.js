var ws = require("ws").Server; //require websocket library
var html = require('html')
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

	var url = 'mongodb://localhost:27017/stockData';	


//=============================================================================================================================================




wss.on("connection", function  (ws)
{
	var beginning = 250
	var t = 0.000000000000001;
	var insertArray = []; // will hold every value generated every second for one minute 

//	MongoClient.connect(url, function (err, db)
//	{
//		assert.equal(null, err);
//		getData(db, function () 
//		{
//			db.close();
//		});
//	});
	
	function generateData()
	{
		var x = Math.floor(Math.random()*100);
		var data = beginning + Perlin.noise(t);
		insertArray.push(x)
		var msg = JSON.stringify(data);
		ws.send(msg, function(error)
		{
			//Prevents the server from crashing if connection drops
		})

	console.log(insertArray.length)
	if(insertArray.length == 60) //The length of the array will act as a counter to when the data should be inserted i.e if the length of the
	{//								array is 60, 60 seconds will have passed.	
		
		insertData(insertArray) //calling function to insert data to mongo on a per minute basis
		insertArray = []; // wipe the array of all current index's this will reset the counter for the next minute
	}
		
	setTimeout(function()
	{
		generateData()
		
	},1000)
	
	}
	

	ws.onclose = function(event)
	{
	 console.log("Connection Closed")
	}
	
	//generateData();
	
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
	console.log(obj)
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
			console.log("database closed")
		});
	});
}

var getData = function(db, callback) {
   var cursor =db.collection('stockData').find();
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
       //  console.log(doc);
      } else {
         callback();
      }
   });
};

console.log("WebSocket Server running on port 3000")
console.log("Web Server running on port 8081")

app.use(express.static('public')); //set up express to send static files
app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})

app.get('/getData', function(req, res, next) {
  var resultArray = [];
  MongoClient.connect(url, function(err, db){
	  assert.equal(null,err)
	  var cursor = db.collection("stockData").find();
	  cursor.forEach(function(doc,err){
		assert.equal(null,err)
		resultArray.push(doc)
	 }, function(){
		  db.close();
		  res.render('/index.html', {local_variables: resultArray})
	  })
  })
});

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

})

