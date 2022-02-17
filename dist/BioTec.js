import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplaySubArea } from "./DisplaySubArea.js?v=0.0.18"
import { Display } from "./Display.js?v=0.0.18"

export class BioTecDisplay extends Display {

    constructor(card) {
        super(card, 0, 0, 1024, 562)
    }

    configureDisplay() {
        try {
            this.configureParameter("sensor.biotec", "boiler_state")
            this.configureParameter("sensor.biotec", "fan")
            this.configureParameter("sensor.biotec", "air_flow_engine_primary")
            this.configureParameter("sensor.biotec", "air_flow_engine_secondary")
            this.configureParameter("sensor.biotec", "boiler_temperature")
            this.configureParameter("sensor.biotec", "firebox_temperature")
            this.configureParameter("sensor.biotec", "glow")
            this.configureParameter("sensor.biotec", "flue_gas")
            this.configureParameter("sensor.biotec", "configuration")
            this.configureParameter("sensor.biotec", "boiler_pump")
            this.configureParameter("sensor.biotec", "boiler_pump_demand")
            this.configureParameter("sensor.biotec", "command_active")

            // optional
            this.configureParameter("sensor.biotec", "lambda_sensor", "optional")
            this.configureParameter("sensor.biotec", "outdoor_temperature", "optional")
            this.configureParameter("sensor.biotec", "buffer_tank_temparature_up", "optional")
            this.configureParameter("sensor.biotec", "buffer_tank_temparature_down", "optional")
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
        this.cskTouchArea = new DisplaySubArea(this, 225, 85, 100, 50)
        this.conf_bit_01 = new DisplaySubArea(this, 490, 40, 450, 190)
        this.conf_bit_7 = new DisplaySubArea(this, 631, 380, 260, 170)
        this.conf_bit_59 = new DisplaySubArea(this, 470, 20, 300, 160)
        this.conf_bit_9 = new DisplaySubArea(this, 620, 380, 290, 160)
        this.conf_bit_5 = new DisplaySubArea(this, 620, 380, 290, 160)
        this.conf_bit_4 = new DisplaySubArea(this, 400, 58, 200, 150)

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
                this.createImage("unit/ventilatorStoji-unit.png", 65, 100, 100, null, 1, "fan")
            )}
            ${this.conditional(
                this.values["fan"] != 0,
                this.createImage("biotec/fan.gif", 65, 100, 100, null, 2, "fan")
            )}

            <!-- Air flow engine positions -->
            ${this.createText(this.values["air_flow_engine_primary"] + "%", 26, "color: #000000;", 100, 302, null, null, 4, null, "air_flow_engine_primary")}
            ${this.createText(this.values["air_flow_engine_secondary"] + "%", 26, "color: #000000;", 100, 365, null, null, 4, null, "air_flow_engine_secondary")}

            <!-- Boiler temperature -->
            ${this.createText(this.values["boiler_temperature"] + "°C", 34, "color: #000000;", 65, 90, null, null, 4, null, "boiler_temperature")}

            <!-- Buffer -->
            ${this.conditional(
                "buffer_tank_temparature_up" in this.values,
                this.createText(this.values["buffer_tank_temparature_up"] + " °C", 32, "color: #0000ff; text-align: center;",
                    465, 240, null, null, 4, null, "buffer_tank_temparature_up")
            )}
            ${this.conditional(
                "buffer_tank_temparature_down" in this.values,
                this.createText(this.values["buffer_tank_temparature_down"] + " °C", 32, "color: #0000ff; text-align: center;",
                    465, 460, null, null, 4, null, "buffer_tank_temparature_down")
            )}

            <!-- Firefox temperature -->
            ${this.createText(this.formatTemperature("firebox_temperature", "--", 1000) + "°C", 30, "color: #000000;", 65, 510, null, null, 4, null, "firebox_temperature")}

