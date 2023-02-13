
"use strict";

var parentEl;
var c1;
var c2;
var ctx1;
var ctx2;
var canvasWidth;
var canvasHeight;
var sizeBase;
var count;
var hue;
var options;
var parts = [];

/**
 * Helper function to create a HTML5 canvas and add a class to it
 * @return {[canvas]}
 */
function createCanvas() {
    var canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    if (
        navigator.userAgent.match(
            /(phone|pod|iPhone|iPod|ios|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
    ) {
        var box = document.querySelectorAll(".box")[0];
        box.style.left = "-42%";
    }
    return canvas;
}

/**
 * Helper function to generate a random value between min and max
 * @param  {[int]} min [min value]
 * @param  {[int]} max [max value]
 * @return {[int]}     [random value between min and max]
 */
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Helper function to generate hsla string for canvas 2d context
 * @param  {[int]} h [hue]
 * @param  {[int]} s [saturation]
 * @param  {[int]} l [lightness]
 * @param  {[float]} a [alpha]
 * @return {[string]}
 */
function hsla(h, s, l, a) {
    return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
}

/**
 * Helper function used for debouncing
 * @param  {[Function]} fn [function to debounce]
 * @param  {[int]} delay [debounce delay]
 */
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

function createAnimation() {
    sizeBase = canvasWidth + canvasHeight;
    count = Math.floor(sizeBase * 0.3);
    hue = rand(0, 360);
    options = {
        radiusMin: 1,
        radiusMax: sizeBase * 0.04,
        blurMin: 10,
        blurMax: sizeBase * 0.04,
        hueMin: hue,
        hueMax: hue + 100,
        saturationMin: 10,
        saturationMax: 70,
        lightnessMin: 20,
        lightnessMax: 50,
        alphaMin: 0.1,
        alphaMax: 0.5,
    };

    ctx1.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx1.globalCompositeOperation = "lighter";

    while (count--) {
        //init variables for canvas context
        var radius = rand(options.radiusMin, options.radiusMax);
        var blur = rand(options.blurMin, options.blurMax);
        var x = rand(0, canvasWidth);
        var y = rand(0, canvasHeight);
        var hue = rand(options.hueMin, options.hueMax);
        var saturation = rand(options.saturationMin, options.saturationMax);
        var lightness = rand(options.lightnessMin, options.lightnessMax);
        var alpha = rand(options.alphaMin, options.alphaMax);

        //draw on canvas context
        ctx1.shadowColor = hsla(hue, saturation, lightness, alpha);
        ctx1.shadowBlur = blur;
        ctx1.beginPath();
        ctx1.arc(x, y, radius, 0, Math.PI * 2);
        ctx1.closePath();
        ctx1.fill();
    }

    parts.length = 0; //clear parts array
    for (
        var i = 0;
        i < Math.floor((canvasWidth + canvasHeight) * 0.03);
        i++
    ) {
        parts.push({
            radius: rand(1, sizeBase * 0.03),
            x: rand(0, canvasWidth),
            y: rand(0, canvasHeight),
            angle: rand(0, Math.PI * 2),
            vel: rand(0.1, 0.5),
            tick: rand(0, 10000),
        });
    }
}

function resize() {
    canvasWidth = c1.width = c2.width = parentEl.offsetWidth;
    canvasHeight = c1.height = c2.height = parentEl.offsetHeight;
}

function animate() {
    window.requestAnimationFrame(animate);

    ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx2.globalCompositeOperation = "source-over";
    ctx2.shadowBlur = 0;
    ctx2.drawImage(c1, 0, 0); //copy canvas 1 to canvas 2
    ctx2.globalCompositeOperation = "lighter";

    var i = parts.length;
    ctx2.shadowBlur = 15;
    ctx2.shadowColor = "#fff";
    while (i--) {
        var part = parts[i];

        part.x += Math.cos(part.angle) * part.vel;
        part.y += Math.sin(part.angle) * part.vel;
        part.angle += rand(-0.05, 0.05);

        ctx2.beginPath();
        ctx2.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        var alpha = 0.075 + Math.cos(part.tick * 0.02) * 0.05;
        ctx2.fillStyle = hsla(0, 0, 100, alpha);
        ctx2.fill();

        //make sure particles stay within canvas bounds
        if (part.x - part.radius > canvasWidth) {
            part.x = -part.radius;
        }
        if (part.x + part.radius < 0) {
            part.x = canvasWidth + part.radius;
        }
        if (part.y - part.radius > canvasHeight) {
            part.y = -part.radius;
        }
        if (part.y + part.radius < 0) {
            part.y = canvasHeight + part.radius;
        }

        part.tick++;
    }
}

function init() {
    //create canvases
    c1 = createCanvas();
    c2 = createCanvas();
    ctx1 = c1.getContext("2d");
    ctx2 = c2.getContext("2d");
    parentEl = document.getElementById("wrapper");
    parentEl.insertBefore(c2, parentEl.firstChild);
    parentEl.insertBefore(c1, c2);

    resize();
    createAnimation();
    animate();

    window.addEventListener(
        "resize",
        debounce(function () {
            resize();
            createAnimation();
        }, 250)
    );
}

init();
