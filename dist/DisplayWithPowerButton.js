import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { Display } from "./Display.js?v=0.0.22"

export class DisplayWithPowerButton extends Display {

    createPowerButton(turnBoilerOn, turnBoilerOff) {
        this.turnBoilerOn = turnBoilerOn
        this.turnBoilerOff = turnBoilerOff
        return html`
        <button
        style="${this.createStyle("margin: 0; border: 0px; vertical-align: top; z-index: 5; background-color: rgba(255,255,255,0.0);", 890, this.area_height - 130, 130, 130)}"
        @click="${this.toggleBoilerOnOff}"></button>

        <!-- Turn On / Turn Off / Cancel popup -->
        <div id="${this.card_id}_popup" style="${this.createStyle("display: none; z-index: 100; background-color: rgba(222, 222, 222, 0.75); border-radius: var(--ha-card-border-radius, 4px);", 5, 5, this.area_width - 10, this.area_height - 10)}">
            <div style="position: absolute; margin: 0; top: 50%; left: 50%; text-align: center; transform: translate(-50%, -50%); width: 100%;">
                <button id="${this.card_id}_on_button" type="button" @click="${this.handleTurnOn}" style="display: inline; margin: auto; width:auto; padding: 10px;">TURN ON</button>
                <button id="${this.card_id}_off_button" type="button" @click="${this.handleTurnOff}" style="display: none; margin: auto; width:auto; padding: 10px;">TURN OFF</button>
                <p style="display: inline-block; width: 50px;"></p>
                <button type="button" @click="${this.hidePopup}" style="display: inline; margin: auto; width:auto; padding: 10px;">CANCEL</button>
            </div>
        </div>`
    }

    toggleBoilerOnOff() {
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        var on = this.shadowRoot.getElementById(this.display.card_id + "_on_button");
        var off = this.shadowRoot.getElementById(this.display.card_id + "_off_button");
        if (this.display.values["boiler_state"] == "OFF") {
            on.style.display = "inline";
            off.style.display = "none";
        } else {
            on.style.display = "none";
            off.style.display = "inline";
        }
        popup.style.display = "block";
    }

    handleTurnOn() {
        this.display.turnBoilerOn(this)
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }

    handleTurnOff() {
        this.display.turnBoilerOff(this)
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }

    hidePopup() {
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }
}
