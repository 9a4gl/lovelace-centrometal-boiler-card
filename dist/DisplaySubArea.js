import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplayArea } from "./DisplayArea.js?v=0.0.16"

export class DisplaySubArea extends DisplayArea {

    constructor(parent, posx, posy, width, height) {
        super(posx, posy, width, height)
        this.parent = parent
    }

    createSubArea(z, extraStyle = "", content) {
        return html`
        <div style="${this.createStyle(
            "z-index: " + z + "; " + extraStyle,
            this.asPercentage(this.area_posx, this.parent.area_width),
            this.asPercentage(this.area_posy, this.parent.area_height),
            this.asPercentage(this.area_width, this.parent.area_width),
            this.asPercentage(this.area_height, this.parent.area_height))}">
            ${content}
        </div>`
    }
}

