import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { DisplaySubArea } from "./DisplaySubArea.js"
import { DisplayWithPowerButton } from "./DisplayWithPowerButton.js"

export class CmPeletDisplay extends DisplayWithPowerButton {

    constructor(config) {
        super(config, 0, 0, 1024, 562)
    }

    configureDisplay(hass) {
        try {
            this.configureParameter(hass, "sensor.cm_pelet", "boiler_state")
            this.configureParameter(hass, "sensor.cm_pelet", "command_active")
            this.configureParameter(hass, "sensor.cm_pelet", "firmware_version")
            this.configureParameter(hass, "sensor.cm_pelet", "b_smd") // ??
            this.configureParameter(hass, "sensor.cm_pelet", "b_cp") // ??
            this.configureParameter(hass, "sensor.cm_pelet", "boiler_temperature")
            this.configureParameter(hass, "sensor.cm_pelet", "fire_sensor")
            this.configureParameter(hass, "sensor.cm_pelet", "heater_fan_state")

            // Optional
            this.configureParameter(hass, "sensor.cm_pelet", "outdoor_temperature", "optional")

            // Service
            this.configureParameter(hass, "switch.cm_pelet", "boiler_switch")

        } catch (error) {
            return error;
        }

        // define Sub areas of display
        this.fireArea = new DisplaySubArea(this, 130, 350, 190, 90)
        this.fanArea = new DisplaySubArea(this, 220, 390, 140, 130)

        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        if (this.values["boiler_state"] == "-") {
            return this.createCard("cmpelet/peletsetdisplay-clean.png",
                html`${this.createText("Boiler unavailable", 36, "color: #ffffff;", 360, 50)}`)
        }

        return this.createCard("cmpelet/peletsetdisplay-clean.png", html`

            <!-- boiler image on background -->
            ${this.conditional(
                this.values["firmware_version"] > 'v1.25' && this.values["b_cp"] == 1,
                this.createImage("cmpelet/boiler_centroplus.png", -1, 9, 347, null, 0)
            )}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 890, 125, 20, "auto", 3)}
            ${this.createText(
                (('outdoor_temperature' in this.values && this.values["outdoor_temperature"] > -45 && this.values["outdoor_temperature"] < 145) ? this.values["outdoor_temperature"] : "--")
                    + "°C", 28, "color: #ffffff; text-align: right; ", 820, 140)}

            <!-- Boiler temperature -->
            ${this.createText(this.values["boiler_temperature"] + "°C", 42, "color: #FFFFFF;", 47, 33, null, null, 4)}

            <!-- Boiler power states -->
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25'),
                this.createText(this.values["boiler_state"], 32, "color: #ffffff; text-align: center", 900, 360, 120, null, 3))}
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25') && this.values["boiler_state"] === "OFF",
                this.createText("", 32,
                    "display:block; background-repeat: no-repeat; background-image: url('" + this.images_folder + "peltec/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36, 2, -1))}
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25') &&
                this.values["command_active"] == 0 && this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/stopradi.gif", 942, 390, 36, "auto"))}
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25') && this.values["boiler_state"] !== "OFF",
                this.createImage("peltec/start.gif", 901, 440, 118, null))}
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25') && this.values["command_active"] == 1 && this.values["boiler_state"] == "S7-3",
                this.createImage("peltec/pauza.png", 942, 390, 40, null))}
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25') && this.values["command_active"] == 1 && this.values["boiler_state"] !== "OFF" && this.values["boiler_state"] !== "S7-3",
                this.createImage("peltec/playradi.gif", 942, 390, 40, null))}

            <!-- Fire -->
            ${this.conditional(
                (this.values["firmware_version"] > 'v1.25' && this.values['b_cp'] == 1),
                html`${this.fireArea.createSubArea(2, "",
                    html`
                        ${this.conditional(
                            this.values["fire_sensor"] >= 1000,
                            this.fireArea.createText(">1M", 20, "color: #ffffff;", 25, 15))}
                        ${this.conditional(
                            this.values["fire_sensor"] < 1000,
                            this.fireArea.createText(this.values["fire_sensor"] + "k", 20, "color: #ffffff;", 25, 15, null, null, 3, -1))}
            `)}`)}

            <!-- Fan -->
            ${this.conditional(
                (this.values['b_smd'] == 0 || this.values["firmware_version"] < 'v1.25'),
                html`${this.fanArea.createSubArea(2, "",
                    html`
                        ${this.conditional(
                            this.values["heater_fan_state"] == 0,
                            this.fanArea.createImage("cmpelet/ventilatorStoji.png", 22, 48, 44, null))}
                        ${this.conditional(
                            this.values["heater_fan_state"] != 0,
                            this.fanArea.createImage("cmpelet/ventilator-pelet.gif", 22, 48, 44, null))}
                        ${this.fanArea.createText(this.values["heater_fan_state"], 25, "color: #ffffff; text-align: center;", 20, 13, null, null, 3, -1)}
            `)}`)}

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
