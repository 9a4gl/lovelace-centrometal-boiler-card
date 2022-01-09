import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplaySubArea } from "./DisplaySubArea.js"
import { DisplayWithPowerButton } from "./DisplayWithPowerButton.js"

export class PelTecDisplay extends DisplayWithPowerButton {

    configureDisplay(hass) {
        try {
            this.configureParameter(hass, "sensor.peltec", "boiler_state")
            this.configureParameter(hass, "sensor.peltec", "command_active")
            this.configureParameter(hass, "sensor.peltec", "fire_sensor")
            this.configureParameter(hass, "sensor.peltec", "fan")
            this.configureParameter(hass, "sensor.peltec", "boiler_pump")
            this.configureParameter(hass, "sensor.peltec", "boiler_pump_demand")
            this.configureParameter(hass, "sensor.peltec", "electric_heater")
            this.configureParameter(hass, "sensor.peltec", "boiler_temperature")
            this.configureParameter(hass, "sensor.peltec", "flue_gas")
            this.configureParameter(hass, "sensor.peltec", "mixer_temperature")
            this.configureParameter(hass, "sensor.peltec", "mixing_valve")
            this.configureParameter(hass, "sensor.peltec", "configuration")
            // optional
            this.configureParameter(hass, "sensor.peltec", "lambda_sensor", "optional")
            this.configureParameter(hass, "sensor.peltec", "outdoor_temperature", "optional")
            this.configureParameter(hass, "sensor.peltec", "tank_level", "optional")
            this.configureParameter(hass, "sensor.peltec", "buffer_tank_temparature_up", "optional")
            this.configureParameter(hass, "sensor.peltec", "buffer_tank_temparature_down", "optional")
            this.configureParameter(hass, "sensor.peltec", "accessories", "optional")
            this.configureParameter(hass, "sensor.peltec", "accessories_value", "optional")
            this.configureParameter(hass, "sensor.peltec", "operation_mode", "optional")
            // Service
            this.configureParameter(hass, "switch.peltec", "boiler_switch")
        } catch (error) {
            return error;
        }

        // define Sub areas of display
        this.bufferArea = new DisplaySubArea(this, 520, 5, 370, 570)
        this.cskTouchArea = new DisplaySubArea(this, 240, 85, 100, 50)

        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        return this.createCard("peltec/background.png", html`
            <!-- Fire -->
            ${this.conditional(
                this.values["fire_sensor"] >= 1000,
                this.createText(">1M", 20, "color: #000000;", 120, 360))}
            ${this.conditional(
                this.values["fire_sensor"] < 1000,
                html`${this.createText(this.values["fire_sensor"] + "k", 20, "color: #000000;", 120, 360)}
                     ${this.createImage("peltec/vatra.gif", 160, 305, 80, null)}`)}

            <!-- Fan -->
            ${this.conditional(this.values["fan"] == 0, this.createImage("unit/ventilatorStoji-unit.png", 35, 210, 100, null))}
            ${this.conditional(this.values["fan"] != 0, this.createImage("unit/ventilator-unit.gif", 35, 210, 100, null))}
            ${this.createText(
                (("fan" in this.values && this.values["fan"] > 0 && this.values["fan"] < 5000) ? this.values["fan"] + " rpm" : "")
                , 20, "color: #000000;", 140, 255)}
            ${this.createText(
                (("fan" in this.values && this.values["fan"] == 5000) ? "MAX" : "")
                , 20, "color: #000000;", 140, 255)}

            <!- Pump -->
            ${this.conditional(this.values["boiler_pump"] == 0, this.createImage("peltec/pumpaStojiLijevo.png", 345, 212, 66, null))}
            ${this.conditional(this.values["boiler_pump"] == 1, this.createImage("peltec/pumpaokrece.gif", 345, 212, 66, null))}
            ${this.conditional(this.values["boiler_pump_demand"] == 1, this.createImage("peltec/demand_p.png", 345, 240, 12, null))}

            <!-- Heater -->
            ${this.conditional(
                "electric_heater" in this.values && this.values["electric_heater"] == 0,
                this.createImage("peltec/heater.png", 70, 435, 56, null))}
            ${this.conditional(
                "electric_heater" in this.values && this.values["electric_heater"] == 1,
                this.createImage("peltec/grijac.png", 70, 435, 56, null))}

            <!-- Boiler temperature -->
            ${this.createText(this.values["boiler_temperature"] + " °C", 42, "color: #FFFFFF;", 100, 157)}
            ${this.createImage("peltec/senzor_b_1.png", 90, 40, 50, null)}

            <!-- Flue gas temperature -->
            ${this.createText(this.values["flue_gas"] + " °C", 26, "color: #FFFFFF;",  155, 44)}
            ${this.createImage("peltec/senzor_d.png", 425, 240, 30, null)}

            <!-- Oxygen (lambda) sensor -->
            ${this.conditional(
                "lambda_sensor" in this.values && this.values["lambda_sensor"] > 0.1,
                html`${this.createImage("peltec/senzor_b_1.png", 90, 90, 50, null)}
                     ${this.createText(html`
                        ${this.values["lambda_sensor"] < 25.4 ? this.values["lambda_sensor"] : "-"}% O<sub>2</sub>`, 20, "color: #e0e3ff;", 155, 90 + 2)}`)}

            <!-- Mixer temperature -->
            ${this.createText(this.values["mixer_temperature"] + " °C", 26, "color: #FFFFFF;", 460, 262, 80 + 20)}

            <!-- Mixing valve opening -->
            ${this.createText(this.values["mixing_valve"] + "%", 22, "color: #ffffff;", 340, 139, 80)}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 600, 20, 20, "auto")}
            ${this.createText(
                (('outdoor_temperature' in this.values && this.values["outdoor_temperature"] > -45 && this.values["outdoor_temperature"] < 145) ? this.values["outdoor_temperature"] : "--")
                    + "°C", 28, "color: #ffffff;", 530, 30)}

            <!-- Pellet tank level -->
            ${this.conditional(
                'tank_level' in this.values,
                html`${this.conditional(this.values["tank_level"] == "Full", this.createImage("peltec/spremnikpun-n.png", 469, 330, 19, "auto"))}
                     ${this.conditional(this.values["tank_level"] == "Reserve", this.createImage("peltec/rezerva-n.png", 469, 330, 19, "auto"))}
                     ${this.conditional(this.values["tank_level"] == "Empty", this.createImage("peltec/nemapeleta-n.png", 469, 330, 19, "auto"))}`)}

            <!-- Tap/radiator mode -->
            ${this.conditional(
                "b_zlj" in this.values,
                html`${this.conditional(this.values["b_zlj"] == 0, this.createImage("cmpelet/radijatorSlavina.png", 800, 10, 80, "auto", 2))}
                     ${this.conditional(this.values["b_zlj"] == 1, this.createImage("cmpelet/slavina.png", 800, 10, 80, "auto", 2))}
                     ${this.conditional(this.values["b_zlj"] == 2, this.createImage("cmpelet/radijatorSlavina.png", 800, 10, 80, "auto", 2))}`)}

            <!-- Buffer -->
            ${this.conditional(
                this.values["configuration"] === "4. BUF" &&
                "buffer_tank_temparature_up" in this.values && "buffer_tank_temparature_down" in this.values,
                html`${this.bufferArea.createSubArea(2, "",
                    html`${this.bufferArea.createText(this.values["buffer_tank_temparature_up"] + " °C", 32, "color: #0000ff;", 100-30, 290, 145, null)}
                            ${this.bufferArea.createText(this.values["buffer_tank_temparature_down"] + " °C", 32, "color: #0000ff;", 100-30, 485, 145, null)}
                            ${this.bufferArea.createImage("peltec/akunormalno.png", 60, 232, 165, "auto")}`)}`)}

            <!-- Button -->
            ${this.conditional(
                this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/start.gif", 901, 440, 118, null))}
            ${this.conditional(
                this.values["command_active"] == 1 && this.values["boiler_state"] == "S7-3",
                this.createImage("peltec/pauza.png", 942, 390, 40, null))}
            ${this.conditional(
                this.values["command_active"] == 1 && this.values["boiler_state"] !== "OFF" && this.values["boiler_state"] !== "S7-3",
                this.createImage("peltec/playradi.gif", 942, 390, 40, null))}
            ${this.createText(this.values["boiler_state"], 32, "color: #ffffff;", 900, 360, 120, null, 3)}
            ${this.conditional(
                this.values["boiler_state"] === "OFF",
                this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('" + this.images_folder + "peltec/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36, 2, -1))}
            ${this.conditional(
                this.values["command_active"] == 0 && this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/stopradi.gif", 942, 390, 36, "auto"))}

            <!-- CSK indicator -->
            ${this.conditional(
                "b_addconf" in this.values && "b_kornum" in this.values && this.values["b_kornum"] != 255,
                html`${this.cskTouchArea.createSubArea(2, "",
                    html`${this.cskTouchArea.createImage("peltec/csk_touch_indicator.png", 15, 0, 65, "auto", 2)}
                         ${this.cskTouchArea.createText(this.values["b_kornum"], 24, "color: #ffffff; text-align: right;", 42, 13, null, null, 3)}
                    `)}`)}

            <!-- Boiler power button -->
            ${this.createPowerButton(function (root) { this.turnPelTecOn(root); }, function (root) { this.turnPelTecOff(root); })}
        `);
    }

    turnPelTecOn(root) {
        root.hass.callService("switch", "turn_on", {entity_id: root.display.parameters["boiler_switch"]});
    }

    turnPelTecOff(root) {
        root.hass.callService("switch", "turn_off", {entity_id: root.display.parameters["boiler_switch"]});
    }

}