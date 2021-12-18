
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
        var str = "style=\"position: absolute;";
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
        str += "\"";
        return str;
    }

    createImage(image, left, top, width, height, orig_width = this.orig_width, orig_height = this.orig_height)
    {
        var str = "<img src=\"/local/lovelace-peltec-card/images/" + image + "\" ";
        str += this.createStyle("z-index: 1;", left, top, width, height, orig_width, orig_height);
        str += " />\n";
        return str;
    }

    createText(text, font_size, style, left, top, width = null, height = null, orig_width = this.orig_width, orig_height = this.orig_height)
    {
        var str = "<span ";
        var extra = "font-size: " + (font_size * this.factor).toString() + "px;";
        extra += " font-family: 'Roboto', 'Helvetica'; text-align: left; vertical-align: top; font-weight: bold; z-index:2;";
        str += this.createStyle(extra + style, left, top, width, height, orig_width, orig_height);
        str += ">" + text + "</span>\n";
        return str;
    }

    createContent(hass, config)
    {
        var lineHeight = (20 * this.factor).toString();
        var str = "<div class=\"card-content\" style=\"position: relative; top: 0; left: 0; padding: 0px; width: auto; height: auto; line-height: " + lineHeight + "px;\">\n";

        str += "<img src=\"/local/lovelace-peltec-card/images/background.png\" style=\"width: 100%; top: 0; left: 0; position: relative;\" />\n";

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

        if (fire_sensor_value < 1000) {
            // cc.params['B_FotV'].v < 1000
            str += this.createImage("vatra.gif", 160, 305, 80, null);
        }

        if (fire_sensor_value > 0) {
            // cc.params['B_FotV'].v >= 0
            str += this.createText("&gt;1M", 20, "color: #000000;", 120, 360);
        }

        if (fan_value == 0) {
            // cc.params['B_fan'].v == 0
            str += this.createImage("ventilatorStoji-unit.png", 35, 210, 100, null);
        }

        if (fan_value != 0) {
            // cc.params['B_fan'].v != 0
            str += this.createImage("ventilator-unit.gif", 35, 210, 100, null);
        }

        // Ventilator speed?
        str += this.createText(fan_value, 20, "color: #000000;", 140, 255);

        if (boiler_pump_value == 0) {
            // cc.params['B_P1'].v == 0
            str += this.createImage("pumpaStojiLijevo.png", 345, 212, 66, null);
        }

        if (boiler_pump_value == 1) {
            // cc.params['B_P1'].v &amp;&amp; (cc.params['B_P1'].v == 1)
            str += this.createImage("pumpaokrece.gif", 345, 212, 66, null);
        }

        if (boiler_pump_demand_value == 1) {
            // cc.params['B_zahP1'].v == 1
            str += this.createImage("demand_p.png", 345, 240, 12, null);
        }

        if (electric_heater_value == 0) {
            // cc.params['B_gri'].v == 0
            str += this.createImage("heater.png", 70, 435, 56, null);
        }

        if (electric_heater_value == 1) {
            // cc.params['B_gri'].v &amp;&amp; (cc.params['B_gri'].v == 1)
            str += this.createImage("grijac.png", 70, 435, 56, null);
        }

        str += this.createText(boiler_temperature_value + " °C", 42, "color: #FFFFFF;",  100, 157);

        str += this.createImage("senzor_b_1.png", 90, 40, 50, null);

        str += this.createText(flue_gas_value + " °C", 26, "color: #FFFFFF;",  155, 44);

        str += this.createImage("senzor_d.png", 425, 240, 30, null);

        str += this.createText(mixer_temperature_value + " °C", 26, "color: #FFFFFF;", 460, 262, 80);

        if (lambda_sensor_value > 0.1) {
            // (cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v > 0.1 ))
            str += this.createImage("senzor_b_1.png", 90, 90, 50, null);
            // cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v >= 0.1)
            str += this.createText("-% O<sub>2</sub>", 20, "color: #e0e3ff;", 155, 90);
        }

        str += this.createText(mixing_valve_value + "%", 22, "color: #ffffff;", 340, 139, 80);

        str += this.createImage("vanjska.png", 600, 20, 20, "auto");
        str += this.createText(((outdoor_temperature === false) ? "--" : outdoor_temperature) + "°C", 28, "color: #ffffff;", 530, 30);

        if (tank_level_value == "Full") {
            // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 2)
            str += this.createImage("spremnikpun-n.png", 469, 330, 19, "auto");
        }
        if (tank_level_value == "Reserve") {
            // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 1)
            str += this.createImage("rezerva-n.png", 469, 330, 19, "auto");
        }
        if (tank_level_value == "Empty") {
            // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 0)
            str += this.createImage("nemapeleta-n.png", 469, 330, 19, "auto");
        }

        /*
        // cc.params['B_addConf'].v | hexBitIsSet: 3
        str += "<div " + this.createStyle("position:absolute; z-index: 2;", 375, 300, 80, 30) + "\">";
        str += this.createImage("fuel_percentage.png", 0, 0,
        this.computeX(99, 80), this.computeY(28, 30));
        str += this.createText("---", 20, "color: #000000; z-index: 6;",
        this.computeX(30, 80), this.computeY(3, 30), null, null);
        str += "</div>\n";

        // (cc.params['B_zlj'].v == 1)
        str += "<div " + this.createStyle("position:absolute; z-index: 2;", 800, 10, 80, 90) + "\">";
        str += this.createImage("slavina.png", 0, 0, this.computeX(80, 80), "auto");
        str += "</div>\n";

        // (cc.params['B_zlj'].v == 0 || cc.params['B_zlj'].v == 2
        str += "<div " + this.createStyle("position:absolute; z-index: 2;", 800, 10, 80, 90) + "\">";
        str += this.createImage("radijatorSlavina.png", 0, 0, this.computeX(80, 80), "auto");
        str += "</div>\n";
        */

        if (configuration_value === "4. BUF") {
            // cc.params['B_KONF'].v == 3
            str += "<div " + this.createStyle("position:absolute; z-index: 1;", 520, 5, 370, 570) + "\">";
            str += this.createText(buffer_tank_temparature_up_value + " °C", 32, "color: #0000ff;",
            this.computeX(100, 370), this.computeY(290, 570), null, null);
            str += this.createText(buffer_tank_temparature_down_value + " °C", 32, "color: #0000ff;",
            this.computeX(100, 370), this.computeY(485, 570), null, null);
            str += this.createImage("akunormalno.png",
            this.computeX(60, 370), this.computeY(232, 570), this.computeX(165, 370), "auto");
            str += "</div>\n";
        }

        /*
        // (cc.params['B_addConf'].v &amp;&amp; (cc.params['B_korNum'].v != 255))
        str += "<div " + this.createStyle("position:absolute; z-index: 2;", 240, 85, 100, 50) + "\">";
        str += this.createImage("csk_touch_indicator.png",
        this.computeX(15, 100), this.computeY(0, 50), this.computeX(68, 100), null);
        str += this.createText("-", 24, "color: #ffffff; text-align: right; z-index: 3;",
        this.computeX(43, 100), this.computeY(13, 50));
        str += "</div>\n";
        */

        if (peltec_state !== "OFF") {
            // cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
            str += this.createImage("start.gif", 901, 440, 118, null);
        }

        if (active_command == 1 && peltec_state == "S7-3") {
            // cc.params['B_CMD'].v &amp;&amp; cc.params['B_CMD'].v == 1 &amp;&amp; cc.permissions === '2' &amp;&amp;
            // cc.params['B_STATE'].v & amp;& amp; (cc.params['B_STATE'].v == 'S7-3')
            str += this.createImage("pauza.png", 942, 390, 40, null);
        }

        if (active_command == 1 && peltec_state !== "OFF" && peltec_state !== "S7-3") {
            // cc.params['B_CMD'].v == 1 &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v !== 'OFF'
            // & amp;& amp; cc.params['B_STATE'].v !== 'S7-3'
            str += this.createImage("playradi.gif", 942, 390, 40, null);
        }

        str += this.createText(peltec_state, 32, "color: #ffffff; text-align: center; z-index: 3;", 900, 360, 120);

        if (peltec_state == "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v===undefined || (cc.params['B_STATE'].v==='OFF')
            // TURN ON BUTTON
            // TIHOTODO
        }

        if (peltec_state === "OFF") {
        // cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v === 'OFF')
            str += this.createText("", 32,
                "display:block; background-repeat: no-repeat; background-image: url('/local/lovelace-peltec-card/images/start_stop.png'); background-position: 0px 0px;",
                945, 390, 36, 36);
        }

        if (active_command == 0 && peltec_state !== "OFF") {
            //cc.params['B_CMD'].v == 0 &amp;&amp; cc.params['B_STATE'].v !== 'OFF'
            str += this.createImage("stopradi.gif", 942, 390, 36, "auto");
        }

        if (peltec_state !== "OFF") {
            // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
            // TURN OFF BUTTON
            // TIHOTODO
        }

        str += "</div>\n";
        return str;
    }
}
