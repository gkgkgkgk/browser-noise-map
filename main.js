var SimplexNoise = require("simplex-noise");
var simplex = new SimplexNoise();

var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

let width = 500;
let height = 500;

let weightAmt = 4;
let weightMultiplier = 0.5;
let zoom = 120;
var mask = ctx.createImageData(width, height);

function squareMask(x, y) {

    let distance_x = Math.abs(x - width * 0.5);
    let distance_y = Math.abs(y - height * 0.5);
    let distance = Math.sqrt(distance_x*distance_x + distance_y*distance_y);
    
    let max_width = width * 0.5 - 25.0;
    let delta = distance / max_width;
    let gradient = delta * delta;
    
    return Math.max(0.0, 1.0 - gradient);
}


function refreshImage() {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const pixelindex = (width * j + i) * 4;
            let heightMask = squareMask(i, j);
            
            const sum = () => {
                let r = 0;
                for(let s = 0; s < weightAmt; s++){
                    r += ((weightMultiplier/Math.pow(2, s)) * (simplex.noise2D((Math.pow(2, s)) * i / zoom, (Math.pow(2, s)) * j / zoom) * 0.5 + 0.5));
                }
                return r;
            }


            let noise = heightMask * 
            (
                sum()
            );


            let r = 0.0;
            let g = 0.0;
            let b = 0.0;

            if (noise < 0.3) {
                g = 100;
                b = 200;
            }
            else if (noise >= 0.3 && noise <= 0.35) {
                r = 250;
                g = 217;
                b = 127;
            }
            else if (noise >= 0.35 && noise <= 0.4) {
                r = 81;
                g = 255;
                b = 87;
            }
            else if (noise > 0.4 && noise <= 0.6) {
                r = 62;
                g = 175;
                b = 30;
            }
            else if (noise > 0.6 && noise <= 0.8) {
                r = 90;
                g = 90;
                b = 90;
            }
            else if (noise > 0.8 && noise <= 0.90) {
                r = 150;
                g = 150;
                b = 150;
            }
            else {
                r = 255;
                g = 255;
                b = 255;
            }

            mask.data[pixelindex] = r;//noise * 255.0;
            mask.data[pixelindex + 1] = g;//noise * 255.0;
            mask.data[pixelindex + 2] = b;//noise * 255.0;
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

var weightAmtSlider = document.getElementById("weightAmtSlider");
var weightAmtValue = document.getElementById("weightAmtValue");

weightAmtSlider.oninput = function () {
    weightAmt = this.value;
    weightAmtValue.innerHTML = weightAmt;
    refreshImage();
}

var weightMultiplierSlider = document.getElementById("xWeightSlider");
var weightMultiplierValue = document.getElementById("xWeightValue");

weightMultiplierSlider.oninput = function () {
    weightMultiplier = this.value;
    weightMultiplierValue.innerHTML = weightMultiplier;
    refreshImage();
}