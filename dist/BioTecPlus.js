import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplaySubArea } from "./DisplaySubArea.js?v=0.0.17"
import { Display } from "./Display.js?v=0.0.17"

export class BioTecPlusDisplay extends Display {

    constructor(card) {
        super(card, 0, 0, 1024, 562)
    }

    configureDisplay() {
        try {
            this.configureParameter("sensor.biotec", "boiler_state")
            this.configureParameter("sensor.biotec", "fire_sensor")
            this.configureParameter("sensor.biotec", "fan")
            this.configureParameter("sensor.biotec", "air_flow_engine_primary")
            this.configureParameter("sensor.biotec", "air_flow_engine_secondary")
            this.configureParameter("sensor.biotec", "pellet_dispenzer|b_doz")
            this.configureParameter("sensor.biotec", "buffer_tank_temparature_up")
            this.configureParameter("sensor.biotec", "buffer_tank_temparature_down")
            this.configureParameter("sensor.biotec", "boiler_temperature_wood|B_Tk1b")
            this.configureParameter("sensor.biotec", "boiler_temperature_pellet|B_Tk1p")
            this.configureParameter("sensor.biotec", "firebox_temperature")
            this.configureParameter("sensor.biotec", "glow")
            //
            this.configureParameter("sensor.biotec", "flue_gas")
            this.configureParameter("sensor.biotec", "configuration")
            this.configureParameter("sensor.biotec", "boiler_pump")
            this.configureParameter("sensor.biotec", "boiler_pump_demand")
            this.configureParameter("sensor.biotec", "command_active")

            // optional
            this.configureParameter("sensor.biotec", "outdoor_temperature", "optional")
            //
            this.configureParameter("sensor.biotec", "lambda_sensor", "optional")
            this.configureParameter("sensor.biotec", "accessories_value", "optional")
            this.configureParameter("sensor.biotec", "circuit_1_correction_type", "optional")
            this.configureParameter("sensor.biotec", "room_measured_temperature", "optional")
            this.configureParameter("sensor.biotec", "room_target_temperature", "optional")
            this.configureParameter("sensor.biotec", "room_target_correction", "optional")
            this.configureParameter("sensor.biotec", "third_pump", "optional")
            this.configureParameter("sensor.biotec", "third_pump_demand", "optional")
            this.configureParameter("sensor.biotec", "domestic_hot_water", "optional")
            this.configureParameter("sensor.biotec", "second_pump", "optional")
            this.configureParameter("sensor.biotec", "second_pump_demand", "optional")
            this.configureParameter("sensor.biotec", "circuit_1_measured_temperature", "optional")
            this.configureParameter("sensor.biotec", "circuit_1_target_temperature", "optional")

        } catch (error) {
            return error;
        }

        // define Sub areas of display
        // this.cskTouchArea = new DisplaySubArea(this, 225, 85, 100, 50)
        // this.conf_bit_01 = new DisplaySubArea(this, 490, 40, 450, 190)
        // this.conf_bit_7 = new DisplaySubArea(this, 631, 380, 260, 170)
        // this.conf_bit_59 = new DisplaySubArea(this, 470, 20, 300, 160)
        // this.conf_bit_9 = new DisplaySubArea(this, 620, 380, 290, 160)
        // this.conf_bit_5 = new DisplaySubArea(this, 620, 380, 290, 160)
        // this.conf_bit_4 = new DisplaySubArea(this, 400, 58, 200, 150)

        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        if (this.values["boiler_state"] == "-") {
            return this.createCard("biopl/background.png",
                html`${this.createText("Boiler unavailable", 36, "color: #ffffff;", 360, 50)}`)
        }

        return this.createCard("biopl/background.png", html`

            <!-- Boiler top -->
            ${this.createImage("biopl/eub.png", 2, 1, 226, null, 7)}

            <!-- Fire -->
            ${this.conditional(
                this.values["fire_sensor"] >= 1000,
                this.createText(">1M", 22, "color: #000000;", 347, 374, null, null, 2, null, "fire_sensor"))}
            ${this.conditional(
                this.values["fire_sensor"] < 1000,
                html`${this.createText(this.values["fire_sensor"] + "k", 22, "color: #000000;", 347, 374, null, null, 2, null, "fire_sensor")}
                     ${this.createImage("peltec/vatra.gif", 302, 390, 40, null, 2, "fire_sensor")}`)}

            <!-- Fan -->
            ${this.conditional(
                this.values["fan"] == 0,
                this.createImage("unit/ventilatorStoji-unit.png", 65, 100, 100, null, 5, "fan")
            )}
            ${this.conditional(
                this.values["fan"] != 0,
                this.createImage("biotec/fan.gif", 65, 100, 100, null, 6, "fan")
            )}

            <!-- Air flow engine positions -->
            ${this.createText(this.values["air_flow_engine_primary"] + "%", 26, "color: #000000;", 100, 302, null, null, 4, null, "air_flow_engine_primary")}
            ${this.createText(this.values["air_flow_engine_secondary"] + "%", 26, "color: #000000;", 100, 365, null, null, 4, null, "air_flow_engine_secondary")}

            <!-- Fire Grid -->
            ${this.createImage("biopl/resetka.png", 282, 495, 80, null, 2, "")}

            <!-- Pellet dispenzer -->
            ${this.conditional(this.values["pellet_dispenzer"] == 0,
                this.createImage("unit/dozatorStoji.png", 308, 341, 28, null, 4, ""),
                this.createImage("unit/dozator_1.gif", 308, 341, 28, null, 4, ""))}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 890, 30, 20, "auto", "outdoor_temperature")}
            ${this.createText(this.formatTemperature("outdoor_temperature") + "°C", 24, "color: #ffffff; text-align: right;", 800, 45, 80, null, 3, null, "outdoor_temperature")}

            <!-- Boiler temperature  -->
            ${this.conditional(
                "boiler_temperature_wood" in this.values,
                this.createText(this.values["boiler_temperature_wood"] + " °C", 34, "color: #000000;",
                    35, 90, null, null, 7, null, "boiler_temperature_wood")
            )}
            ${this.conditional(
                "boiler_temperature_pellet" in this.values,
                this.createText(this.values["boiler_temperature_pellet"] + " °C", 34, "color: #000000;",
                    300, 90, null, null, 7, null, "boiler_temperature_pellet")
            )}

            <!-- Firefox temperature -->
            ${this.createText(this.values["firebox_temperature"] + "°C", 30, "color: #000000;", 65, 510, null, null, 4, null, "firebox_temperature")}

            <!-- Glow -->
            ${this.conditional(
                this.values["glow"] == 1,
                this.createImage("biotec/glow.png", 65, 435, 100, "auto", 3, "glow")
            )}

        `);
    }
}
