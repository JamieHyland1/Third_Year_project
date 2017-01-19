var PerlinGenerator = require("proc-noise");
var Perlin = new PerlinGenerator(); // seeds itself if no seed is given as an argument
//console.log(  ); // one dimensional

 var x = 500;
setInterval(function()
{
 var y = Math.random().toFixed(2)
 var z = (Math.random()*100).toFixed(2);
 var base = Perlin.noise(z).toFixed(2);
 console.log(x+base)
 if(y == 0.25)
 {
     x++;
     console.log("incremented x")
 }
},1000)
