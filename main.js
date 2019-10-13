const SimplexNoise = require("simplex-noise");
const simplex = new SimplexNoise();

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

const width = 400;
const height = 400;

let weightAmt = 4;
let weightMultiplier = 0.5;
let zoom = 120;

let generateRivers = true;
let riverAmt = 15;
let maxRiverLength = 50;

let mapContent = [];

const mask = ctx.createImageData(width, height);

function squareMask(x, y) {

    let distance_x = Math.abs(x - width * 0.5);
    let distance_y = Math.abs(y - height * 0.5);
    let distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);

    let max_width = width * 0.5 - 25.0;
    let delta = distance / max_width;
    let gradient = delta * delta;

    return Math.max(0.0, 1.0 - gradient);
}

const getColor = noise => {
    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    let type = 'deep water';

    if (noise < 0.25) {
        g = 100;
        b = 200;
        type = 'deep water';
    }
    else if (noise >= 0.25 && noise < 0.3) {
        g = 128;
        b = 175;
        type = 'shallow water';
    }
    else if (noise >= 0.3 && noise <= 0.35) {
        r = 250;
        g = 217;
        b = 127;
        type = 'sand';
    }
    else if (noise >= 0.35 && noise <= 0.4) {
        r = 81;
        g = 255;
        b = 87;
        type = 'light grass';
    }
    else if (noise > 0.4 && noise <= 0.6) {
        r = 62;
        g = 175;
        b = 30;
        type = 'dark grass';
    }
    else if (noise > 0.6 && noise <= 0.8) {
        r = 90;
        g = 90;
        b = 90;
        type = 'dark mountain';
    }
    else if (noise > 0.8 && noise <= 0.90) {
        r = 150;
        g = 150;
        b = 150;
        type = 'light mountain';
    }
    else {
        r = 255;
        g = 255;
        b = 255;
        type = 'snow';
    }

    return { r, g, b, type};
}

const refreshImage = () => {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            const pixelindex = (width * j + i) * 4;
            let heightMask = squareMask(i, j);

            const sum = () => {
                let r = 0;
                for (let s = 0; s < weightAmt; s++) {
                    r += ((weightMultiplier / Math.pow(2, s)) * (simplex.noise2D((Math.pow(2, s)) * i / zoom, (Math.pow(2, s)) * j / zoom) * 0.5 + 0.5));
                }
                return r;
            }


            let noise = heightMask *
                (
                    sum()
                );

            let color = getColor(noise);
            
            mapContent[width * j + i] = {x: i, y: j, r: color.r, g: color.g, b: color.b, type: color.type, noise};

            mask.data[pixelindex] = color.r;
            mask.data[pixelindex + 1] = color.g;
            mask.data[pixelindex + 2] = color.b;
            mask.data[pixelindex + 3] = 255.0;
        }
    }

    if(generateRivers){riverGenerator();}

    ctx.putImageData(mask, 50, 50);
}

const riverGenerator = () => {
    console.log("Generating Rivers");
    let startPoints = mapContent.filter(p => p.type == "dark mountain");
    for(let r = 0; r < riverAmt; r++){
        let point = startPoints[Math.floor(Math.random()*startPoints.length)];
        
        let direction = {x: 1, y: 1};

        for(let i = 0; i < maxRiverLength; i++){
            const pixelindex = (width * point.y + point.x) * 4;

            mask.data[pixelindex] = 0;
            mask.data[pixelindex + 1] = 128.0;
            mask.data[pixelindex + 2] = 175.0;
            mask.data[pixelindex + 3] = 255.0;

            let surroundingPoints = mapContent.filter(p => Math.abs(point.x - p.x) < 2 && Math.abs(point.y - p.y) < 2);
            point = surroundingPoints.reduce((min, p) => min.noise < p.noise ? min:p);
            if(!point){point = surroundingPoints[0];}

            if(point.type == "shallow water"){
                break;
            }
        }
    }
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