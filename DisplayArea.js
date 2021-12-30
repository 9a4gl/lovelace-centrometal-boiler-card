import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export class DisplayArea {

    constructor(posx = 0, posy = 0, width = 1024, height = 580) {
        this.area_posx = posx
        this.area_posy = posy
        this.area_width = width;
        this.area_height = height;
        this.factor = 468 / 1024; // Used for font scaling
    }

    computePercentage(pos, full) {
        return (100.0 * pos / full).toString() + "%;";
    }

    createStyle(styleEnd, left, top, width, height, area_width = this.area_width, area_height = this.area_height) {
        var str = "position: absolute;";
        if (left != null) {
            if (typeof left === 'string' || left instanceof String) {
                str += " left: " + left + ";";
            } else {
                str += " left: " + this.computePercentage(left, area_width);
            }
        }
        if (top != null) {
            if (typeof top === 'string' || top instanceof String) {
                str += " top: " + top + ";";
            } else {
                str += " top: " + this.computePercentage(top, area_height);
            }
        }
        if (width != null) {
            if (width === "auto") {
                str += " width: auto;";
            } else if (typeof width === 'string' || width instanceof String) {
                str += " width: " + width + ";";
            } else {
                str += " width: " + this.computePercentage(width, area_width);
            }
        }
        if (height != null) {
            if (height === "auto") {
                str += " height: auto;";
            } else if (typeof height === 'string' || height instanceof String) {
                str += " height: " + height + ";";
            } else {
                str += " height: " + this.computePercentage(height, area_height);
            }
        }
        str += styleEnd;
        return str;
    }

    createImage(image, left, top, width, height, area_width = this.area_width, area_height = this.area_height, zindex = 1)
    {
        var style = this.createStyle("z-index: " + zindex + ";", left, top, width, height, area_width, area_height);
        image = "/local/lovelace-centrometal-boiler-card/images/" + image;
        return html`<img src="${image}" style="${style}" />`;
    }

    createText(text, font_size, style, left, top, width = null, height = null, area_width = this.area_width, area_height = this.area_height, zindex = 2)
    {
        style = this.createStyle(style, left, top, width, height, area_width, area_height);
        style += "font-size: " + (font_size * this.factor).toString() + "px;";
        style += " font-family: 'Roboto', 'Helvetica'; text-align: center; vertical-align: top; font-weight: bold; z-index:" + zindex + "; margin: auto;";
        return html`<span style="${style}">${text}</span>`;
    }

    conditionalHtml(cond, expr) {
        return cond ? expr : html``;
    }
}

export class DisplaySubArea extends DisplayArea {

    constructor(parent, posx, posy, width, height) {
        super(posx, posy, width, height)
        this.parent = parent
    }

    createSubArea(z, extraStyle = "", content) {
        return html`
        <div style="${this.createStyle(
            " z-index: " + z + ";" + extraStyle,
            this.computePercentage(this.area_posx, this.parent.area_width),
            this.computePercentage(this.area_posy, this.parent.area_height),
            this.computePercentage(this.area_width, this.parent.area_width),
            this.computePercentage(this.area_height, this.parent.area_height))}">
            ${content}
        </div>`
    }
}

