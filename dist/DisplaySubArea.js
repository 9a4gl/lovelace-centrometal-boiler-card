import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplayArea } from "./DisplayArea.js?v=0.0.27"

export class DisplaySubArea extends DisplayArea {

    constructor(parent, posx, posy, width, height) {
        super(posx, posy, width, height, parent.mobile)
        this.parent = parent
    }

    createSubArea(z, extraStyle = "", content) {
        return html`
        <div style="${this.createStyle(
            "z-index: " + z + "; " + extraStyle,
            this.parent.getDimensionX(this.area_posx),
            this.parent.getDimensionY(this.area_posy),
            this.parent.getDimensionX(this.area_width),
            this.parent.getDimensionY(this.area_height))}">
            ${content}
        </div>`
    }
}

