var SimplexNoise = require("simplex-noise");
var simplex = new SimplexNoise();

var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

let width = 500;
let height = 500;

let zoom = 16;
var mask = ctx.createImageData(width, height);

function squareMask(size, x, y) {
    if (x < (width / 2) - (size / 2) || x > (width / 2) + (size / 2) || (y < (height / 2) - (size / 2) || y > (height / 2) + (size / 2))) {
        return 0.0;
    }
    else {
        return 1.0;
    }
}


function refreshImage() {

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            var pixelindex = (width * j + i) * 4;
            let heightMask = squareMask(250, i, j);

            let noise = heightMask * (simplex.noise2D(i / zoom, j / zoom) * 0.5 + 0.5);


            let r = 0.0;
            let g = 0.0;
            let b = 0.0;

            if (noise == 0) {
                b = 255;
            }
            else if (noise > 0 && noise <= 0.3) {
                r = 81;
                g = 255;
                b = 87;
            }
            else if (noise > 0.3 && noise <= 0.6) {
                r = 62;
                g = 175;
                b = 30;
            }
            else if (noise > 0.6 && noise <= 0.9) {
                r = 90;
                g = 90;
                b = 90;
            }
            else {
                r = 255;
                g = 255;
                b = 255;
            }

            mask.data[pixelindex] = r;
            mask.data[pixelindex + 1] = g;
            mask.data[pixelindex + 2] = b;
            mask.data[pixelindex + 3] = 255.0;   // Alpha
        }
    }

    ctx.putImageData(mask, 50, 50);
}

var zoomSlider = document.getElementById("zoomSlider");
var zoomValue = document.getElementById("zoomValue");

zoomSlider.oninput = function () {
    zoom = this.value;
    zoomValue.innerHTML = zoom;
    refreshImage();
}