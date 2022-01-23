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
            this.configureParameter(hass, "sensor.biotec", "fan")
            this.configureParameter(hass, "sensor.biotec", "air_flow_engine_primary")
            this.configureParameter(hass, "sensor.biotec", "air_flow_engine_secondary")
            this.configureParameter(hass, "sensor.biotec", "boiler_temperature")
            this.configureParameter(hass, "sensor.biotec", "firebox_temperature")
            this.configureParameter(hass, "sensor.biotec", "glow")
            this.configureParameter(hass, "sensor.biotec", "flue_gas")
            this.configureParameter(hass, "sensor.biotec", "command_active")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump_demand")
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

            <!-- Boiler top -->
            ${this.createImage("biotec/upperBoiler.png", 2, 1, 226, null, 3)}

            <!-- Fan -->
            ${this.conditional(
                this.values["fan"] == 0,
                this.createImage("unit/ventilatorStoji-unit.png", 65, 100, 100, null, 1)
            )}
            ${this.conditional(
                this.values["fan"] != 0,
                this.createImage("biotec/fan.gif", 65, 100, 100, null, 2)
            )}

            <!-- Air flow engine positions -->
            ${this.createText(this.values["air_flow_engine_primary"] + "%", 26, "color: #000000;", 100, 302, null, null, 4)}
            ${this.createText(this.values["air_flow_engine_secondary"] + "%", 26, "color: #000000;", 100, 365, null, null, 4)}

            <!-- Boiler temperature -->
            ${this.createText(this.values["boiler_temperature"] + "°C", 34, "color: #000000;", 65, 90, null, null, 4)}

            <!-- Buffer -->
            ${this.conditional(
                "buffer_tank_temparature_up" in this.values,
                this.createText(this.values["buffer_tank_temparature_up"] + " °C", 32, "color: #0000ff; text-align: center;", 465, 240, null, null, 4)
            )}
            ${this.conditional(
                "buffer_tank_temparature_down" in this.values,
                this.createText(this.values["buffer_tank_temparature_down"] + " °C", 32, "color: #0000ff; text-align: center;", 465, 460, null, null, 4)
            )}

            <!-- Firefox temperature -->
            ${this.createText(this.values["firebox_temperature"] + "°C", 30, "color: #000000;", 65, 510, null, null, 4)}


            <!-- Glow -->
            ${this.conditional(
                this.values["glow"] == 1,
                this.createImage("biotec/glow.png", 65, 435, 100, "auto", 3)
            )}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 350, 20, 16, "auto")}
            ${this.createText(this.formatTemperature("outdoor_temperature") + "°C", 24, "color: #ffffff;", 285, 30)}


            <!-- Oxygen (lambda) sensor -->
            ${this.conditional(
                "lambda_sensor" in this.values && this.values["lambda_sensor"] > 0.1,
                html`${this.createImage("peltec/senzor_b_1.png", 120, 34, 46, null, 4)}
                     ${this.createText(html`
                        ${this.values["lambda_sensor"] < 25.4 ? this.values["lambda_sensor"] : "-"}%`, 28, "color: #ffffff; text-align: center;", 175, 30, null, null, 5)}`)}

            <!-- Flue gas temperature -->
            ${this.createText(this.values["flue_gas"] + "°C", 28, "color: #FFFFFF;",  5, 15, null, null, 5)}
            ${this.createImage("peltec/senzor_b_2.png", 75, 35, 40, null, 5)}



        `);
    }

}
