// http://local.flowsheet.com/MandelbrotHTML/dist/
import 'bootstrap';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Displayer as dsp} from './Displayer.js';

function downloadCanvas() {
    let canvas = document.getElementsByTagName("canvas");
    canvas = canvas[0];
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "dataset.png");
    if(document.all) {
        a.click();
    } else {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        a.dispatchEvent(evt);
    }
}

function downloadCanvas2() {
    let canvas = document.getElementsByTagName("canvas");
    canvas = canvas[2];
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "dataset.png");
    if(document.all) {
        a.click();
    } else {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        a.dispatchEvent(evt);
    }
}

function bindColorSelect(elementSelect, display) {
    let change = function(e) {
        display.mode = this.value;
        display.show(display.r.value, display.i.value, display.w.value);
    };
    elementSelect.addEventListener("change", change);
}

function yer() {
    var display = new dsp(800, 600);
    display.into(document.getElementById("display"));
    display.show(display.r.value, display.i.value, display.w.value);
    document.getElementById("save").addEventListener("click", downloadCanvas);

    // Julia
    var julia = new dsp(800, 600, "Julia");
    julia.into(document.getElementById("displayjulia"));
    julia.show(julia.r.value, julia.i.value, julia.w.value);
    document.getElementById("savejulia").addEventListener("click", downloadCanvas2);

    function switback(r, i) {
        document.getElementById("select").setAttribute("class", "btn btn-primary");
        julia.setJuliaR(r);
        julia.setJuliaI(i);
        julia.show(0, 0, 20);
    }
    display.registSwitback(switback);

    function even() {
        document.getElementById("select").setAttribute("class", "btn btn-black");
        display.modeSwitch();
    }
    document.getElementById("select").addEventListener("click", even);

    bindColorSelect(document.getElementById("mandelbortcolor"), display);
    bindColorSelect(document.getElementById("juliacolor"), julia);
}
yer();
