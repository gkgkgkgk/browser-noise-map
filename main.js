var SimplexNoise = require("simplex-noise");
var simplex = new SimplexNoise();

var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

let width = 500;
let height = 500;

var mask = ctx.createImageData(width, height);


for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
        var pixelindex = (width * j + i) * 4;
        mask.data[pixelindex] = Math.random() * 255.0; // Red value
        mask.data[pixelindex + 1] = Math.random() * 255.0; // Green value
        mask.data[pixelindex + 2] = Math.random() * 255.0; // Blue value
        mask.data[pixelindex + 3] = 255.0;   // Alpha
    }
}

ctx.putImageData(mask, 50, 50);