            <!-- Glow -->
            ${this.conditional(
                this.values["glow"] == 1,
                this.createImage("biotec/glow.png", 65, 435, 100, "auto", 3, "glow")
            )}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 350, 20, 16, "auto", "outdoor_temperature")}
            ${this.createText(this.formatTemperature("outdoor_temperature") + "°C", 24, "color: #ffffff;", 285, 30, null, null, 3, null, "outdoor_temperature")}

            <!-- Oxygen (lambda) sensor -->
            ${this.conditional(
                "lambda_sensor" in this.values && this.values["lambda_sensor"] > 0.1,
                html`${this.createImage("peltec/senzor_b_1.png", 120, 34, 46, null, 4)}
                     ${this.createText(html`
                        ${this.values["lambda_sensor"] < 25.4 ? this.values["lambda_sensor"] : "-"}%`, 28,
                         "color: #ffffff; text-align: center;", 175, 30, null, null, 5, null, "lambda_sensor")}`)}

            <!-- Flue gas temperature -->
            ${this.createText(this.values["flue_gas"] + "°C", 28, "color: #FFFFFF;",  5, 15, null, null, 5, null, "flue_gas")}
            ${this.createImage("peltec/senzor_b_2.png", 75, 35, 40, null, 5)}

            <!-- CSK indicator -->
            ${this.conditional(
                "accessories_value" in this.values &&  this.values["accessories_value"] != 255 && this.values["accessories_value"] < 9 ,
                this.cskTouchArea.createSubArea(2, "",
                    html`${this.cskTouchArea.createImage("peltec/csk_touch_indicator.png", 15, 0, 68, "auto", 2)}
                         ${this.cskTouchArea.createText(this.values["accessories_value"], 24, "color: #ffffff; text-align: right;", 42, 13, null, null, 3)}
                    `))}

            <!- Pump -->
            ${this.conditional(
                this.values["boiler_pump_demand"] == 1,
                this.createImage("peltec/demand_p.png", 260, 492, 12, null, 3, "boiler_pump_demand"),
                this.createImage("transparent.png", 260, 492, 12, null, 3, "boiler_pump_demand"))}
            ${this.conditional(
                this.values["boiler_pump"] == 1,
                this.createImage("peltec/pumpaokrece.gif", 257, 465, 64, null, 2, "boiler_pump"),
                this.createImage("transparent.png", 257, 465, 64, null, 2, "boiler_pump"))}

            <!-- Room - Konf 4 -->
            ${this.conditional(this.hexBitIsSet(this.values["configuration"], 4),
                this.conf_bit_4.createSubArea(1, "",
                    html`
                        ${this.conditional("circuit_1_measured_temperature" in this.values,
                            this.conf_bit_4.createText(this.values["circuit_1_measured_temperature"] + "°C", 25, "color: #ffffff; text-align: center;",
                                10, -40, null, null, 1, null, "circuit_1_measured_temperature")
                        )}
                        ${this.conditional("circuit_1_target_temperature" in this.values,
                            this.conf_bit_4.createText(this.values["circuit_1_target_temperature"] + "°C", 20, "color: #ff9900; text-align: center;",
                                110, -40, null, null, 1, null, "circuit_1_target_temperature")
                        )}
                        ${this.conf_bit_4.createImage("biotec/pipeline_0.png", 0, 0, 101, "auto", 1)}
                        ${this.conf_bit_4.createImage("peltec/senzorDugi.png", 80, -22, 20, "auto", 1)}
                    `))}

            <!-- Room - Konf 0 or 1 -->
            ${this.conditional(
                this.hexBitIsSet(this.values["configuration"], 0) || this.hexBitIsSet(this.values["configuration"], 1),
                this.conf_bit_01.createSubArea(1, "",
                    html`
                        ${this.conf_bit_01.createImage("biotec/room_part.png!", 5, 5, 431, "auto", 1)}
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
                            this.conf_bit_01.createText(this.values["room_measured_temperature"] + "°C", 22, "color: #ffffff; text-align: right;",
                                290, 105, null, null, 2, null, "room_measured_temperature"))}
                        ${this.conditional(
                            ("circuit_1_correction_type" in this.values && this.values["circuit_1_correction_type"] != 0),
                            this.conf_bit_01.createImage("peltec/termometarCm2k.png", 250, 95, 30, "auto", 2))}
                        ${this.conditional(
                            ("room_target_temperature" in this.values) &&
                            this.hexBitIsClear(this.values["configuration"], 3),
                            this.conf_bit_01.createText(this.values["room_target_temperature"] + "°C", 18, "color: #ff9900; text-align: right;",
                                190, 35, null, null, 2, null, "room_target_temperature"))}
                        ${this.conditional(
                            ("circuit_1_correction_type" in this.values) && ("room_target_correction" in this.values) && this.values["circuit_1_correction_type"] == 1,
                            this.conf_bit_01.createText("+" + this.values["room_target_correction"] + "°C", 22, "color: #ff9900; text-align: left;",
                                255, 35, null, null, 2, null, "room_target_correction"))}
                        <!-- pump -->
                        ${this.conditional(
                            this.values["third_pump_demand"] == 1,
                            this.conf_bit_01.createImage("peltec/demand_p.png", 20, 39, 12, null, 3, "third_pump_demand"),
                            this.conf_bit_01.createImage("transparent.png", 20, 39, 12, null, 3, "third_pump_demand"))}
                        ${this.conditional(
                            this.values["third_pump"] == 1,
                            this.conf_bit_01.createImage("peltec/pumpaokrece.gif", 18, 12, 64, null, 2, "third_pump"),
                            this.conf_bit_01.createImage("transparent.png", 18, 12, 64, null, 2, "third_pump"))}
                    `))}

            <!-- Room - Konf 7 -->
            ${this.conditional(this.hexBitIsSet(this.values["configuration"], 7),
                this.conf_bit_7.createSubArea(1, "",
                    html`
                        ${this.conf_bit_7.createText("TODO: Not implemented Conf:7", 32, "", 0, 0, null, null, 2)};
                    `))}

            <!-- Room - Konf 5 and 9 -->
            ${this.conditional(
                this.hexBitIsSet(this.values["configuration"], 5) && this.hexBitIsSet(this.values["configuration"], 9),
                this.conf_bit_59.createSubArea(1, "",
                    html`
                        ${this.conf_bit_7.createText("TODO: Not implemented Conf:5", 32, "", 0, 0, null, null, 2)};
                    `))}

            <!-- Room - Konf 9 -->
            ${this.conditional(this.hexBitIsSet(this.values["configuration"], 9),
                this.conf_bit_9.createSubArea(1, "",
                    html`
                    ${this.conf_bit_7.createText("TODO: Not implemented Conf:9", 32, "", 0, 0, null, null, 2)};
                    `))}

            <!-- Room - Konf 5 -->
            ${this.conditional(this.hexBitIsSet(this.values["configuration"], 5),
                this.conf_bit_5.createSubArea(1, "",
                    html`
                        ${this.conf_bit_5.createImage("biotec/dhw_part.png!", 5, -70, 219, null, 1)}
                        ${this.conditional(
                            "domestic_hot_water" in this.values,
                            this.conf_bit_5.createText(this.values["domestic_hot_water"] + "°C", 32, "color: #0000ff; text-align: center;",
                                130, -30, null, null, 2, null, "domestic_hot_water"))}
                        ${this.conditional(
                            "second_pump" in this.values && this.values["second_pump"] == 1,
                            this.conf_bit_5.createImage("peltec/pumpaokrece.gif", 17, 5, 64, null, 2, "second_pump"),
                            this.conf_bit_5.createImage("transparent.png", 17, 5, 64, null, 2, "second_pump"))}
                        ${this.conditional(
                            "second_pump_demand" in this.values && this.values["second_pump_demand"] == 1,
                            this.conf_bit_5.createImage("peltec/demand_p.png", 19, 30, 12, null, 3, "second_pump_demand"),
                            this.conf_bit_5.createImage("transparent.png", 19, 30, 12, null, 3, "second_pump_demand"))}
                    `))}

            <!-- State Button -->
            ${this.createText(this.values["boiler_state"], 32, "color: #ffffff; text-align: center;", 900, 450, 120, null, 2, null, "boiler_state")}
            ${this.conditional(
                this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/playradi.gif", 942, 480, 40, null, 3, "boiler_state")
            )}
            ${this.conditional(
                this.values["boiler_state"] === "OFF",
                this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('" + this.images_folder + "img/start_stop.png?v=0.0.16'); background-position: 0px 0px;",
                945, 480, 36, 36, 2, -1))}
            ${this.conditional(
                this.values["command_active"] == 0 && this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/stopradi.gif", 942, 480, 36, "auto", "boiler_state"))}
        `);
    }
}
