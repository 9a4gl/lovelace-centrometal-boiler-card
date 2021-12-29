import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import { Display } from "./display.js"

export class PelTecDisplay extends Display {

    configureDisplay(hass) {
        try {
            this.configureParameter(hass, "boiler_state")
            this.configureParameter(hass, "command_active")
            this.configureParameter(hass, "fire_sensor")
            this.configureParameter(hass, "fan")
            this.configureParameter(hass, "boiler_pump")
            this.configureParameter(hass, "boiler_pump_demand")
            this.configureParameter(hass, "electric_heater")
            this.configureParameter(hass, "boiler_temperature")
            this.configureParameter(hass, "flue_gas")
            this.configureParameter(hass, "mixer_temperature")
            this.configureParameter(hass, "mixing_valve")
            // optional
            this.configureParameter(hass, "lambda_sensor", "optional")
            this.configureParameter(hass, "outdoor_temperature", "optional")
            this.configureParameter(hass, "tank_level", "optional")
            this.configureParameter(hass, "buffer_tank_temparature_up", "optional")
            this.configureParameter(hass, "buffer_tank_temparature_down", "optional")
        } catch (error) {
            return error;
        }
        return this;
    }

    createContent(hass)
    {
        this.updateParameterValues(hass);

        if (this.values["boiler_state"] == "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v===undefined || (cc.params['B_STATE'].v==='OFF')
            // TURN ON BUTTON
            // TIHOTODO
        }
        if (this.values["boiler_state"] !== "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
            // TURN OFF BUTTON
            // TIHOTODO
        }

        return html`
            <div class="card-content" style="position: relative; top: 0; left: 0; padding: 0px; width: auto; height: auto; line-height: ${20 * this.factor}px;">
            <img src="/local/lovelace-centrometal-boiler-card/images/peltec/background.png" style="width: 100%; top: 0; left: 0; position: relative;" />
            ${this.conditionalHtml(this.values["fire_sensor"] < 1000, this.createImage("peltec/vatra.gif", 160, 305, 80, null))} <!-- cc.params['B_FotV'].v < 1000 -->
            ${this.conditionalHtml(this.values["fire_sensor"] > 1000, this.createText(">1M", 24, "color: #000000;", 120, 360))} <!-- cc.params['B_FotV'].v >= 0 -->
            ${this.conditionalHtml(this.values["fan"] == 0, this.createImage("unit/ventilatorStoji-unit.png", 35, 210, 100, null))} <!-- cc.params['B_fan'].v == 0 -->
            ${this.conditionalHtml(this.values["fan"] != 0, this.createImage("unit/ventilator-unit.gif", 35, 210, 100, null))} <!-- cc.params['B_fan'].v != 0 -->
            ${this.conditionalHtml(this.values["boiler_pump"] == 0, this.createImage("peltec/pumpaStojiLijevo.png", 345, 212, 66, null))} <!-- cc.params['B_P1'].v == 0 -->
            ${this.conditionalHtml(this.values["boiler_pump"] == 1, this.createImage("peltec/pumpaokrece.gif", 345, 212, 66, null))} <!-- cc.params['B_P1'].v &amp;&amp; (cc.params['B_P1'].v == 1) -->
            ${this.conditionalHtml(this.values["boiler_pump_demand"] == 1, this.createImage("peltec/demand_p.png", 345, 240, 12, null))} <!-- cc.params['B_zahP1'].v == 1 -->
            ${this.conditionalHtml(this.values["electric_heater"] == 0, this.createImage("peltec/heater.png", 70, 435, 56, null))} <!-- cc.params['B_gri'].v == 0 -->
            ${this.conditionalHtml(this.values["electric_heater"] == 1, this.createImage("peltec/grijac.png", 70, 435, 56, null))} <!-- cc.params['B_gri'].v &amp;&amp; (cc.params['B_gri'].v == 1) -->
            ${this.createText(this.values["boiler_temperature"] + " °C", 42, "color: #FFFFFF;",  100, 157)}
            ${this.createImage("peltec/senzor_b_1.png", 90, 40, 50, null)}
            ${this.createText(this.values["flue_gas"] + " °C", 26, "color: #FFFFFF;",  155, 44)}
            ${this.createImage("peltec/senzor_d.png", 425, 240, 30, null)}
            ${this.createText(this.values["mixer_temperature"] + " °C", 26, "color: #FFFFFF;", 460, 262, 80)}
            ${this.createText(this.values["mixing_valve"] + "%", 22, "color: #ffffff;", 340, 139, 80)}

            <!-- Button -->
            ${this.conditionalHtml(this.values["boiler_state"] !== "OFF", this.createImage("peltec/start.gif", 901, 440, 118, null))} <!-- cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF') -->
            ${this.conditionalHtml(this.values["command_active"] == 1 && this.values["boiler_state"] == "S7-3", this.createImage("peltec/pauza.png", 942, 390, 40, null))} <!-- cc.params['B_CMD'].v == 1 &amp;&amp; (cc.params['B_STATE'].v == 'S7-3') -->
            ${this.conditionalHtml(this.values["command_active"] == 1 && this.values["boiler_state"] !== "OFF" && this.values["boiler_state"] !== "S7-3", this.createImage("peltec/playradi.gif", 942, 390, 40, null))} <!-- cc.params['B_CMD'].v == 1 && cc.params['B_STATE'].v !== 'OFF' && cc.params['B_STATE'].v !== 'S7-3' -->
            ${this.createText(this.values["boiler_state"], 32, "color: #ffffff; text-align: center; z-index: 3;", 900, 360, 120)}
            ${this.conditionalHtml(this.values["boiler_state"] === "OFF", this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('/local/lovelace-centrometal-boiler-card/images/peltec/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36))} <!-- cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v === 'OFF') -->
            ${this.conditionalHtml(this.values["command_active"] == 0 && this.values["boiler_state"] !== "OFF", this.createImage("peltec/stopradi.gif", 942, 390, 36, "auto"))} <!-- cc.params['B_CMD'].v == 0 &amp;&amp; cc.params['B_STATE'].v !== 'OFF' -->

            <!-- Fan -->
            ${this.createText(
                (("fan" in this.values && this.values["fan"] > 0 && this.values["fan"] < 5000) ? this.values["fan"] + " rpm" : "")
                , 24, "color: #000000;", 140, 255)}
            ${this.createText(
                (("fan" in this.values && this.values["fan"] == 5000) ? "MAX" : "")
                , 24, "color: #000000;", 140, 255)}

            <!-- Oxygen (lambda) sensor -->
            ${this.conditionalHtml(
                "lambda_sensor" in this.values && this.values["lambda_sensor"] > 0.1,
                html`${this.createImage("peltec/senzor_b_1.png", 90, 90, 50, null)} <!-- (cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v > 0.1 )) -->
                     ${this.createText(html`-% O<sub>2</sub>`, 20, "color: #e0e3ff;", 155, 90) }`)} <!-- cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v >= 0.1) -->

            <!-- Outdoor temperature -->
            ${this.createImage("cmpelet/vanjska.png", 600, 20, 20, "auto")}
            ${this.createText(
                (('outdoor_temperature' in this.values && this.values["outdoor_temperature"] > -45 && this.values["outdoor_temperature"] < 145) ? this.values["outdoor_temperature"] : "--")
                 + "°C", 28, "color: #ffffff;", 530, 30)}

            <!-- Pellet tank level ->
            ${this.conditionalHtml(
                'tank_level' in this.values,
                html`${this.conditionalHtml(this.values["tank_level"] == "Full", this.createImage("peltec/spremnikpun-n.png", 469, 330, 19, "auto"))} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 2) -->
                     ${this.conditionalHtml(this.values["tank_level"] == "Reserve", this.createImage("peltec/rezerva-n.png", 469, 330, 19, "auto"))} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 1) -->
                     ${this.conditionalHtml(this.values["tank_level"] == "Empty", this.createImage("peltec/nemapeleta-n.png", 469, 330, 19, "auto"))}`)} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 0) -->

            <!-- Buffer -->
            ${this.conditionalHtml(
                "buffer_tank_temparature_up" in this.values && "buffer_tank_temparature_down" in this.values,
                html`<div style="${this.createStyle("z-index: 1;", 520, 5, 370, 570)}">
                     ${this.createText(this.values["buffer_tank_temparature_up"] + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(290, 570), null, null)}
                     ${this.createText(this.values["buffer_tank_temparature_down"] + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(485, 570), null, null)}
                     ${this.createImage("peltec/akunormalno.png", this.computeX(60, 370), this.computeY(232, 570), this.computeX(165, 370), "auto")}
                     </div>`)} <!-- cc.params['B_KONF'].v == 3 -->

            </div>`;
    }
}
