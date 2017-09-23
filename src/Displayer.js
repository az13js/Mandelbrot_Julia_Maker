/*
使用document.createElement("canvas")可以创建元素的canvas对象。
canvas对象格式是<canvas width="100" height="50"></canvas>，
width和height属性规定了canvas的宽度和高度。
*/

/**
 * Displayer类抽象了一个复数平面，外面不需要知道里面的算法是怎样的，只需要不断请求
 * 屏幕的可视区域就行了。
 */
import {Mandelbrot} from "./Mandelbrot.js";
import {Julia} from "./Julia.js";
import "./main.scss";
import {CanvasDraw} from "./CanvasDraw.js";
import {ColorProcesser} from "./ColorProcesser.js";

export class Displayer {

    constructor(width, height, dataType) {
        this.datasetType = typeof (dataType) == "string" ? dataType : "Mandelbrot";
        this.juliar = -0.3128;
        this.juliai = 0.756;
        this.width = parseInt(width);
        this.height = parseInt(height);
        this.colorMode = "default";

        function createCanvas(width, height) {
            let canvas = document.createElement("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            return canvas;
        }

        this.canvas = createCanvas(width, height);
        this.context2d = this.canvas.getContext("2d");
        this.clear();

        this._showing = {};
        this._showing.left = 0;
        this._showing.right = 0;
        this._showing.bottom = 0;
        this._showing.top = 0;

        this.r = document.createElement("input");
        this.r.setAttribute("type", "text");
        this.r.value = "0";
        this.i = document.createElement("input");
        this.i.setAttribute("type", "text");
        this.i.value = "0";
        this.w = document.createElement("input");
        this.w.setAttribute("type", "text");
        this.w.value = "20";

        this.drawCanvas = createCanvas(width, height);
        let draw = new CanvasDraw(this.drawCanvas);
        this.drawCanvas.style.marginLeft = -width+"px";
        draw.registUpEvent(this.reDraw, this);
        this.drawHandle = draw;
        draw.registPointEvent(this.modeSwitchBack, this);
    }

    set mode(mod) {
        if ("string" != typeof(mod)) {
            return 0;
        }
        this.colorMode = mod;
    }

    get mode() {
        return this.colorMode;
    }

    into(element) {
        element.appendChild(this.canvas);
        element.appendChild(this.drawCanvas);
    }

    /**
     * 鼠标选中一个区域后，重新绘制画面
     *
     * @param {float} x 选中区域的左上角相对于整个canvas的坐标
     * @param {float} y 选中区域的左上角相对于整个canvas的坐标
     * @param {float} width 选中区域的宽度
     * @param {float} height 选中区域的高度
     * @param {Object} that 这个类的实例对象
     */
    reDraw(x, y, width, height, that) {
        let backgroundWidth = parseInt(that.width);
        let backgroundHeight = parseInt(that.height);
        let backgroundHW = backgroundHeight / backgroundWidth;
        let oHW = parseInt(height) / parseInt(width);
        let oHeight = 0, oWidth = 0;
        /* 调整，使得选中区域比例与canvas相同 */
        if (oHW > backgroundHW) {
            oHeight = parseFloat(height);
            oWidth = oHeight / backgroundHW;
        } else {
            oWidth = parseFloat(width);
            oHeight = oWidth * backgroundHW;
        }
        /* 被选中的区域的中心在整个canvas中的位置 */
        let centerX = parseFloat(x) + width / 2;
        let centerY = parseFloat(y) + height / 2;

        /* 计算选中区域中心在复数平面的位置 */
        let dCenterX = (centerX - backgroundWidth / 2) * parseFloat(that.w.value) / backgroundWidth;
        let dCenterY = -(centerY - backgroundHeight / 2) * parseFloat(that.w.value) / backgroundWidth;
        that.r.value = parseFloat(that.r.value) + dCenterX;
        that.i.value = parseFloat(that.i.value) + dCenterY;

        /* 计算出选中区域的可视范围（复数平面下的实数范围） */
        that.w.value = parseFloat(that.w.value) * oWidth / backgroundWidth;
        that.show(that.r.value, that.i.value, that.w.value);
    }

    registSwitback(evt) {
        this.switback = evt;
    }

    modeSwitch() {
        this.drawHandle.mode = "point";
    }

    modeSwitchBack(x, y, width, height, that) {
        let dr = (x - width / 2) * that.w.value / width;
        let di = -(y - height / 2) * that.w.value / width;
        let r = parseFloat(that.r.value) + dr;
        let i = parseFloat(that.i.value) + di;
        if (typeof(that.switback) == "function") {
            that.switback(r, i);
        }
    }

    clear() {
        let width = this.context2d.canvas.width;
        let height = this.context2d.canvas.height;
        let color = "#000000";
        this.context2d.fillStyle = color;
        this.context2d.fillRect(0, 0, width, height);
    }

    setJuliaR(r) {
        this.juliar = parseFloat(r);
    }

    setJuliaI(i) {
        this.juliai = parseFloat(i);
    }

    show(pcr, pci, width) {
        this.r.value = pcr;
        this.i.value = pci;
        this.w.value = width;
        let color = [], min = null, max = null;
        let total = this.width * this.height;
        let cr = 0, ci = 0;
        let trans = (arri, zoomWidth, width, height, cr, ci) => {
            let y = parseInt(arri / width);
            let x = arri % width;
            let i = -y + height / 2;
            let r = x - width / 2;
            let a = zoomWidth / width;
            return [r * a + cr, i * a + ci];
        };
        let dataset = null;
        if (this.datasetType == "Mandelbrot") {
            dataset = new Mandelbrot();
        } else {
            dataset = new Julia(this.juliar, this.juliai);
        }
        dataset.limit = 1000000;
        dataset.loopMax = 250;
        let tmp = [];

        for (let i = 0; i < total; i++) {
            tmp = trans(i, width, this.width, this.height, parseFloat(pcr), parseFloat(pci));
            color[i] = dataset.stopValue(tmp[0], tmp[1]);
            if (false === color[i]) {
                continue;
            }
            if (min === null || max === null) {
                min = color[i];
                max = min;
            }
            if (color[i] < min) {
                min = color[i];
            }
            if (color[i] > max) {
                max = color[i];
            }
        }

        let colorpr = new ColorProcesser(this.colorMode);
        let img = this.context2d.createImageData(this.width, this.height);
        let pix = 0;
        let method = max - min > 0 ? max - min : 1;
        for (let i = 0; i < total; i++) {
            colorpr.float = ((color[i] === false ? max : color[i]) - min) / method;
            colorpr.transform();
            img.data[i*4] = colorpr.r;
            img.data[i*4 + 1] = colorpr.g;
            img.data[i*4 + 2] = colorpr.b;
            img.data[i*4 + 3] = 255;
        }
        this.context2d.putImageData(img, 0, 0);

        this._showing.left = pcr - width / 2;
        this._showing.right = pcr - 0 + width / 2;
        this._showing.bottom = pci - width * this.height / this.width / 2;
        this._showing.top = pci - 0 + width * this.height / this.width / 2;
    }

    get showLeft() {
        return this._showing.left;
    }

    get showRight() {
        return this._showing.right;
    }

    get showBottom() {
        return this._showing.bottom;
    }

    get showTop() {
        return this._showing.top;
    }
}
