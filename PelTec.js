import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { Display } from "./Display.js"

export class PelTecDisplay extends Display {

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
            // optional
            this.configureParameter(hass, "sensor.peltec", "lambda_sensor", "optional")
            this.configureParameter(hass, "sensor.peltec", "outdoor_temperature", "optional")
            this.configureParameter(hass, "sensor.peltec", "tank_level", "optional")
            this.configureParameter(hass, "sensor.peltec", "buffer_tank_temparature_up", "optional")
            this.configureParameter(hass, "sensor.peltec", "buffer_tank_temparature_down", "optional")
            // Service
            this.configureParameter(hass, "switch.peltec", "boiler_switch")
        } catch (error) {
            return error;
        }
        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        return html`
            <div class="card-content" style="position: relative; top: 0; left: 0; padding: 0px; width: auto; height: auto; line-height: ${20 * this.factor}px;">
            <img src="/local/lovelace-centrometal-boiler-card/images/peltec/background.png" style="width: 100%; top: 0; left: 0; position: relative;" />
            ${this.createText(this.values["boiler_temperature"] + " °C", 42, "color: #FFFFFF;", 100, 157)}
            ${this.createImage("peltec/senzor_b_1.png", 90, 40, 50, null)}
            ${this.createText(this.values["flue_gas"] + " °C", 26, "color: #FFFFFF;",  155, 44)}
            ${this.createImage("peltec/senzor_d.png", 425, 240, 30, null)}
            ${this.createText(this.values["mixer_temperature"] + " °C", 26, "color: #FFFFFF;", 460, 262, 80)}
            ${this.createText(this.values["mixing_valve"] + "%", 22, "color: #ffffff;", 340, 139, 80)}

            <!-- Heater -->
            ${this.conditionalHtml(this.values["electric_heater"] == 0, this.createImage("peltec/heater.png", 70, 435, 56, null))}
            ${this.conditionalHtml(this.values["electric_heater"] == 1, this.createImage("peltec/grijac.png", 70, 435, 56, null))}

            <!-- Fan -->
            ${this.conditionalHtml(this.values["fan"] == 0, this.createImage("unit/ventilatorStoji-unit.png", 35, 210, 100, null))}
            ${this.conditionalHtml(this.values["fan"] != 0, this.createImage("unit/ventilator-unit.gif", 35, 210, 100, null))}

            <!- Pump -->
            ${this.conditionalHtml(this.values["boiler_pump"] == 0, this.createImage("peltec/pumpaStojiLijevo.png", 345, 212, 66, null))}
            ${this.conditionalHtml(this.values["boiler_pump"] == 1, this.createImage("peltec/pumpaokrece.gif", 345, 212, 66, null))}
            ${this.conditionalHtml(this.values["boiler_pump_demand"] == 1, this.createImage("peltec/demand_p.png", 345, 240, 12, null))}

            <!-- Fire -->
            ${this.conditionalHtml(this.values["fire_sensor"] > 1000, this.createText(">1M", 20, "color: #000000;", 120, 360))} <!-- cc.params['B_FotV'].v >= 0 -->
            ${this.conditionalHtml(this.values["fire_sensor"] < 1000,
                html`${this.createText(this.values["fire_sensor"] + "k", 20, "color: #000000;", 120, 360)}
                     ${this.createImage("peltec/vatra.gif", 160, 305, 80, null)}`)}

            <!-- Button -->
            ${this.conditionalHtml(this.values["boiler_state"] !== "OFF", this.createImage("peltec/start.gif", 901, 440, 118, null))}
            ${this.conditionalHtml(this.values["command_active"] == 1 && this.values["boiler_state"] == "S7-3", this.createImage("peltec/pauza.png", 942, 390, 40, null))}
            ${this.conditionalHtml(this.values["command_active"] == 1 && this.values["boiler_state"] !== "OFF" && this.values["boiler_state"] !== "S7-3", this.createImage("peltec/playradi.gif", 942, 390, 40, null))}
            ${this.createText(this.values["boiler_state"], 32, "color: #ffffff; text-align: center; z-index: 3;", 900, 360, 120)}
            ${this.conditionalHtml(this.values["boiler_state"] === "OFF", this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('/local/lovelace-centrometal-boiler-card/images/peltec/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36))}
            ${this.conditionalHtml(this.values["command_active"] == 0 && this.values["boiler_state"] !== "OFF", this.createImage("peltec/stopradi.gif", 942, 390, 36, "auto"))}

            <!-- Fan -->
            ${this.createText(
                (("fan" in this.values && this.values["fan"] > 0 && this.values["fan"] < 5000) ? this.values["fan"] + " rpm" : "")
                , 20, "color: #000000;", 140, 255)}
            ${this.createText(
                (("fan" in this.values && this.values["fan"] == 5000) ? "MAX" : "")
                , 20, "color: #000000;", 140, 255)}

            <!-- Oxygen (lambda) sensor -->
            ${this.conditionalHtml(
                "lambda_sensor" in this.values && this.values["lambda_sensor"] > 0.1,
                html`${this.createImage("peltec/senzor_b_1.png", 90, 90, 50, null)}
                     ${this.createText(html`
                        ${this.values["lambda_sensor"] < 25.4 ? this.values["lambda_sensor"] : "-"}% O<sub>2</sub>`, 20, "color: #e0e3ff;", 155, 90)}`)}

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 600, 20, 20, "auto")}
            ${this.createText(
                (('outdoor_temperature' in this.values && this.values["outdoor_temperature"] > -45 && this.values["outdoor_temperature"] < 145) ? this.values["outdoor_temperature"] : "--")
                 + "°C", 28, "color: #ffffff;", 530, 30)}

            <!-- Pellet tank level -->
            ${this.conditionalHtml(
                'tank_level' in this.values,
                html`${this.conditionalHtml(this.values["tank_level"] == "Full", this.createImage("peltec/spremnikpun-n.png", 469, 330, 19, "auto"))}
                     ${this.conditionalHtml(this.values["tank_level"] == "Reserve", this.createImage("peltec/rezerva-n.png", 469, 330, 19, "auto"))}
                     ${this.conditionalHtml(this.values["tank_level"] == "Empty", this.createImage("peltec/nemapeleta-n.png", 469, 330, 19, "auto"))}`)}

            <!-- Buffer -->
            ${this.conditionalHtml(
                "buffer_tank_temparature_up" in this.values && "buffer_tank_temparature_down" in this.values,
                html`<div style="${this.createStyle("z-index: 2;", 520, 5, 370, 570)}">
                     ${this.createText(this.values["buffer_tank_temparature_up"] + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(290, 570), null, null)}
                     ${this.createText(this.values["buffer_tank_temparature_down"] + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(485, 570), null, null)}
                     ${this.createImage("peltec/akunormalno.png", this.computeX(60, 370), this.computeY(232, 570), this.computeX(165, 370), "auto")}
                     </div>`)}

            <!-- Boiler power button -->
            <button
                style="${this.createStyle("margin: 0; border: 0px; vertical-align: top; z-index: 5; background-color: rgba(255,255,255,0.0);", 900, 320, 120, 260)}"
                @click="${this.toggleBoilerOnOff}"></button>

            <!-- Turn On / Turn Off / Cancel popup -->
            <div id="${this.card_id}_popup" style="${this.createStyle("display: none; z-index: 100; background-color: rgba(222, 222, 222, 0.75);", 20, 20, this.orig_width - 40, this.orig_height - 40)}">
                <div style="position: absolute; margin: 0; top: 50%; left: 50%; text-align: center; transform: translate(-50%, -50%); width: 100%;">
                    <button id="${this.card_id}_on_button" type="button" @click="${this.handleTurnOn}" style="display: inline; margin: auto; width:auto; padding: 10px;">TURN ON</button>
                    <button id="${this.card_id}_off_button" type="button" @click="${this.handleTurnOff}" style="display: none; margin: auto; width:auto; padding: 10px;">TURN OFF</button>
                    <p style="display: inline-block; width: 50px;"></p>
                    <button type="button" @click="${this.hidePopup}" style="display: inline; margin: auto; width:auto; padding: 10px;">CANCEL</button>
                </div>
            </div>
            </div>`;
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
        this.hass.callService("switch", "turn_on", {entity_id: this.display.parameters["boiler_switch"]});
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }

    handleTurnOff() {
        this.hass.callService("switch", "turn_off", {entity_id: this.display.parameters["boiler_switch"]});
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }

    hidePopup() {
        var popup = this.shadowRoot.getElementById(this.display.card_id + "_popup");
        popup.style.display = "none";
    }
}
