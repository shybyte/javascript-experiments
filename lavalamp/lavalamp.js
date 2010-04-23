var frame = 0;

var ctx;

var imgData;
var data;

var w = 32;
var h = 64;

var data2 = new Array(w * h);

var mbn = 20;
var mb = new Array(mbn);

var random = Math.random;
var sin = Math.sin;
var abs = Math.abs;

// init balls
for (var i = 0; i < mbn; i++) {
    mb[i] = {
        x: random() * w,
        y: h,
        sx: random() * 0.2 - 0.1,
        sy: -random() * 0.2,
        w: random() + 0.8,
        h: random() + 0.8
    };
}


function calculateImageData(){
    var i = 0, i2 = 0;
    var s = 0;
    var dx, dy;
    var b;
    var metaBall;
    var osc0 = abs(sin(frame / 313));
    var osc1 = abs(Math.cos(frame / 213));
    var osc2 = sin(frame / 87 + osc0 * osc1 * 10);
    var osc3 = sin(frame / 100);
    var flatness = ((osc2 * osc0 + osc3 * osc1) + 1) * 200;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
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
                    b = 1 - (s - flatness) / (1000 - flatness);
                }
            }
            else {
                b = 0;
            }
            
            data2[i++] = b * 255;
        }
    }
}

function needsToBounce(pos,speed,limit) {
	return (pos > limit && speed > 0) || (pos < 0 && speed < 0);
}

function moveBalls(){
    var i;
    var metaBall;
    for (i = 0; i < mbn; i++) {
        metaBall = mb[i]
        metaBall.x  += metaBall.sx;
        metaBall.y  += metaBall.sy;
        if (needsToBounce(metaBall.x,metaBall.sx,w)) {
            metaBall.sx = -metaBall.sx;
        }
        if (needsToBounce(metaBall.y,metaBall.sy,h)) {
            metaBall.sy = -metaBall.sy;
        }
    }
}

function fakeBumbMapping(){
    var i = w * 4 + 4;
    var i2 = w+1;
    var dx, dy, b, r;
    var wminus1 = w - 1
    for (var y = 1; y < h; y++) {
        for (var x = 1; x < wminus1; x++) {
            b = data2[i2];
            dx = b - data2[i2 - 1]
            dy = b - data2[i2 - w];
            dx = dx + 128;
            dy = dy + 128;
            r = b * (dx*dx + dy*dy) / 50000;
			r = r>255 ? 255 : r;
            data[i] = r;
            i +=2;
            data[i] = b;
            i++;
            data[i++] = 255;
			i2++
        }
        i += 8;
        i2 += 2;
    }
    
}

function anim(){
    moveBalls()
    calculateImageData();
    fakeBumbMapping();
    frame++;
    ctx.putImageData(imgData, 0, 0);
    setTimeout(anim, 20);
}

function initLavaLamp(){
    ctx = document.getElementById('canvas').getContext('2d');
    imgData = ctx.getImageData(0, 0, w, h);
    data = imgData.data;
    anim();
}

window.onload = function(){
    initLavaLamp();
}
