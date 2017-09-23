/**
 * 鼠标画圈呈现层Canvas绘制器，需要外部先弄好canvas元素，这个类不会自己创建
 * canvas的。
 */
export class CanvasDraw {

    constructor(canvas) {
        this.canvas = canvas;
        this.context2d = this.canvas.getContext("2d");
        this.canvas.upEvent = null;
        this.canvas.srcObject = null;
        this.addEvent();

        /**
         * normal 是红色框选择
         * point 是选择一个点
         */
        this.canvas.drawMode = "normal";
    }

    set mode(mod) {
        this.canvas.drawMode = mod;
    }

    get mode() {
        return this.canvas.drawMode;
    }

    /**
     * 注册一个函数，当鼠标选择一个区域后将坐标信息传递给这个注册的函数
     * src是可选参数，调用注册的函数时，会把这个参数传递回被调用函数
     */
    registUpEvent(up, src) {
        this.canvas.upEvent = up;
        this.canvas.srcObject = src;
    }

    registPointEvent(fun, src) {
        this.canvas.pointEvent = new Object();
        this.canvas.pointEvent.fun = fun;
        this.canvas.pointEvent.src = src;
    }

    addEvent() {
        this.canvas.down = 0;
        this.canvas.dataset.firstx = -1;
        this.canvas.dataset.firsty = -1;
        this.canvas.addEventListener("mousemove", (e) => {
            function minvalue(a, b) {
                return parseInt(a) < parseInt(b) ? parseInt(a) : parseInt(b);
            }
            this.canvas.dataset.x = e.offsetX;
            this.canvas.dataset.y = e.offsetY;
            if ("point" == this.canvas.drawMode) {
                /* 清除画布内容，这里给画布画十字架 */
                let context2d = this.canvas.getContext("2d");
                let width = parseInt(context2d.canvas.width);
                let height = parseInt(context2d.canvas.height);
                context2d.clearRect(0, 0, width, height);
                context2d.strokeStyle = "#FF0000";
                context2d.strokeRect(-10, -10, width+100, parseInt(this.canvas.dataset.y)+10);
                context2d.strokeRect(-10, -10, parseInt(this.canvas.dataset.x)+10, height+100);
            }
            if ("normal" == this.canvas.drawMode) {
                if (1 == this.canvas.dataset.down) { /* 鼠标已经按下 */
                    let context2d = this.canvas.getContext("2d");
                    let width = context2d.canvas.width;
                    let height = context2d.canvas.height;
                    /* 清除画布，这里给canvas画矩形 */
                    context2d.clearRect(0, 0, width, height);
                    context2d.strokeStyle = "#FF0000";
                    context2d.strokeRect(
                        minvalue(this.canvas.dataset.firstx, this.canvas.dataset.x),
                        minvalue(this.canvas.dataset.firsty, this.canvas.dataset.y),
                        Math.abs(this.canvas.dataset.firstx - this.canvas.dataset.x),
                        Math.abs(this.canvas.dataset.firsty - this.canvas.dataset.y)
                    );
                }
            }
        });
        this.canvas.addEventListener("mousedown", (e) => {
            if (this.canvas.drawMode == "normal") {
                this.canvas.dataset.down = 1;
                this.canvas.dataset.firstx = e.offsetX;
                this.canvas.dataset.firsty = e.offsetY;
                let context2d = this.canvas.getContext("2d");
                let width = context2d.canvas.width;
                let height = context2d.canvas.height;
                context2d.clearRect(0, 0, width, height);
            }
        });
        this.canvas.addEventListener("mouseup", (e) => {
            if (this.canvas.drawMode == "normal") {
                this.canvas.dataset.down = 0;
                function minvalue(a, b) {
                    return parseFloat(a) < parseFloat(b) ? parseFloat(a) : parseFloat(b);
                }
                if (null !== this.canvas.upEvent) {
                    this.canvas.upEvent(
                        minvalue(this.canvas.dataset.firstx, this.canvas.dataset.x),
                        minvalue(this.canvas.dataset.firsty, this.canvas.dataset.y),
                        Math.abs(this.canvas.dataset.firstx - this.canvas.dataset.x),
                        Math.abs(this.canvas.dataset.firsty - this.canvas.dataset.y),
                        this.canvas.srcObject
                    );
                    let context2d = this.canvas.getContext("2d");
                    let width = context2d.canvas.width;
                    let height = context2d.canvas.height;
                    context2d.clearRect(0, 0, width, height);
                }
            }
            if (this.canvas.drawMode == "point") {
                this.canvas.drawMode = "normal";
                if ("undefined" != typeof (this.canvas.pointEvent)) {
                    this.canvas.pointEvent.fun(
                        parseInt(this.canvas.dataset.x), parseInt(this.canvas.dataset.y),
                        parseInt(this.canvas.width), parseInt(this.canvas.height),
                        this.canvas.pointEvent.src
                    );
                }
            }
        });
    }

    draw(x0, y0, x, y) {
        this.context2d.strokeStyle = "#FF0000";
        this.context2d.strokeRect(x0, y0, Math.abs(x - x0), Math.abs(y - y0));
    }

    clean() {
        let width = this.context2d.canvas.width;
        let height = this.context2d.canvas.height;
        this.context2d.clearRect(0, 0, width, height);
    }
}
