/**
 * 将从0到1之间的浮点形式的颜色灰度值，转换为红、绿、蓝的伪彩色。
 * 每一种彩色的范围是0到255的整数，可以用于绘制到canvas上。
 */
export class ColorProcesser {

    constructor(mod) {
        this._self = new Object();
        this._self.mode = "string" == typeof(mod) ? mod : "default";
        this._self.floatValue = 0.0;
        this._self.red = 0.0;
        this._self.green = 0.0;
        this._self.blue = 0.0;
    }

    transform() {
        switch (this._self.mode) {
            case "default":
                this._modDefault();
                break;
            case "transposition":
                this._modTransposition();
                break;
            case "bluewhite":
                this._modBlueWhite();
                break;
            case "rainbow":
                this._modRainbow(true);
                break;
            case "rainbow2":
                this._modRainbow(false);
                break;
            default:
                this._modDefault();
        }
    }

    _modDefault() {
        this._self.red = parseInt(256 * this._self.floatValue);
        this._self.green = parseInt(256 * this._self.floatValue);
        this._self.blue = parseInt(256 * this._self.floatValue);
    }

    _modTransposition() {
        let integer = parseInt(0x0FFFFFF * this._self.floatValue);
        this._self.red = (integer & 0x0FF0000) >> 16;
        this._self.green = (integer & 0x0FF00) >> 8;
        this._self.blue = integer & 0x0FF;
    }

    _modRainbow(normal) {
        function rainbow(l) {
            const label = l * 7;
            let r, g, b;
            if (label < 1) {
                r = parseInt(label * 256);
                g = 0;
                b = 0;
            } else if (label < 2) {
                r = 255;
                g = parseInt((label - 1) * 256);
                b = 0;
            } else if (label < 3) {
                r = 255 - parseInt((label - 2) * 256);
                g = 255;
                b = 0;
            } else if (label < 4) {
                r = 0;
                g = 255;
                b = parseInt((label - 3) * 256);
            } else if (label < 5) {
                r = 0;
                g = 255 - parseInt((label - 4) * 256);
                b = 255;
            } else if (label < 6) {
                r = parseInt((label - 5) * 256);
                g = 0;
                b = 255;
            } else {
                r = 255 - parseInt((label - 6) * 256);
                g = 0;
                b = 255 - parseInt((label - 6) * 256);
            }
            return [r, g, b];
        }
        const result = normal ? rainbow(this._self.floatValue) : rainbow(1 - this._self.floatValue);
        this._self.red = result[0];
        this._self.green = result[1];
        this._self.blue = result[2];
    }

    _modBlueWhite() {
        this._self.red = 0;
        this._self.green = 0;
        this._self.blue = 0;

        let float = this._self.floatValue;
        float = 256 * 2 * (float < 0 ? 0 : (float > 1 ? 1 : float));
        if (float < 256) {
            this._self.blue = parseInt(float);
        } else {
            this._self.blue = 255;
            this._self.red = parseInt(float - 256);
            this._self.green = this._self.red;
        }
    }

    set float(val) {
        this._self.floatValue = parseFloat(val);
    }

    get float() {
        return this._self.floatValue;
    }

    get r() {
        return this._self.red;
    }

    get g() {
        return this._self.green;
    }

    get b() {
        return this._self.blue;
    }

    set r(e) {
        throw("Error, color r can't be set.");
    }

    set g(e) {
        throw("Error, color g can't be set.");
    }

    set b(e) {
        throw("Error, color b can't be set.");
    }

    set mode(mode) {
        if ("string" != typeof(mode)) {
            throw ("ColorProcesser::mode must have typeof string. The type you give is "+typeof(mode));
        }
        this._self.mode = mode;
    }

    get mode() {
        return this._self.mode;
    }
}
