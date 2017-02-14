var ws = require("ws").Server; //require websocket library
var express = require('express') // require express library
var app = express() // initialise express
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var PerlinGenerator = require("proc-noise");
var url = 'mongodb://127.0.0.1:27017/stockData'; 
var Promise = require('bluebird');
var mongodb = require('mongodb');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var MongoClient = mongodb.MongoClient;
var db = mongodb.Collection;
Promise.promisifyAll(db.prototype);
Promise.promisifyAll(MongoClient);
var Perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument 
var	data = [];
var oneArray = []; // will hold every value generated every second for one minute 
var current = []
var value = [];
var beginning = 250

      
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000



//=============================================================================================================================================



setInterval(function()
{
	insertData(oneArray)
	oneArray = []
}, 60000)
wss.on("connection", function  (ws)
{

var data = [];
var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
.then(function(db) {return db.collection("stockData").findAsync({}, { limit: 100, sort: {_id:-1}})})
.then(function(doc){doc.forEach(function(doc){ws.send(JSON.stringify(doc));})})
.then(function(){generateData()})
.catch(function(err){
 console.log(err)}); 
	
	setInterval(function()
	{
		var msg = JSON.stringify(value[0]);
		ws.send(msg, function(error)
		{
            if(error)
            {    
			//console.error(error)//Prevents the server from crashing if connection drops
            }
		})
		value.shift()
	},1000)
		
	
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
	var currentdate = new Date(); 
	var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "  "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	 var open = array[0]; //get the first value for the minute
	 var close = array[array.length-1]; // get the last value for the minute
	 array.sort(sortNumber); //sort the array by size from lowest to highest
	 var high = array[array.length-1]; //get the highest value from the array
	// console.log(high)
	var low = array[0];
	// console.log(high)
	var obj = {"Date": datetime, "High": high, "Low": low, "Open": open, "Close": close};
	//console.log(obj)
	var url = 'mongodb://localhost:27017/stockData'; 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db)
	{
		assert.equal(null, err);
	//	console.log("Connected correctly to server");
		// Insert a single document
		db.collection('stockData').insertOne(obj, function(err, r)
		{
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			
			db.close();
			console.log("Inserted Item")
		});
	});
}


console.log("WebSocket Server running on port 3000")
console.log("Web Server running on port 8081")

app.use(express.static('public')); //set up express to send static files
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})

app.get('/data', function(req, res){
  var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
.then(function(db) {return db.collection("stockData").findAsync({}, { limit: 500 })})
.then(function(doc){doc.forEach(function(doc){data.push(doc)})})
.then(function(){ 
			var open
			var close
			var high
			var low

			for(var i = 0; i < data.length/2; i++)
			{
			 a = data.splice(0,5)
			 open = a[0].Open;
			 close = a[4].Close;
			 var highValues = a.map(function(o) { return o.High; });
			 high =  Math.max.apply(null, highValues);
			 var lowValues = a.map(function(o) { return o.Low; });
			 low = Math.min.apply(null, lowValues);
			 var obj = {"High": high, "Low": low, "Open": open, "Close": close}
			 data.push(obj)
			}
		    res.status(200).send(data)
			data = [];
		})
.catch(function(err){
 console.log(err)}); 
})


app.get('/current', function(req, res){
   	MongoClient.connect(url, function(err,db){ //set up connection to mongodb takes two parameters a url for the db and a callback function 
		assert.equal(err,null) //check to see if there any errors connecting to the database
		var cursor = db.collection("stockData").find().limit(1).sort({"_id":-1}) // cursor will be an array of objects retrieved from the database
		cursor.forEach(function(doc, err){ //loop through the cursor
			assert.equal(null,err) //check for errors
			//retrieveArray.push(doc); //push each document the cursor points toward to the retrieveArray
			current.push(doc);
		}, function(){ 
			db.close(); //close the database once the query is finished
		    res.status(200).send(current)
			console.log(current)
			current = [];
		});
	});
})


function generateData()
	{
		var rnd = Math.random().toFixed(2)
		var data = Perlin.noise(Math.random());
		var x = beginning + data
		console.log(x)
		if(rnd == 0.25)
		{
		beginning++;	
		console.log("plus 1")
		}
		else if(rnd == 0.50)
		{
		beginning--;
		console.log("minus 1 ")
		}
		oneArray.push(x)
		value.push(x)
	

	setTimeout(function()
	{
		generateData()
		
	},1000)
	
	}
	


var server = app.listen(8081, function () 
{
	var host = server.address().address
	var port = server.address().port

})



 


