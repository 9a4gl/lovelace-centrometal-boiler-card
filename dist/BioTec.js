import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplaySubArea } from "./DisplaySubArea.js"
import { Display } from "./Display.js"

export class BioTecDisplay extends Display {

    constructor(config) {
        super(config, 0, 0, 1024, 562)
    }

    configureDisplay(hass) {
        try {
            this.configureParameter(hass, "sensor.biotec", "boiler_state")
            this.configureParameter(hass, "sensor.biotec", "command_active")
            this.configureParameter(hass, "sensor.biotec", "fan")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump_demand")
            this.configureParameter(hass, "sensor.biotec", "boiler_temperature")
            this.configureParameter(hass, "sensor.biotec", "flue_gas")
            this.configureParameter(hass, "sensor.biotec", "mixer_temperature")
            this.configureParameter(hass, "sensor.biotec", "configuration")

            // optional
            this.configureParameter(hass, "sensor.biotec", "lambda_sensor", "optional")
            this.configureParameter(hass, "sensor.biotec", "outdoor_temperature", "optional")
            this.configureParameter(hass, "sensor.biotec", "buffer_tank_temparature_up", "optional")
            this.configureParameter(hass, "sensor.biotec", "buffer_tank_temparature_down", "optional")
            this.configureParameter(hass, "sensor.biotec", "accessories", "optional")
            this.configureParameter(hass, "sensor.biotec", "accessories_value", "optional")
            this.configureParameter(hass, "sensor.biotec", "operation_mode", "optional")

        } catch (error) {
            return error;
        }

        // define Sub areas of display

        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        if (this.values["boiler_state"] == "-") {
            return this.createCard("biotec/biotecL-template.png",
                html`${this.createText("Boiler unavailable", 36, "color: #ffffff;", 360, 50)}`)
        }

        return this.createCard("biotec/biotecL-template.png", html`
        `);
    }

}
