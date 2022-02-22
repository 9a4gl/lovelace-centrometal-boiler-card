import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export class DisplayArea {

    constructor(posx, posy, width, height, mobile) {
        this.area_posx = posx
        this.area_posy = posy
        this.area_width = width;
        this.area_height = height;
        this.mobile = mobile
        this.scale_factor = 468.0 / 1024.0; // Used for font scaling
        this.images_folder = "/local/community/lovelace-centrometal-boiler-card/images/"
    }

    isString(obj) {
        return (typeof obj === 'string' || obj instanceof String)
    }

    asPercentage(pos, full) {
        return (100.0 * parseFloat(pos) / parseFloat(full)).toString() + "%;";
    }

    hexBitIsSet(firstNumber, secondNumber) {
        return ((parseInt(firstNumber, 16) >> secondNumber) % 2 != 0)
    }

    hexBitIsClear(firstNumber, secondNumber){
        return ((parseInt(firstNumber, 16) >> secondNumber) % 2 == 0)
    }

    createStyle(styleEnd, left, top, width, height, padding = -1) {
        var str = "position: absolute;";
        if (left != null) {
            if (this.isString(left)) {
                str += " left: " + left + ";";
            } else {
                if (padding != -1) {
                    str += " padding:" + this.asPercentage(padding, this.area_width);
                    left -= padding;
                }
                str += " left: " + this.asPercentage(left, this.area_width);
            }
        }
        if (top != null) {
            if (this.isString(top)) {
                str += " top: " + top + ";";
            } else {
                if (padding != -1) {
                    top -= padding;
                }
                str += " top: " + this.asPercentage(top, this.area_height);
            }
        }
        if (width != null) {
            if (width === "auto") {
                str += " width: auto;";
            } else if (this.isString(width)) {
                str += " width: " + width + ";";
            } else {
                str += " width: " + this.asPercentage(width, this.area_width);
            }
        }
        if (height != null) {
            if (height === "auto") {
                str += " height: auto;";
            } else if (this.isString(height)) {
                str += " height: " + height + ";";
            } else {
                str += " height: " + this.asPercentage(height, this.area_height);
            }
        }
        str += styleEnd;
        return str;
    }

    createImage(image, left, top, width, height, zindex = 1, entity = "")
    {
        const onClickFunction = () => {
            const display = this.getDisplay(this)
            if ((entity !== "") && (entity in display.values)) {
                this.showMoreInfo(display, entity)
            }
        }
        var style = this.createStyle("z-index: " + zindex + ";", left, top, width, height);
        if (image.endsWith("!")) {
            image = image.substring(0, image.length - 1);
            style += " pointer-events: none;"
        }
        image = this.images_folder + image + "?v=0.0.21";
        return html`<img src="${image}" style="${style}" @click=${onClickFunction} />`;
    }

    updateScalingFactor() {
        if (typeof this.parent !== 'undefined') {
            this.scale_factor = this.parent.scale_factor
        }
    }

    createText(text, font_size, style, left, top, width = null, height = null, zindex = 2, padding = null, entity = "")
    {
        this.updateScalingFactor()
        padding = (padding == null) ? -1 : padding
        const onClickFunction = () => {
            const display = this.getDisplay(this)
            if ((entity !== "") && (entity in display.values)) {
                this.showMoreInfo(display, entity)
            }
        }
        style = this.createStyle(style, left, top, width, height, padding);
        style += "font-size: " + (font_size * this.scale_factor).toString() + "px;";
        style += " font-family: 'Roboto', 'Helvetica'; text-align: center; vertical-align: top; font-weight: bold; z-index:" + zindex + "; margin: auto;";
        return html`<span style="${style}" @click=${onClickFunction} >${text}</span>`;
    }

    conditional(cond, expr, else_expr = html``) {
        return cond ? expr : else_expr;
    }

    createCard(background_image, content) {
        this.updateScalingFactor()
        return html`
        <div class="card-content" style="position: relative; top: 0; left: 0; padding: 0px; width: auto; height: auto; line-height: ${26 * this.scale_factor}px;">
            <img src="${this.images_folder}${background_image}?v=0.0.16" style="width: 100%; top: 0; left: 0; position: relative; border-radius: var(--ha-card-border-radius, 4px);" />
            ${content}
        </div>`;
    }

    showMoreInfo(display, name)
    {
        const event = new Event("hass-more-info", {
          bubbles: true,
          cancelable: Boolean(false),
          composed: true,
        });
        event.detail = {
            entityId: display.parameters[name]
        };
        display.card.dispatchEvent(event);
    }

    getDisplay(display) {
        // In case we are in sub area, we need to go to top parent
        while (!display.hasOwnProperty("parameters")) {
            if (!display.hasOwnProperty("parent")) {
                return
            }
            display = display.parent
        }
        return display
    }
}
