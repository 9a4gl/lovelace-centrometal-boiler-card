import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export class DisplayArea {

    constructor() {
        this.orig_width = 1024;
        this.orig_height = 580;
        this.factor = 468 / this.orig_width;
    }

    computeX(left, orig_width) {
        return (100.0 * left / orig_width).toString() + "%;";
    }

    computeY(top, orig_height) {
        return (100.0 * top / orig_height).toString() + "%;";
    }

    createStyle(styleEnd, left, top, width, height, orig_width = this.orig_width, orig_height = this.orig_height) {
        var str = "position: absolute;";
        if (left != null) {
            if (typeof left === 'string' || left instanceof String) {
                str += " left: " + left + ";";
            } else {
                str += " left: " + this.computeX(left, orig_width);
            }
        }
        if (top != null) {
            if (typeof top === 'string' || top instanceof String) {
                str += " top: " + top + ";";
            } else {
                str += " top: " + this.computeY(top, orig_height);
            }
        }
        if (width != null) {
            if (width === "auto") {
                str += " width: auto;";
            } else if (typeof width === 'string' || width instanceof String) {
                str += " width: " + width + ";";
            } else {
                str += " width: " + this.computeX(width, orig_width);
            }
        }
        if (height != null) {
            if (height === "auto") {
                str += " height: auto;";
            } else if (typeof height === 'string' || height instanceof String) {
                str += " height: " + height + ";";
            } else {
                str += " height: " + this.computeY(height, orig_height);
            }
        }
        str += styleEnd;
        return str;
    }

    createImage(image, left, top, width, height, orig_width = this.orig_width, orig_height = this.orig_height, zindex = 1)
    {
        var style = this.createStyle("z-index: " + zindex + ";", left, top, width, height, orig_width, orig_height);
        image = "/local/lovelace-centrometal-boiler-card/images/" + image;
        return html`<img src="${image}" style="${style}" />`;
    }

    createText(text, font_size, style, left, top, width = null, height = null, orig_width = this.orig_width, orig_height = this.orig_height, zindex = 2)
    {
        style = this.createStyle(style, left, top, width, height, orig_width, orig_height);
        style += "font-size: " + (font_size * this.factor).toString() + "px;";
        style += " font-family: 'Roboto', 'Helvetica'; text-align: center; vertical-align: top; font-weight: bold; z-index:" + zindex + "; margin: auto;";
        return html`<span style="${style}">${text}</span>`;
    }

    conditionalHtml(cond, expr) {
        return cond ? expr : html``;
    }
}
