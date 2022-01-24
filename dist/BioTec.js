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
            this.configureParameter(hass, "sensor.biotec", "configuration")

            this.configureParameter(hass, "sensor.biotec", "command_active")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump")
            this.configureParameter(hass, "sensor.biotec", "boiler_pump_demand")
            this.configureParameter(hass, "sensor.biotec", "mixer_temperature")

            // optional
            this.configureParameter(hass, "sensor.biotec", "lambda_sensor", "optional")
            this.configureParameter(hass, "sensor.biotec", "outdoor_temperature", "optional")
            this.configureParameter(hass, "sensor.biotec", "buffer_tank_temparature_up", "optional")
            this.configureParameter(hass, "sensor.biotec", "buffer_tank_temparature_down", "optional")
            this.configureParameter(hass, "sensor.biotec", "accessories_value", "optional")
            this.configureParameter(hass, "sensor.biotec", "circuit_1_correction_type", "optional")
            this.configureParameter(hass, "sensor.biotec", "room_measured_temperature", "optional")
            this.configureParameter(hass, "sensor.biotec", "room_target_temperature", "optional")
            this.configureParameter(hass, "sensor.biotec", "room_target_correction", "optional")
            this.configureParameter(hass, "sensor.biotec", "third_pump", "optional")
            this.configureParameter(hass, "sensor.biotec", "third_pump_demand", "optional")

        } catch (error) {
            return error;
        }

        // define Sub areas of display
        this.cskTouchArea = new DisplaySubArea(this, 225, 85, 100, 50)
        this.conf_bit_01 = new DisplaySubArea(this, 490, 40, 450, 190)

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

            <!-- CSK indicator -->
            ${this.conditional(
                "accessories_value" in this.values &&  this.values["accessories_value"] != 255 && this.values["accessories_value"] < 9 ,
                this.cskTouchArea.createSubArea(2, "",
                    html`${this.cskTouchArea.createImage("peltec/csk_touch_indicator.png", 15, 0, 68, "auto", 2)}
                         ${this.cskTouchArea.createText(this.values["accessories_value"], 24, "color: #ffffff; text-align: right;", 42, 13, null, null, 3)}
                    `))}

            <!- Pump -->
            ${this.conditional(this.values["boiler_pump_demand"] == 1, this.createImage("peltec/demand_p.png", 260, 492, 12, null, 3))}
            ${this.conditional(this.values["boiler_pump"] == 1, this.createImage("peltec/pumpaokrece.gif", 257, 465, 64, null, 2))}

            <!-- Room - Konf 0 or 1 -->
            ${this.conditional(
                this.hexBitIsSet(this.values["configuration"], 0) || this.hexBitIsSet(this.values["configuration"], 1),
                this.conf_bit_01.createSubArea(1, "",
                    html`
                        ${this.conf_bit_01.createImage("biotec/room_part.png", 5, 5, 431, "auto", 1)}
                        ${this.conditional(
                            this.hexBitIsSet(this.values["configuration"], 0),
                            this.conf_bit_01.createImage("peltec/radijatorCm2k.png", 145, 65, 90, "auto", 2))}
                        ${this.conditional(
                            this.hexBitIsSet(this.values["configuration"], 1),
                            this.conf_bit_01.createImage("peltec/podnoCm2k.png", 145, 135, 254, "auto", 2))}
                        ${this.conditional(
                            this.hexBitIsSet(this.values["configuration"], 3) ||
                            ("circuit_1_correction_type" in this.values && this.values["circuit_1_correction_type"] != 0),
                            this.conf_bit_01.createImage("peltec/korektorCm2k.png", 150, 30, 30, "auto", 2))}
                        ${this.conditional(
                            ("room_measured_temperature" in this.values) &&
                            ("circuit_1_correction_type" in this.values && this.values["circuit_1_correction_type"] != 0),
                            this.conf_bit_01.createText(this.values["room_measured_temperature"] + "°C", 22, "color: #ffffff; text-align: right;", 290, 105, null, null, 2))}
                        ${this.conditional(
                            ("circuit_1_correction_type" in this.values && this.values["circuit_1_correction_type"] != 0),
                            this.conf_bit_01.createImage("peltec/termometarCm2k.png", 250, 95, 30, "auto", 2))}
                        ${this.conditional(
                            ("room_target_temperature" in this.values) &&
                            this.hexBitIsClear(this.values["configuration"], 3),
                            this.conf_bit_01.createText(this.values["room_target_temperature"] + "°C", 18, "color: #ff9900; text-align: right;", 190, 35, null, null, 2))}
                        ${this.conditional(
                            ("circuit_1_correction_type" in this.values) && ("room_target_correction" in this.values) && this.values["circuit_1_correction_type"] == 1,
                            this.conf_bit_01.createText("+" + this.values["room_target_correction"] + "°C", 22, "color: #ff9900; text-align: left;", 255, 35, null, null, 2))}
                        <!-- pump -->
                        ${this.conditional(this.values["third_pump_demand"] == 1, this.conf_bit_01.createImage("peltec/demand_p.png", 20, 39, 12, null, 3))}
                        ${this.conditional(this.values["third_pump"] == 1, this.conf_bit_01.createImage("peltec/pumpaokrece.gif", 18, 12, 64, null, 2))}
                    `))}
        `);
    }
}
