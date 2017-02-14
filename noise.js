//var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var promise = require("bluebird")
var url = 'mongodb://127.0.0.1:27017/stockData'; 
var Promise = require('bluebird');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var PerlinGenerator = require("proc-noise");
var db = mongodb.Collection;
Promise.promisifyAll(db.prototype);
Promise.promisifyAll(MongoClient);
var Perlin = new PerlinGenerator();




//setInterval(function(){
//
//MongoClient.connect(url, function(err,db){ //set up connection to mongodb takes two parameters a url for the db and a callback function 
//		assert.equal(err,null) //check to see if there any errors connecting to the database
//		var cursor = db.collection('stockData').find().limit(1).sort({_id:-1}); // cursor will be an array of objects retrieved from the database
//		cursor.forEach(function(doc, err){ //loop through the cursor
//			assert.equal(null,err) //check for errors
//			console.log(doc)
//		}, function(){ 
//			db.close(); //close the database once the query is finished
//		});
//	});	
//},60000)
var beginning = 250;
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
//		var msg = JSON.stringify(x);
//		ws.send(msg, function(error)
//		{
//            if(error)
//            {    
//			//console.error(error)//Prevents the server from crashing if connection drops
//            }
		

	setTimeout(function()
	{
		generateData()
		
	},1000)
}
generateData()
//var client = MongoClient.connectAsync('mongodb://localhost:27017/stockData')
//.then(function(db) {
// return db.collection("stockData").findAsync({},{limit: 5, sort: {_id:-1}})
//})
//.then(function(doc){doc.forEach(function(doc){console.log(doc)})})
//.catch(function(err){console.log(err)}); 

//MongoClient.connectAsync('mongodb://localhost:27017/stockData')
//  .then(function (db){
//    return db.collection('stockData').find({}, { limit: 10 }).toArrayAsync()
//      .then(function (docs) {
//        if (docs.length > 0) {
//          docs.forEach(function(doc) {
//            console.log(doc);
//          });
//        }
//      })
//      .catch(function (err) {
//        console.log(err);
//      })
//      .finally(function() {
//        db.close();
//      })
//  .catch(function (err) {
//    console.log(err);
//  });
//});