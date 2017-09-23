export class Mandelbrot {

    constructor() {
        this._self = {};
        this._self.lastMaxNumber = null;
        this._self.lastMaxNumberReal = 0;
        this._self.lastMaxNumberImag = 0;
    }

    set limit(limit) {
        this._self.limit = parseFloat(limit);
    }

    get limit() {
        return parseInt(this._self.limit);
    }

    set loopMax(loopMax) {
        this._self.loopMax = parseInt(loopMax);
    }

    get loopMax() {
        return parseInt(this._self.loopMax);
    }

    /**
     * @param {float} real 实部
     * @param {float} imag 虚部
     * @return {int} 停止阈
     *
     * 返回循环指定次数后的数字大小。
     */
    countValue(real, imag) {
        let r = parseFloat(real);
        let i = parseFloat(imag);
        let zr = 0, zi = 0, zr_next = 0, zi_next = 0;
        let c = 0;
        let modules = 0;
        while (c < this._self.loopMax) {
            /* 计算下一个zi */
            zr_next = zr * zr - zi * zi;
            zi_next = 2 * zr * zi;
            zr = zr_next + r;
            zi = zi_next + i;
            c++;
            /* 取模判断大小 */
            modules = Math.sqrt(zr * zr + zi * zi);
            if (modules >= this._self.limit) {
                return this._self.limit;
            }
        }
        return modules;
    }

    /**
     * @param {float} real 实部
     * @param {float} imag 虚部
     * @return {int} 停止阈
     *
     * 返回的数字大小表示发散速度，数字越小，发散越快。
     * 返回的数字最大值等于设置的loopMax，最小值大于0。
     */
    stopValue(real, imag) {
        let r = parseFloat(real);
        let i = parseFloat(imag);
        let zr = 0, zi = 0, zr_next = 0, zi_next = 0;
        let c = 0;
        let modules = 0;
        while (c < this._self.loopMax) {
            /* 计算下一个zi */
            zr_next = zr * zr - zi * zi;
            zi_next = 2 * zr * zi;
            zr = zr_next + r;
            zi = zi_next + i;
            c++;
            /* 取模判断大小 */
            modules = Math.sqrt(zr * zr + zi * zi);
            if (modules >= this._self.limit) {
                return c;
            }
        }
        return false;
        return c;
    }
}
