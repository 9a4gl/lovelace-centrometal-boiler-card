import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplayWithPowerButton } from "./DisplayWithPowerButton.js"

export class CmPeletDisplay extends DisplayWithPowerButton {

    configureDisplay(hass) {
        try {
            this.configureParameter(hass, "sensor.cm_pelet", "boiler_state")
            this.configureParameter(hass, "sensor.cm_pelet", "command_active")
            this.configureParameter(hass, "sensor.cm_pelet", "firmware_version")
            this.configureParameter(hass, "sensor.cm_pelet", "b_smd")
            this.configureParameter(hass, "sensor.cm_pelet", "b_cp")

            /* TODO */

            // Service
            this.configureParameter(hass, "switch.cm_pelet", "boiler_switch")

        } catch (error) {
            return error;
        }
        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        return this.createCard("cmpelet/peletsetdisplay-clean.png", html`

            <!-- boiler image on background -->
            ${this.conditional(
                this.values["firmware_version"] > 'v1.25' && this.values["b_cp"] == 1,
                this.createImage("cmpelet/boiler_centroplus.png", -1, 9, 347, null, 0)
            )}

            <!-- TODO -->

            <!-- Boiler power button -->
            ${this.createPowerButton(function (root) { this.turnCmPeletOn(root); }, function (root) { this.turnCmPeletOff(root); })}

        `);
    }

    turnCmPeletOn(root) {
        root.hass.callService("switch", "turn_on", {entity_id: root.display.parameters["boiler_switch"]});
    }

    turnCmPeletOff(root) {
        root.hass.callService("switch", "turn_off", {entity_id: root.display.parameters["boiler_switch"]});
    }

}
