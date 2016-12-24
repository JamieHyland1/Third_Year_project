const perlin = require('pf-perlin');
var PerlinGenerator = require("proc-noise");
var Perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument
//console.log(  ); // one dimensional

 
// Create a 3D Perlin Noise generator. 
//const Perlin3D = perlin({dimensions: 1});
 
// Use it to make a 100x100x100 grid of values 
//let res = 10, data = [];
	var t = 0.0001
	setInterval(function()
	{
//		var x = Math.floor(Math.random() * 8);
//		//data.push(Perlin3D.get((x/res))*1000);
//		data.push(Perlin3D.seed(x))
		console.log(Perlin.noise(t)*1000);
		t += t;
		
	},1000)
//	setInterval(function(){data.shift()}, 1000)
     setInterval(function(){
		 
		 t = 0.00000001;
		 
		 
	 },4000) 
 