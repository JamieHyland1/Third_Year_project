var express = require('express') // require express library
var app = express() // initialise express
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var PerlinGenerator = require("proc-noise");
var url = 'mongodb://127.0.0.1:27017/stockData'; 
var Promise = require('bluebird');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db = mongodb.Collection;
Promise.promisifyAll(db.prototype);
Promise.promisifyAll(MongoClient);
var Perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument 
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var	data = [];
var btcArray = []; // will hold every value generated every second for one minute 
var googleArray = [];
var current = []
var currentG = [];
var currentB = [];
var value = [];
var stock;
var beginning = 500
var btc = 0;
var google = 0;
var old_price = beginning
var oldG_price = 700;
var change_perc = 0;
      
//=====================================================================================================================


io.on('connection', function(client) {
	console.log('client connected');
  
	client.on("data",function(data)
	 {
		 var stock = data
		 console.log(stock)
		 var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
		 .then(function(db) {return db.collection(stock).findAsync({}, { limit: 100, sort: {_id:-1}}) //query to database find 100 documents in ascending order 
		 .then(function(doc){doc.forEach(function(doc)
		 {
		  //console.log(historical.length)
	     historical.push(doc)
		
		 })}) 
		 .finally(function()
		 {
		 // console.log(historical.length)
		  io.emit("data",historical)
		  db.close()
		  console.log(historical.length)
		  historical = []
		 }) 
		 .catch(function(err)
		 {
 		  console.log(err)}); 
		})
	  })
		
	client.on("Five", function(stockName)
	{
	var stock = stockName
	var fiveMin = []
  	var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
	.then(function(db) {return db.collection(stock).findAsync({}, { limit: 500, sort: {_id:-1}  })}) //retrieve the last 500 documents from the DB
	.then(function(doc){doc.forEach(function(doc){data.push(doc)})}) //push those documents to the data array
	.then(function(){ 
			var open
			var close
			var high
			var low

			for(var i = 0; i < data.length; i++) 
			{
			 a = data.splice(0,4) //splice the data array from index 0,5 this returns an array with 5 objects in it 
			 open = a[0].Open;
			 close = a[a.length-1].Close;
			 var highValues = a.map(function(o) { return o.High; }); //returns an array of only the High values from the spliced array
				
			 high =  Math.max.apply(null, highValues); // get the highest value from the highValues array, the map function takes in 'this' and an array as parameters but as 'this' isnt being used we substitute with null
				
			 var lowValues = a.map(function(o) { return o.Low; }); //returns an array of only the Low values from the spliced array
			 low = Math.min.apply(null, lowValues); //Get the lowest value from the lowValues array
				
			 var obj = {"High": high, "Low": low, "Open": open, "Close": close} //create 5 minute object
			 console.log(obj)
			 fiveMin.push(obj) //push object to fiveMin array
			}
		    io.emit("FiveData", fiveMin)
			data = [];
			fiveMin = [];
		})
.catch(function(err){ //catch and log any errors that may occur in the promise chain
 console.log(err)}); 
})
	client.on("current", function(d)
	{
	//	console.log(d)
	if(stock == "BitCoin")
	{
	io.emit("current",btc)
	}
	else if(stock == "Google")
	{
		io.emit("current", google)
	}
	})
	
	client.on("changeCurrent", function (d)
	{
		stock = d;
	})
	})


setInterval(function()
{
	//generateData()
	btc = randomGen(2, "BitCoin")
	google = randomGen(3, "Google")
	btcArray.push(btc)
	googleArray.push(google)
	if(btcArray.length % 60 === 0 ) //if the length of the array is 60 insert an object to the database and wipe the array to restart the counter
	{
		
	// current = []
	 insertData(btcArray, "BitCoin", "Bitcoin")
	 io.emit("newest", currentB)
	 currentB = [];
	 btcArray = [];
	 
	}
	if(googleArray.length % 60 === 0)
	{
			 insertData(googleArray, "Google", "Google")
			 googleArray = [];
			//console.log("google")
			
	}
	//value.shift();
},1000)


var data = [];
	
function sortNumber(a,b) //function to make sure array.sort sorts by size and not alphabetically, if not added array.sort outputs bizarre results
{
 return a - b;
}

function insertData(array, dbCollection, ticker) //takes an array of numbers as a parameter to be inserted into the DB
{
	var tick = ticker
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
	var obj = {"Ticker": tick, "Date": datetime, "High": high, "Low": low, "Open": open, "Close": close}; //create object to be inserted to DB
	if(tick == "Google")
	{
		currentG.push(obj)
	}
	if(tick == "Bitcoin")
	{
		currentB.push(obj)
	}
 //push object to current array, will be used to send to the user after a minute has passed. Less overhead cpu and time wise than querying the DB for a single object
	var url = 'mongodb://localhost:27017/stockData'; 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db)
	{
		assert.equal(null, err); //check to see if there are any errors
		
		// Insert a single document
		db.collection(dbCollection).insertOne(obj, function(err, r)
		{
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			
			db.close();
			console.log("Inserted Item")
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
//	oneArray.push(x) //push to the oneArray array, will be used to process object for DB
//	value.push(x) //push to value array, this will be used to send to the client on a per second basis
//	console.log(value)
}


function randomGen(vol, stock)
{
	if(stock === "Google")
	{
		
	
	var rnd = Math.random();
	 change_perc = 2 * vol * rnd;
	if(change_perc > vol)
	{
		 change_perc -= (2 * vol);
	}
	var change_amount = oldG_price * change_perc;
	var new_price = oldG_price + change_perc
	oldG_price = new_price;
//	oneArray.push(new_price) //push to the oneArray array, will be used to process object for DB
//	value.push(new_price) 
	return new_price;
	}
	if(stock ==="BitCoin")
	{
		var rnd = Math.random();
	 change_perc = 2 * vol * rnd;
	if(change_perc > vol)
	{
		 change_perc -= (2 * vol);
	}
	var change_amount = old_price * change_perc;
	var new_price = old_price + change_perc
	old_price = new_price;
//	oneArray.push(new_price) //push to the oneArray array, will be used to process object for DB
//	value.push(new_price) 
	return new_price;
	}
}
	

server.listen(3000, function(){
  console.log('listening on :3000');
}); 



 


