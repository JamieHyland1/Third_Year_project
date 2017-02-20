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
var beginning = 500

      
var wss = new ws({
	port: 3000
}); //set the WebSocket Server to port 3000



//=============================================================================================================================================

setInterval(function()
{
	generateData()
	//console.log(oneArray.length)
	if(oneArray.length % 60 === 0) //if the length of the array is 60 insert an object to the database and wipe the array to restart the counter
	{
	 insertData(oneArray)
	 oneArray = []	
	 
	}
	value.shift();
},1000)

wss.on("connection", function  (ws) //this function will be called whenever the client opens a connection to the server
{

var data = [];

	
	
	
	setInterval(function()
		{
			var msg = JSON.stringify(value[value.length-1]); //stringify the most recent value in the value[] array as websockets can only send JSON strings or DOM blobs
			ws.send(msg, function(error)
			{
				//console.log(error) //simple callback function to log any error when sending a packet to user, generally called when a user refreshes the page as incoming messages may be dropped prevents server from crashing
			});
		},1000)
	
	
	ws.onclose = function(event)
	{
	 console.log("Connection Closed") //signify the connection to the client has been closed
	}
	
	
});

function sortNumber(a,b) //function to make sure array.sort sorts by size and not alphabetically, if not added array.sort outputs bizarre results
	{
     return a - b;
	}

function insertData(array) //takes an array of numbers as a parameter to be inserted into the DB
{
	var currentdate = new Date(); //get the current date
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
	var low = array[0]; //get the lowest value from the array
	// console.log(high)
	var obj = {"Date": datetime, "High": high, "Low": low, "Open": open, "Close": close}; //create object to be inserted to DB
	
	current.push(obj) //push object to current array, will be used to send to the user after a minute has passed. Less overhead cpu and time wise than querying the DB for a single object
	var url = 'mongodb://localhost:27017/stockData'; 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db)
	{
		assert.equal(null, err); //check to see if there are any errors
		
		// Insert a single document
		db.collection('stockData').insertOne(obj, function(err, r)
		{
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			
			db.close();
			//console.log("Inserted Item")
		});
	});
}

var historical = [];
console.log("WebSocket Server running on port 3000")
console.log("Web Server running on port 8081")

app.use(express.static('public')); //set up express to send static files
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
})
app.get('/test', function(req,res){ //this will send the last 100 documents to the client via GET request
		var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')

.then(function(db) {return db.collection("stockData").findAsync({}, { limit: 100, sort: {_id:-1}}) //query to database find 100 documents in ascending order 

.then(function(doc){doc.forEach(function(doc){historical.push(doc)})}) //push each document to the historical array

.then(function(){generateData() //start generating random values  //send the array of 100 documents to the client along with the status 200 ok 
				res.status(200).send(historical)})

.finally(function(){db.close()
					historical = []}) //if all the chains in the promise above have been succesfful close the db connection and then wipe the historical array to make sure dublicate values arent stored in the array

.catch(function(err) //catch and log any errors that may have occured along the chain of .then()'s
{
 console.log(err)}); 
})
		})
app.get('/data', function(req, res){
	var fiveMin = []
  var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
.then(function(db) {return db.collection("stockData").findAsync({}, { limit: 500, sort: {_id:-1}  })}) //retrieve the last 500 documents from the DB
.then(function(doc){doc.forEach(function(doc){data.push(doc)})}) //push those documents to the data array
.then(function(){ 
			var open
			var close
			var high
			var low

			for(var i = 0; i < data.length; i++) 
			{
			 a = data.splice(0,5) //splice the data array from index 0,5 this returns an array with 5 objects in it 
			 open = a[0].Open;
			 close = a[4].Close;
			 var highValues = a.map(function(o) { return o.High; }); //returns an array of only the High values from the spliced array
				
			 high =  Math.max.apply(null, highValues); // get the highest value from the highValues array, the map function takes in 'this' and an array as parameters but as 'this' isnt being used we substitute with null
				
			 var lowValues = a.map(function(o) { return o.Low; }); //returns an array of only the Low values from the spliced array
			 low = Math.min.apply(null, lowValues); //Get the lowest value from the lowValues array
				
			 var obj = {"High": high, "Low": low, "Open": open, "Close": close} //create 5 minute object
			 fiveMin.push(obj) //push object to fiveMin array
			}
		    res.status(200).send(fiveMin) //send fiveMin array back to client along with respobse 200 OK
			data = [];
			fiveMin = [];
		})
.catch(function(err){ //catch and log any errors that may occur in the promise chain
 console.log(err)}); 
})


app.get('/current', function(req, res)
{
   
	  res.status(200).send(current)
	  console.log(current)
	  current = [];
}) 




function generateData()
{
	var rnd = Math.random().toFixed(2) //will be used to determine wether the beginning stock value rises or lowers
	var data = Perlin.noise(Math.random()); //perlin noise function takes in a parameter to seed the generation, in this case Math.Random()
	var x = beginning + data 
	//console.log(x)
	if(rnd == 0.25)
	{
	beginning++;	
	//console.log("plus 1")
	}
	else if(rnd == 0.50)
	{
	beginning--;
	//console.log("minus 1 ")
	}
	oneArray.push(x) //push to the oneArray array, will be used to process object for DB
	value.push(x) //push to value array, this will be used to send to the client on a per second basis
//	console.log(value)
}
	


var server = app.listen(8081, function ()  //listen on port 8081 for a request
{
	var host = server.address().address
	var port = server.address().port

})



 


