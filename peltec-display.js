
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

    createContent()
    {
        var lineHeight = (20 * this.factor).toString();
        var str = "<div style=\"position: relative; top: 0; left: 0; width: auto; height: auto; line-height: " + lineHeight + "px;\">\n";

        str += "<img src=\"/local/lovelace-peltec-card/images/background.png\" style=\"width: 100%; top: 0; left: 0; position: relative;\" />\n";

        // cc.params['B_FotV'].v < 1000
        str += this.createImage("vatra.gif", 160, 305, 80, null);

        // cc.params['B_FotV'].v >= 0
        str += this.createText("&gt;1M", 20, "color: #000000;", 120, 360);

        // cc.params['B_fan'].v == 0
        str += this.createImage("ventilatorStoji-unit.png", 35, 210, 100, null);

        // cc.params['B_fan'].v != 0
        str += this.createImage("ventilator-unit.gif", 35, 210, 100, null);

        // Ventilator speed?
        str += this.createText("MAX", 20, "color: #000000;", 140, 255);

        // cc.params['B_P1'].v == 0
        str += this.createImage("pumpaStojiLijevo.png", 345, 212, 66, null);

        // cc.params['B_P1'].v &amp;&amp; (cc.params['B_P1'].v == 1)
        str += this.createImage("pumpaokrece.gif", 345, 212, 66, null);

        // cc.params['B_zahP1'].v == 1
        str += this.createImage("demand_p.png", 345, 240, 12, null);

        // cc.params['B_gri'].v == 0
        str += this.createImage("heater.png", 70, 435, 56, null);

        // cc.params['B_gri'].v &amp;&amp; (cc.params['B_gri'].v == 1)
        str += this.createImage("grijac.png", 70, 435, 56, null);

        str += this.createText("66.2 °C", 42, "color: #FFFFFF;",  100, 157);

        str += this.createImage("senzor_b_1.png", 90, 40, 50, null);

        str += this.createText("106 °C", 26, "color: #FFFFFF;",  155, 44);

        str += this.createImage("senzor_d.png", 425, 240, 30, null);

        str += this.createText("63 °C", 26, "color: #FFFFFF;", 460, 262, 80);

        // (cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v > 0.1 ))
        str += this.createImage("senzor_b_1.png", 90, 90, 50, null);

        // cc.params['B_Oxy1'].v &amp;&amp; (cc.params['B_Oxy1'].v >= 0.1)
        str += this.createText("-% O<sub>2</sub>", 20, "color: #e0e3ff;", 155, 90);

        str += this.createText("100%", 22, "color: #ffffff;", 340, 139, 80);

        str += this.createImage("vanjska.png", 600, 20, 20, "auto");

        str += this.createText("--°C", 28, "color: #ffffff;", 530, 30);

        // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 2)
        str += this.createImage("spremnikpun-n.png", 469, 330, 19, "auto");

        // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 1)
        str += this.createImage("rezerva-n.png", 469, 330, 19, "auto");

        // cc.params[ 'B_razina' ].v &amp;&amp; (cc.params['B_razina'].v == 0)
        str += this.createImage("nemapeleta-n.png", 469, 330, 19, "auto");

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

        // cc.params['B_KONF'].v == 3
        str += "<div " + this.createStyle("position:absolute; z-index: 1;", 520, 5, 370, 570) + "\">";
        str += this.createText("69 °C", 32, "color: #0000ff;",
        this.computeX(110, 370), this.computeY(290, 570), null, null);
        str += this.createText("67 °C", 32, "color: #0000ff;",
        this.computeX(110, 370), this.computeY(485, 570), null, null);
        str += this.createImage("akunormalno.png",
        this.computeX(60, 370), this.computeY(232, 570), this.computeX(165, 370), "auto");
        str += "</div>\n";

        // (cc.params['B_addConf'].v &amp;&amp; (cc.params['B_korNum'].v != 255))
        str += "<div " + this.createStyle("position:absolute; z-index: 2;", 240, 85, 100, 50) + "\">";
        str += this.createImage("csk_touch_indicator.png",
        this.computeX(15, 100), this.computeY(0, 50), this.computeX(68, 100), null);
        str += this.createText("-", 24, "color: #ffffff; text-align: right; z-index: 3;",
        this.computeX(43, 100), this.computeY(13, 50));
        str += "</div>\n";

        // cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
        str += this.createImage("start.gif", 901, 440, 118, null);

        // cc.params['B_CMD'].v &amp;&amp; cc.params['B_CMD'].v == 1 &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v == 'S7-3')
        str += this.createImage("pauza.png", 942, 390, 40, null);

        // cc.params['B_CMD'].v == 1 &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v !== 'OFF' &amp;&amp; cc.params['B_STATE'].v !== 'S7-3'
        str += this.createImage("playradi.gif", 942, 390, 40, null);

        str += this.createText("S7-2", 32, "color: #ffffff; text-align: center; z-index: 3;", 900, 360, 120);

        // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v===undefined || (cc.params['B_STATE'].v==='OFF')
        // TURN ON BUTTON

        // cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v === 'OFF')
        str += this.createText("", 32,
        "display:block; background-repeat: no-repeat; background-image: url('/local/lovelace-peltec-card/images/start_stop.png'); background-position: 0px 0px;",
        945, 390, 36, 36);

        //cc.params['B_CMD'].v == 0 &amp;&amp; cc.params['B_STATE'].v !== 'OFF'
        str += this.createImage("stopradi.gif", 942, 390, 36, "auto");

        // cc.isLive &amp;&amp; cc.permissions === '2' &amp;&amp; cc.params['B_STATE'].v &amp;&amp; (cc.params['B_STATE'].v!=='OFF')
        // TURN OFF BUTTON

        str += "</div>\n";
        return str;
    }
}
