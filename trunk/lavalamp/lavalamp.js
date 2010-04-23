var frame = 0;

var mouseX;
var mouseY;

var canvas;
var ctx;

var imgData;
var data;


var w = 32;
var h = 64;

var data2 = new Array(w*h); 

var mbn = 20;
var mb = new Array(mbn);


// init balls
for (var i = 0; i < mbn; i++) {
    mb[i] = {
        x: Math.random() * w,
        y: h,
        sx: Math.random() * 0.2 - 0.1,
        sy: -Math.random() * 0.2,
        w: Math.random(0.4) + 0.8,
        h: Math.random(0.4) + 0.8
    };
}


function calculateImageData(){
    var i = 0, i2 = 0;
    var s = 0;
    var dx, dy;
    var b;
    var metaBall;
    var osc0 = Math.abs(Math.sin(frame/313));
    var osc1 = Math.abs(Math.cos(frame/213));
    var osc2 = Math.sin(frame/87+osc0*osc1*10);
    var osc3 = Math.sin(frame/100);
	var flatness = ((osc2*osc0+osc3*osc1)+1)*200;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            s = 0;
            for (i2 = 0; i2 < mbn; i2++) {
                metaBall = mb[i2];
                dx = (metaBall.x - x) / metaBall.w;
                dy = (metaBall.y - y) / metaBall.h;
                s += 0.01 / (dx * dx + dy * dy);
            }
            s = 1 / s;
            if (s < 1000) {
                if (s < flatness) {
                    b = 1;
                }
                else {
                    b = 1 - (s - flatness) / (1000-flatness);
                }
            }
            else {
                b = 0;
            }
            
            data2[i++] = b * 255;
        }
    }
}

function moveBalls(){
    var i;
    var x, y, sx, sy;
    var metaBall;
    
    for (i = 0; i < mbn; i++) {
        metaBall = mb[i]
        sx = metaBall.sx;
        sy = metaBall.sy;
        x = metaBall.x + sx;
        y = metaBall.y + sy;
        if ((x > w && sx > 0) || (x < 0 && sx < 0)) {
            metaBall.sx = -sx;
        }
        if ((y > h && sy > 0) || (y < 0 && sy < 0)) {
            metaBall.sy = -sy;
        }
        metaBall.x = x;
        metaBall.y = y;
    }
}


function fakeBumbMapping(){
    var i = w * 4;
	var i2 = w;
    var dx, dy, b,r;
	var wminus1 = w-1
    for (y = 1; y < h; y++) {
        i += 4;
		i2 +=1;
        for (x = 1; x < wminus1; x++) {
            b = data2[i2];
            dx = b - data2[i2 - 1]
            dy = b - data2[i2 - w];
            dx = dx + 128;
            dx = dx * dx;
            dy = dy + 128;
            dy = dy * dy;
            r = b * (dx + dy) / 50000;
            if (r>255) {
            	r = 255
            }
            data[i] = r;
            i++;
            // data[i] = 0;
            i++
            data[i] = b;
            i++;
            data[i++] = 255;
			i2++;
        }
		i +=4;
		i2+=1;
    }
    
}

function anim(){	
    moveBalls()
    calculateImageData();
    fakeBumbMapping();
	frame++;
    ctx.putImageData(imgData, 0, 0);
    window.setTimeout("anim()", 20);
}

function initLavaLamp(){
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d');
    imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    data = imgData.data;
    window.setTimeout("anim()", 10);
}

window.onload = function(){
    initLavaLamp();
}
