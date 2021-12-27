import {
    html,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

export default class PelTecDisplay {

    constructor() {
        this.orig_width = 1024;
        this.orig_height = 580;
        this.factor = 468 / this.orig_width;
    }

    computeX(left, orig_width) {
        return (100.0 * left / orig_width).toString() + "%;";
    }

    computeY(top, orig_height) {
        return (100.0 * top / orig_height).toString() + "%;";
    }

    createStyle(styleEnd, left, top, width, height, orig_width = this.orig_width, orig_height = this.orig_height) {
        var str = "position: absolute;";
        if (left != null) {
            if (typeof left === 'string' || left instanceof String) {
                str += " left: " + left + ";";
            } else {
                str += " left: " + this.computeX(left, orig_width);
            }
        }
        if (top != null) {
        if (typeof top === 'string' || top instanceof String) {
            str += " top: " + top + ";";
        } else {
            str += " top: " + this.computeY(top, orig_height);
        }
        }
        if (width != null) {
        if (width === "auto") {
            str += " width: auto;";
        } else if (typeof width === 'string' || width instanceof String) {
            str += " width: " + width + ";";
        } else {
            str += " width: " + this.computeX(width, orig_width);
        }
        }
        if (height != null) {
        if (height === "auto") {
            str += " height: auto;";
        } else if (typeof height === 'string' || height instanceof String) {
            str += " height: " + height + ";";
        } else {
            str += " height: " + this.computeY(height, orig_height);
        }
        }
        str += styleEnd;
        return str;
    }

    createImage(image, left, top, width, height, orig_width = this.orig_width, orig_height = this.orig_height)
    {
        var style = this.createStyle("z-index: 1;", left, top, width, height, orig_width, orig_height);
        image = "/local/lovelace-centrometal-boiler-card/images/" + image;
        return html`<img src="${image}" style="${style}" />`;
    }

    createText(text, font_size, style, left, top, width = null, height = null, orig_width = this.orig_width, orig_height = this.orig_height)
    {
        // https://github.com/STRML/textFit ?
        style = this.createStyle(style, left, top, width, height, orig_width, orig_height);
        style += "font-size: " + (font_size * this.factor).toString() + "px;";
        style += " font-family: 'Roboto', 'Helvetica'; text-align: center; vertical-align: top; font-weight: bold; z-index:2; margin: auto;";
        return html`<span style="${style}">${text}</span>`;
    }

    conditionalHtml(cond, expr) {
        return cond ? expr : html``;
    }

    createContent(hass, config)
    {
        const peltec_state = hass.states[config.peltec_state].state ?? 0;
        const active_command = hass.states[config.peltec_active_command].state ?? 0;
        const fire_sensor_value = hass.states[config.peltec_fire_sensor].state ?? 0;
        const fan_value = hass.states[config.peltec_fan].state ?? 0;
        const boiler_pump_value = hass.states[config.peltec_boiler_pump].state ?? 0;
        const boiler_pump_demand_value = hass.states[config.peltec_boiler_pump_demand].state ?? 0;
        const electric_heater_value = hass.states[config.peltec_electric_heater].state ?? 0;
        const boiler_temperature_value = hass.states[config.peltec_boiler_temperature].state ?? 0;
        const flue_gas_value = hass.states[config.peltec_flue_gas].state ?? 0;
        const mixer_temperature_value = hass.states[config.peltec_mixer_temperature].state ?? 0;
        const lambda_sensor_value = hass.states[config.peltec_lambda_sensor].state ?? 0;
        const mixing_valve_value = hass.states[config.peltec_mixing_valve].state ?? 0;
        const outdoor_temperature = ("peltec_outdoor_temperature" in hass.states) ? (hass.states[config.peltec_outdoor_temperature].state ?? 0) : false;
        const tank_level_value = hass.states[config.peltec_tank_level].state ?? 0; // "Full"
        const configuration_value = hass.states[config.peltec_configuration].state ?? 0; // "4. BUF"
        const buffer_tank_temparature_up_value = hass.states[config.peltec_buffer_tank_temparature_up].state ?? 0;
        const buffer_tank_temparature_down_value = hass.states[config.peltec_buffer_tank_temparature_down].state ?? 0;

        if (peltec_state == "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v===undefined || (cc.params['B_STATE'].v==='OFF')
            // TURN ON BUTTON
            // TIHOTODO
        }
        if (peltec_state !== "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
            // TURN OFF BUTTON
            // TIHOTODO
        }

        return html`
            <div class="card-content" style="position: relative; top: 0; left: 0; padding: 0px; width: auto; height: auto; line-height: ${20 * this.factor}px;">
            <img src="/local/lovelace-centrometal-boiler-card/images/peltec/background.png" style="width: 100%; top: 0; left: 0; position: relative;" />
            ${this.conditionalHtml(fire_sensor_value < 1000, this.createImage("peltec/vatra.gif", 160, 305, 80, null))} <!-- cc.params['B_FotV'].v < 1000 -->
            ${this.conditionalHtml(fire_sensor_value > 1000, this.createText(">1M", 24, "color: #000000;", 120, 360))} <!-- cc.params['B_FotV'].v >= 0 -->
            ${this.conditionalHtml(fan_value == 0, this.createImage("unit/ventilatorStoji-unit.png", 35, 210, 100, null))} <!-- cc.params['B_fan'].v == 0 -->
            ${this.conditionalHtml(fan_value != 0, this.createImage("unit/ventilator-unit.gif", 35, 210, 100, null))} <!-- cc.params['B_fan'].v != 0 -->
            ${this.createText(fan_value, 24, "color: #000000;", 140, 255)}
            ${this.conditionalHtml(boiler_pump_value == 0, this.createImage("peltec/pumpaStojiLijevo.png", 345, 212, 66, null))} <!-- cc.params['B_P1'].v == 0 -->
            ${this.conditionalHtml(boiler_pump_value == 1, this.createImage("peltec/pumpaokrece.gif", 345, 212, 66, null))} <!-- cc.params['B_P1'].v &amp;&amp; (cc.params['B_P1'].v == 1) -->
            ${this.conditionalHtml(boiler_pump_demand_value == 1, this.createImage("peltec/demand_p.png", 345, 240, 12, null))} <!-- cc.params['B_zahP1'].v == 1 -->
            ${this.conditionalHtml(electric_heater_value == 0, this.createImage("peltec/heater.png", 70, 435, 56, null))} <!-- cc.params['B_gri'].v == 0 -->
            ${this.conditionalHtml(electric_heater_value == 1, this.createImage("peltec/grijac.png", 70, 435, 56, null))} <!-- cc.params['B_gri'].v &amp;&amp; (cc.params['B_gri'].v == 1) -->
            ${this.createText(boiler_temperature_value + " °C", 42, "color: #FFFFFF;",  100, 157)}
            ${this.createImage("peltec/senzor_b_1.png", 90, 40, 50, null)}
            ${this.createText(flue_gas_value + " °C", 26, "color: #FFFFFF;",  155, 44)}
            ${this.createImage("peltec/senzor_d.png", 425, 240, 30, null)}
            ${this.createText(mixer_temperature_value + " °C", 26, "color: #FFFFFF;", 460, 262, 80)}
            ${this.conditionalHtml(lambda_sensor_value > 0.1, this.createImage("peltec/senzor_b_1.png", 90, 90, 50, null))} <!-- (cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v > 0.1 )) -->
            ${this.conditionalHtml(lambda_sensor_value > 0.1, this.createText(html`-% O<sub>2</sub>`, 20, "color: #e0e3ff;", 155, 90))} <!-- cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v >= 0.1) -->
            ${this.createText(mixing_valve_value + "%", 22, "color: #ffffff;", 340, 139, 80)}
            ${this.createImage("cmpelet/vanjska.png", 600, 20, 20, "auto")}
            ${this.createText(((outdoor_temperature === false) ? "--" : outdoor_temperature) + "°C", 28, "color: #ffffff;", 530, 30)}
            ${this.conditionalHtml(tank_level_value == "Full", this.createImage("peltec/spremnikpun-n.png", 469, 330, 19, "auto"))} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 2) -->
            ${this.conditionalHtml(tank_level_value == "Reserve", this.createImage("peltec/rezerva-n.png", 469, 330, 19, "auto"))} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 1) -->
            ${this.conditionalHtml(tank_level_value == "Empty", this.createImage("peltec/nemapeleta-n.png", 469, 330, 19, "auto"))} <!-- cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 0) -->
            ${this.conditionalHtml(configuration_value === "4. BUF",
                html`<div style="${this.createStyle("z-index: 1;", 520, 5, 370, 570)}">
                ${this.createText(buffer_tank_temparature_up_value + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(290, 570), null, null)}
                ${this.createText(buffer_tank_temparature_down_value + " °C", 32, "color: #0000ff;", this.computeX(100, 370), this.computeY(485, 570), null, null)}
                ${this.createImage("peltec/akunormalno.png", this.computeX(60, 370), this.computeY(232, 570), this.computeX(165, 370), "auto")}
                </div>`)} <!-- cc.params['B_KONF'].v == 3 -->
            ${this.conditionalHtml(peltec_state !== "OFF", this.createImage("peltec/start.gif", 901, 440, 118, null))} <!-- cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF') -->
            ${this.conditionalHtml(active_command == 1 && peltec_state == "S7-3", this.createImage("peltec/pauza.png", 942, 390, 40, null))} <!-- cc.params['B_CMD'].v == 1 &amp;&amp; (cc.params['B_STATE'].v == 'S7-3') -->
            ${this.conditionalHtml(active_command == 1 && peltec_state !== "OFF" && peltec_state !== "S7-3", this.createImage("peltec/playradi.gif", 942, 390, 40, null))} <!-- cc.params['B_CMD'].v == 1 && cc.params['B_STATE'].v !== 'OFF' && cc.params['B_STATE'].v !== 'S7-3' -->
            ${this.createText(peltec_state, 32, "color: #ffffff; text-align: center; z-index: 3;", 900, 360, 120)}
            ${this.conditionalHtml(peltec_state === "OFF", this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('/local/lovelace-centrometal-boiler-card/images/peltec/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36))} <!-- cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v === 'OFF') -->
            ${this.conditionalHtml(active_command == 0 && peltec_state !== "OFF", this.createImage("peltec/stopradi.gif", 942, 390, 36, "auto"))} <!-- cc.params['B_CMD'].v == 0 &amp;&amp; cc.params['B_STATE'].v !== 'OFF' -->
            </div>`;
    }
}
